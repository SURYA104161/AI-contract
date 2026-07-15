import io
import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from services.logger import get_logger

logger = get_logger("report_gen")

FONT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "fonts")
TAMIL_FONT_PATH = os.path.join(FONT_DIR, "NotoSansTamil-Regular.ttf")

_tamil_font_registered = False


def _register_tamil_font():
    global _tamil_font_registered
    if _tamil_font_registered:
        return
    try:
        if os.path.exists(TAMIL_FONT_PATH):
            pdfmetrics.registerFont(TTFont("NotoSansTamil", TAMIL_FONT_PATH))
            _tamil_font_registered = True
            logger.info("Tamil font registered successfully")
        else:
            logger.warning(f"Tamil font not found at {TAMIL_FONT_PATH}")
    except Exception as e:
        logger.error(f"Failed to register Tamil font: {e}")


REPORT_TITLES = {
    "en": {
        "title": "AI Contract & Agreement Explainer - Report",
        "document": "Document",
        "type": "Type",
        "risk_score": "Risk Score",
        "summary": "Summary",
        "risk_factors": "Risk Factors",
        "no_risk_factors": "No significant risk factors identified.",
        "clause_analysis": "Clause Analysis",
        "explanation": "Explanation",
        "reason": "Reason",
        "questions_heading": "Questions to Ask Before Signing",
    },
    "ta": {
        "title": "AI ஒப்பந்த விளக்க அறிக்கை",
        "document": "ஆவணம்",
        "type": "வகை",
        "risk_score": "ஆபத்து மதிப்பெண்",
        "summary": "சுருக்கம்",
        "risk_factors": "ஆபத்து காரணிகள்",
        "no_risk_factors": "குறிப்பிடத்தக்க ஆபத்து காரணிகள் எதுவும் கண்டறியப்படவில்லை.",
        "clause_analysis": "உட்பிரிவு பகுப்பாய்வு",
        "explanation": "விளக்கம்",
        "reason": "காரணம்",
        "questions_heading": "கையொப்பமிடுவதற்கு முன் கேட்க வேண்டிய கேள்விகள்",
    },
}

RISK_LABELS = {
    "en": {"High": "High Risk", "Medium": "Medium Risk", "Low": "Low Risk"},
    "ta": {"High": "அதிக ஆபத்து", "Medium": "நடுத்தர ஆபத்து", "Low": "குறைந்த ஆபத்து"},
}


def _escape_xml(text: str) -> str:
    text = re.sub(r"&", "&amp;", text)
    text = re.sub(r"<", "&lt;", text)
    text = re.sub(r">", "&gt;", text)
    return text


def generate_pdf_report(filename: str, analysis: dict, language: str = "en") -> bytes:
    if language == "ta":
        _register_tamil_font()

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    titles = REPORT_TITLES.get(language, REPORT_TITLES["en"])
    risk_labels = RISK_LABELS.get(language, RISK_LABELS["en"])

    font_name = "NotoSansTamil" if (language == "ta" and _tamil_font_registered) else "Helvetica"

    title_style = ParagraphStyle(
        "Title2", parent=styles["Title"], fontSize=18, spaceAfter=20, fontName=font_name,
    )
    heading_style = ParagraphStyle(
        "Heading2", parent=styles["Heading2"], fontSize=14, spaceAfter=10,
        textColor=colors.HexColor("#1a56db"), fontName=font_name,
    )
    normal_style = ParagraphStyle(
        "Normal2", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16,
        fontName=font_name,
    )
    risk_style = ParagraphStyle(
        "Risk", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16,
        textColor=colors.HexColor("#dc2626"), fontName=font_name,
    )

    story.append(Paragraph(_escape_xml(titles["title"]), title_style))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(f"<b>{_escape_xml(titles['document'])}:</b> {_escape_xml(filename)}", normal_style))
    story.append(Paragraph(f"<b>{_escape_xml(titles['type'])}:</b> {_escape_xml(analysis['document_type'])}", normal_style))
    story.append(Paragraph(f"<b>{_escape_xml(titles['risk_score'])}:</b> {analysis['risk_score']}/100", normal_style))
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph(_escape_xml(titles["summary"]), heading_style))
    story.append(Paragraph(_escape_xml(analysis["summary"]), normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph(_escape_xml(titles["risk_factors"]), heading_style))
    if analysis.get("risk_factors"):
        for factor in analysis["risk_factors"]:
            story.append(Paragraph(f"\u26a0 {_escape_xml(factor)}", risk_style))
    else:
        story.append(Paragraph(_escape_xml(titles["no_risk_factors"]), normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph(_escape_xml(titles["clause_analysis"]), heading_style))
    risk_colors = {"High": "#dc2626", "Medium": "#ea580c", "Low": "#16a34a"}
    for clause in analysis["clauses"]:
        color = risk_colors.get(clause["risk_level"], "#6b7280")
        risk_label = risk_labels.get(clause["risk_level"], clause["risk_level"])
        story.append(Paragraph(
            f"<b>{_escape_xml(clause['title'])}</b> - "
            f"<font color='{color}'>{_escape_xml(risk_label)}</font>",
            heading_style,
        ))
        explanation_label = titles["explanation"]
        reason_label = titles["reason"]
        story.append(Paragraph(
            f"<b>{_escape_xml(explanation_label)}:</b> {_escape_xml(clause['simple_explanation'])}", normal_style,
        ))
        story.append(Paragraph(
            f"<b>{_escape_xml(reason_label)}:</b> {_escape_xml(clause['risk_reason'])}", normal_style,
        ))
        story.append(Spacer(1, 0.1 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(_escape_xml(titles["questions_heading"]), heading_style))
    for i, q in enumerate(analysis["questions"], 1):
        story.append(Paragraph(f"{i}. {_escape_xml(q['question'])}", normal_style))

    doc.build(story)
    return buffer.getvalue()
