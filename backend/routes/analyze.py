from fastapi import APIRouter, Depends, HTTPException
from models.schemas import AnalysisRequest, AnalysisResponse, Clause, Question
from services.auth import get_current_user
from services.supabase_client import supabase
from services.analysis_service import run_full_analysis, mark_analysis_failed
from services.logger import get_logger

logger = get_logger("routes.analyze")

router = APIRouter()


@router.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_document(
    request: AnalysisRequest,
    user_id: str = Depends(get_current_user),
):
    language = request.language if request.language in ("en", "ta") else "en"

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

    existing = (
        supabase.table("analyses")
        .select("*")
        .eq("contract_id", request.contract_id)
        .eq("status", "completed")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if existing.data:
        analysis = existing.data[0]
        cached_language = analysis.get("language", "en")

        if cached_language == language:
            analysis_id = analysis["id"]

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

            logger.info(f"Serving cached analysis {analysis_id} for contract {request.contract_id} (lang={language})")

            return AnalysisResponse(
                contract_id=request.contract_id,
                filename=contract_data["original_file_name"],
                document_type=analysis.get("document_type", contract_data.get("document_type", "Other")),
                summary=analysis["summary"],
                clauses=[
                    Clause(
                        title=c["title"],
                        original_text=c["original_text"],
                        simple_explanation=c["simple_explanation"],
                        risk_level=c["risk_level"],
                        risk_reason=c["risk_reason"],
                    )
                    for c in clauses_data
                ],
                risk_score=analysis["risk_score"],
                risk_factors=[r["factor_text"] for r in risk_factors_data],
                questions=[
                    Question(question=q["question_text"], context=q.get("context", ""))
                    for q in questions_data
                ],
                status="completed",
                language=language,
                created_at=analysis.get("created_at"),
            )
        else:
            logger.info(f"Cache miss: requested lang={language}, cached lang={cached_language}. Running new analysis.")

    file_url = contract_data.get("file_url", "")
    extracted_text = contract_data.get("extracted_text", "")

    if not extracted_text:
        raise HTTPException(status_code=400, detail="No extracted text available for this contract. Please re-upload.")

    supabase.table("contracts").update({"status": "processing"}).eq("id", request.contract_id).execute()

    try:
        analysis_id = await run_full_analysis(
            contract_id=request.contract_id,
            user_id=user_id,
            file_url=file_url,
            extracted_text=extracted_text,
            language=language,
        )
    except Exception as e:
        mark_analysis_failed(request.contract_id, user_id, str(e))
        supabase.table("contracts").update({"status": "failed"}).eq("id", request.contract_id).execute()
        logger.error(f"Analysis pipeline failed: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")

    supabase.table("contracts").update({"status": "completed"}).eq("id", request.contract_id).execute()

    analysis_row = supabase.table("analyses").select("*").eq("id", analysis_id).single().execute().data
    clauses_data = supabase.table("clauses").select("*").eq("analysis_id", analysis_id).order("sort_order").execute().data
    risk_factors_data = supabase.table("risk_factors").select("factor_text").eq("analysis_id", analysis_id).execute().data
    questions_data = supabase.table("questions").select("*").eq("analysis_id", analysis_id).execute().data

    return AnalysisResponse(
        contract_id=request.contract_id,
        filename=contract_data["original_file_name"],
        document_type=analysis_row.get("document_type", "Other"),
        summary=analysis_row["summary"],
        clauses=[
            Clause(
                title=c["title"],
                original_text=c["original_text"],
                simple_explanation=c["simple_explanation"],
                risk_level=c["risk_level"],
                risk_reason=c["risk_reason"],
            )
            for c in clauses_data
        ],
        risk_score=analysis_row["risk_score"],
        risk_factors=[r["factor_text"] for r in risk_factors_data],
        questions=[
            Question(question=q["question_text"], context=q.get("context", ""))
            for q in questions_data
        ],
        status="completed",
        language=language,
        created_at=analysis_row.get("created_at"),
    )
