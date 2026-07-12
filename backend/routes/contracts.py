from fastapi import APIRouter, Depends, HTTPException
from services.auth import get_current_user
from services.supabase_client import supabase
from services.logger import get_logger

logger = get_logger("routes.contracts")

router = APIRouter()


@router.get("/api/contracts")
async def list_contracts(user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("contracts")
        .select("id, original_file_name, stored_file_name, storage_path, file_url, file_size, mime_type, status, document_type, uploaded_at")
        .eq("user_id", user_id)
        .order("uploaded_at", desc=True)
        .execute()
    )
    return {"contracts": result.data}


@router.get("/api/contracts/{contract_id}")
async def get_contract(contract_id: str, user_id: str = Depends(get_current_user)):
    result = (
        supabase.table("contracts")
        .select("*")
        .eq("id", contract_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Contract not found")

    return result.data


@router.delete("/api/contracts/{contract_id}")
async def delete_contract(contract_id: str, user_id: str = Depends(get_current_user)):
    contract = (
        supabase.table("contracts")
        .select("*")
        .eq("id", contract_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not contract.data:
        raise HTTPException(status_code=404, detail="Contract not found")

    storage_path = contract.data.get("storage_path", "")

    analyses = (
        supabase.table("analyses")
        .select("id")
        .eq("contract_id", contract_id)
        .execute()
    )

    if analyses.data:
        analysis_ids = [a["id"] for a in analyses.data]
        supabase.table("questions").delete().in_("analysis_id", analysis_ids).execute()
        supabase.table("risk_factors").delete().in_("analysis_id", analysis_ids).execute()
        supabase.table("clauses").delete().in_("analysis_id", analysis_ids).execute()
        supabase.table("analyses").delete().in_("id", analysis_ids).execute()

    supabase.table("contracts").delete().eq("id", contract_id).execute()

    if storage_path:
        try:
            supabase.storage.from_("contracts").remove([storage_path])
        except Exception as e:
            logger.warning(f"Failed to delete storage file: {e}")

    logger.info(f"Contract deleted: {contract_id}")
    return {"message": "Contract deleted"}


@router.get("/api/dashboard/stats")
async def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    contracts = (
        supabase.table("contracts")
        .select("id, status")
        .eq("user_id", user_id)
        .execute()
    ).data

    total_contracts = len(contracts)

    completed_analyses = (
        supabase.table("analyses")
        .select("risk_score")
        .eq("user_id", user_id)
        .eq("status", "completed")
        .execute()
    ).data

    total_analyses = len(completed_analyses)
    high_risk_count = sum(1 for a in completed_analyses if a.get("risk_score", 0) >= 60)

    if completed_analyses:
        avg_risk = round(sum(a.get("risk_score", 0) for a in completed_analyses) / len(completed_analyses))
    else:
        avg_risk = 0

    recent = (
        supabase.table("contracts")
        .select("id, original_file_name, uploaded_at")
        .eq("user_id", user_id)
        .order("uploaded_at", desc=True)
        .limit(5)
        .execute()
    ).data

    recent_with_risk = []
    for c in recent:
        analysis = (
            supabase.table("analyses")
            .select("risk_score")
            .eq("contract_id", c["id"])
            .eq("status", "completed")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        ).data

        risk = analysis[0]["risk_score"] if analysis else None
        risk_label = "Low" if risk is not None and risk < 30 else ("Medium" if risk is not None and risk < 60 else "High" if risk is not None else "Pending")

        recent_with_risk.append({
            "id": c["id"],
            "name": c["original_file_name"],
            "date": c["uploaded_at"],
            "risk": risk,
            "risk_label": risk_label,
        })

    return {
        "total_contracts": total_contracts,
        "total_analyses": total_analyses,
        "average_risk": avg_risk,
        "high_risk_count": high_risk_count,
        "recent_contracts": recent_with_risk,
    }


@router.get("/api/history")
async def get_history(user_id: str = Depends(get_current_user)):
    analyses = (
        supabase.table("analyses")
        .select("id, contract_id, document_type, risk_score, status, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    ).data

    history = []
    for a in analyses:
        contract = (
            supabase.table("contracts")
            .select("original_file_name")
            .eq("id", a["contract_id"])
            .single()
            .execute()
        ).data

        history.append({
            "id": a["id"],
            "contract_id": a["contract_id"],
            "name": contract["original_file_name"] if contract else "Unknown",
            "date": a["created_at"],
            "risk": a.get("risk_score", 0),
            "status": a["status"],
            "document_type": a.get("document_type", "Other"),
        })

    return {"history": history}
