import io
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from services.logger import get_logger

logger = get_logger("report_gen")


def _escape_xml(text: str) -> str:
    text = re.sub(r"&", "&amp;", text)
    text = re.sub(r"<", "&lt;", text)
    text = re.sub(r">", "&gt;", text)
    return text


def generate_pdf_report(filename: str, analysis: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    title_style = ParagraphStyle("Title2", parent=styles["Title"], fontSize=18, spaceAfter=20)
    heading_style = ParagraphStyle(
        "Heading2", parent=styles["Heading2"], fontSize=14, spaceAfter=10,
        textColor=colors.HexColor("#1a56db"),
    )
    normal_style = ParagraphStyle(
        "Normal2", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16,
    )
    risk_style = ParagraphStyle(
        "Risk", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16,
        textColor=colors.HexColor("#dc2626"),
    )

    story.append(Paragraph("AI Contract & Agreement Explainer - Report", title_style))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(f"<b>Document:</b> {_escape_xml(filename)}", normal_style))
    story.append(Paragraph(f"<b>Type:</b> {_escape_xml(analysis['document_type'])}", normal_style))
    story.append(Paragraph(f"<b>Risk Score:</b> {analysis['risk_score']}/100", normal_style))
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph("Summary", heading_style))
    story.append(Paragraph(_escape_xml(analysis["summary"]), normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Risk Factors", heading_style))
    if analysis.get("risk_factors"):
        for factor in analysis["risk_factors"]:
            story.append(Paragraph(f"\u26a0 {_escape_xml(factor)}", risk_style))
    else:
        story.append(Paragraph("No significant risk factors identified.", normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Clause Analysis", heading_style))
    risk_colors = {"High": "#dc2626", "Medium": "#ea580c", "Low": "#16a34a"}
    for clause in analysis["clauses"]:
        color = risk_colors.get(clause["risk_level"], "#6b7280")
        story.append(Paragraph(
            f"<b>{_escape_xml(clause['title'])}</b> - "
            f"<font color='{color}'>{clause['risk_level']} Risk</font>",
            heading_style,
        ))
        story.append(Paragraph(
            f"<b>Explanation:</b> {_escape_xml(clause['simple_explanation'])}", normal_style,
        ))
        story.append(Paragraph(
            f"<b>Reason:</b> {_escape_xml(clause['risk_reason'])}", normal_style,
        ))
        story.append(Spacer(1, 0.1 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Questions to Ask Before Signing", heading_style))
    for i, q in enumerate(analysis["questions"], 1):
        story.append(Paragraph(f"{i}. {_escape_xml(q['question'])}", normal_style))

    doc.build(story)
    return buffer.getvalue()
