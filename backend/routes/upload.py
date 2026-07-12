import io
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from services.auth import get_current_user
from services.supabase_client import supabase
from services.ocr import extract_text_from_bytes
from services.classifier import classify_document
from config import MAX_FILE_SIZE
from services.logger import get_logger

logger = get_logger("routes.upload")

router = APIRouter()


@router.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    if not content:
        raise HTTPException(status_code=400, detail="Empty file")

    stored_filename = f"{file.filename}"
    storage_path = f"{user_id}/{stored_filename}"

    try:
        supabase.storage.from_("contracts").upload(storage_path, content, {"upsert": "true"})
    except Exception as e:
        logger.error(f"Storage upload failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file to storage")

    try:
        public_url = supabase.storage.from_("contracts").get_public_url(storage_path)
    except Exception:
        public_url = ""

    try:
        text = extract_text_from_bytes(content)
    except Exception as e:
        supabase.storage.from_("contracts").remove([storage_path])
        logger.error(f"Text extraction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF")

    if not text.strip():
        supabase.storage.from_("contracts").remove([storage_path])
        raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")

    document_type = classify_document(text)

    try:
        insert_result = supabase.table("contracts").insert({
            "user_id": user_id,
            "original_file_name": file.filename,
            "stored_file_name": stored_filename,
            "storage_path": storage_path,
            "file_url": public_url,
            "file_size": len(content),
            "mime_type": file.content_type or "application/pdf",
            "status": "uploaded",
            "extracted_text": text,
            "text_length": len(text),
            "document_type": document_type,
        }).execute()

        contract_id = insert_result.data[0]["id"]
    except Exception as e:
        supabase.storage.from_("contracts").remove([storage_path])
        logger.error(f"DB insert failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to save contract metadata")

    logger.info(f"Contract uploaded: {contract_id} by user {user_id}")

    return {
        "contract_id": contract_id,
        "filename": file.filename,
        "text_length": len(text),
        "document_type": document_type,
    }
