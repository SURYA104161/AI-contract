from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from models.schemas import AnalysisRequest
from services.auth import get_current_user
from services.supabase_client import supabase
from services.report_gen import generate_pdf_report
from services.logger import get_logger

logger = get_logger("routes.report")

router = APIRouter()


@router.post("/api/report")
async def download_report(
    request: AnalysisRequest,
    user_id: str = Depends(get_current_user),
):
    contract = (
        supabase.table("contracts")
        .select("*")
        .eq("id", request.contract_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not contract.data:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract_data = contract.data

    analysis = (
        supabase.table("analyses")
        .select("*")
        .eq("contract_id", request.contract_id)
        .eq("status", "completed")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not analysis.data:
        raise HTTPException(status_code=404, detail="No analysis found. Run analysis first.")

    analysis_data = analysis.data[0]
    analysis_id = analysis_data["id"]
    language = analysis_data.get("language", "en")

    clauses_data = (
        supabase.table("clauses")
        .select("*")
        .eq("analysis_id", analysis_id)
        .order("sort_order")
        .execute()
    ).data

    risk_factors_data = (
        supabase.table("risk_factors")
        .select("factor_text")
        .eq("analysis_id", analysis_id)
        .execute()
    ).data

    questions_data = (
        supabase.table("questions")
        .select("*")
        .eq("analysis_id", analysis_id)
        .execute()
    ).data

    analysis_dict = {
        "document_id": request.contract_id,
        "filename": contract_data["original_file_name"],
        "document_type": analysis_data.get("document_type", contract_data.get("document_type", "Other")),
        "summary": analysis_data["summary"],
        "risk_score": analysis_data["risk_score"],
        "risk_factors": [r["factor_text"] for r in risk_factors_data],
        "clauses": [
            {
                "title": c["title"],
                "simple_explanation": c["simple_explanation"],
                "risk_level": c["risk_level"],
                "risk_reason": c["risk_reason"],
            }
            for c in clauses_data
        ],
        "questions": [{"question": q["question_text"]} for q in questions_data],
    }

    try:
        pdf_bytes = generate_pdf_report(contract_data["original_file_name"], analysis_dict, language=language)
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate report")

    safe_name = contract_data["original_file_name"].replace(" ", "_").replace(".pdf", "")
    download_filename = f"contract_analysis_{safe_name}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{download_filename}"'},
    )
