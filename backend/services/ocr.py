import os
import fitz
import pdfplumber
from PIL import Image
import pytesseract
import io
from config import TESSERACT_PATH

pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        raise RuntimeError(f"Failed to open PDF with PyMuPDF: {e}")

    if text.strip():
        return text.strip()

    return extract_text_with_ocr(file_path)


def extract_text_with_ocr(file_path: str) -> str:
    text = ""
    try:
        doc = fitz.open(file_path)
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            pix = page.get_pixmap(dpi=300)
            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))
            text += pytesseract.image_to_string(img) + "\n"
        doc.close()
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {e}")

    return text.strip()


def extract_text_with_pdfplumber(file_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise RuntimeError(f"pdfplumber extraction failed: {e}")
    return text.strip()
