import os
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from config import REPORT_DIR

def generate_pdf_report(filename: str, analysis: dict) -> str:
    os.makedirs(REPORT_DIR, exist_ok=True)
    output_path = os.path.join(REPORT_DIR, f"{analysis['document_id']}_report.pdf")

    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    title_style = ParagraphStyle("Title2", parent=styles["Title"], fontSize=18, spaceAfter=20)
    heading_style = ParagraphStyle("Heading2", parent=styles["Heading2"], fontSize=14, spaceAfter=10, textColor=colors.HexColor("#1a56db"))
    normal_style = ParagraphStyle("Normal2", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16)
    risk_style = ParagraphStyle("Risk", parent=styles["Normal"], fontSize=11, spaceAfter=6, leading=16, textColor=colors.HexColor("#dc2626"))

    story.append(Paragraph("AI Contract & Agreement Explainer - Report", title_style))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(f"<b>Document:</b> {analysis['filename']}", normal_style))
    story.append(Paragraph(f"<b>Type:</b> {analysis['document_type']}", normal_style))
    story.append(Paragraph(f"<b>Risk Score:</b> {analysis['risk_score']}/100", normal_style))
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph("Summary", heading_style))
    story.append(Paragraph(analysis["summary"], normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Risk Factors", heading_style))
    if analysis["risk_factors"]:
        for factor in analysis["risk_factors"]:
            story.append(Paragraph(f"⚠ {factor}", risk_style))
    else:
        story.append(Paragraph("No significant risk factors identified.", normal_style))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Clause Analysis", heading_style))
    risk_colors = {"High": "#dc2626", "Medium": "#ea580c", "Low": "#16a34a"}
    for clause in analysis["clauses"]:
        color = risk_colors.get(clause["risk_level"], "#6b7280")
        story.append(Paragraph(f"<b>{clause['title']}</b> - <font color='{color}'>{clause['risk_level']} Risk</font>", heading_style))
        story.append(Paragraph(f"<b>Explanation:</b> {clause['simple_explanation']}", normal_style))
        story.append(Paragraph(f"<b>Reason:</b> {clause['risk_reason']}", normal_style))
        story.append(Spacer(1, 0.1 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("Questions to Ask Before Signing", heading_style))
    for i, q in enumerate(analysis["questions"], 1):
        story.append(Paragraph(f"{i}. {q['question']}", normal_style))

    doc.build(story)
    return output_path
