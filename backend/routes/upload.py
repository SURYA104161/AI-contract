import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException
from config import UPLOAD_DIR
from services.ocr import extract_text_from_pdf

router = APIRouter()

@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    doc_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{doc_id}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        text = extract_text_from_pdf(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    if not text.strip():
        os.remove(file_path)
        raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")

    return {
        "document_id": doc_id,
        "filename": file.filename,
        "file_path": file_path,
        "text_length": len(text),
        "text": text
    }
