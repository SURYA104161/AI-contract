from fastapi import APIRouter, Depends, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.auth import get_current_user
from services.supabase_client import supabase
from services.analyzer import generate_chat_response
from services.logger import get_logger

logger = get_logger("routes.chat")

router = APIRouter()


@router.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
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
    extracted_text = contract_data.get("extracted_text", "")
    document_type = contract_data.get("document_type", "Other")

    if not extracted_text:
        raise HTTPException(status_code=400, detail="No extracted text available for this contract")

    context = extracted_text[:4000]

    answer = generate_chat_response(
        question=request.question,
        contract_context=context,
        document_type=document_type,
    )

    return ChatResponse(answer=answer)
