import io
import pymupdf
from PIL import Image
import pytesseract
from config import TESSERACT_PATH
from services.logger import get_logger

logger = get_logger("ocr")

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def extract_text_from_pdf(file_path: str) -> str:
    text_parts = []

    try:
        doc = pymupdf.open(file_path)
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
    except Exception as e:
        raise RuntimeError(f"Failed to open PDF with PyMuPDF: {e}")

    text = "".join(text_parts).strip()
    if text:
        return text

    return extract_text_with_ocr(file_path)


def extract_text_with_ocr(file_path: str) -> str:
    text_parts = []
    try:
        doc = pymupdf.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))
            text_parts.append(pytesseract.image_to_string(img))
        doc.close()
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {e}")

    return "\n".join(text_parts).strip()


def extract_text_from_bytes(pdf_bytes: bytes) -> str:
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    text_parts = [page.get_text() for page in doc]
    doc.close()
    text = "".join(text_parts).strip()
    if text:
        return text

    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    ocr_parts = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=300)
        img_bytes = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_bytes))
        ocr_parts.append(pytesseract.image_to_string(img))
    doc.close()
    return "\n".join(ocr_parts).strip()
