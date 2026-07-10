from fastapi import APIRouter, HTTPException
from models.schemas import AnalysisRequest, AnalysisResponse, Clause, Question
from services.classifier import classify_document
from services.clause_extractor import extract_clauses
from services.analyzer import analyze_clause, generate_summary, generate_questions
from services.risk_scorer import calculate_risk_score, identify_risk_factors

router = APIRouter()

@router.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_document(request: AnalysisRequest):
    if not request.document_id:
        raise HTTPException(status_code=400, detail="document_id is required")

    from config import UPLOAD_DIR
    import os

    file_path = None
    for f in os.listdir(UPLOAD_DIR):
        if f.startswith(request.document_id):
            file_path = os.path.join(UPLOAD_DIR, f)
            break

    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        from services.ocr import extract_text_from_pdf
        text = extract_text_from_pdf(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read document: {str(e)}")

    document_type = classify_document(text)

    raw_clauses = extract_clauses(text)
    if not raw_clauses:
        raw_clauses = [{"title": "General", "context": text[:1000]}]

    analyzed_clauses = []
    for clause in raw_clauses:
        result = analyze_clause(clause["title"], clause["context"], document_type)
        analyzed_clauses.append(Clause(
            title=clause["title"],
            original_text=clause["context"],
            simple_explanation=result["simple_explanation"],
            risk_level=result["risk_level"],
            risk_reason=result["risk_reason"]
        ))

    summary = generate_summary(document_type, analyzed_clauses)

    risk_score = calculate_risk_score(analyzed_clauses)
    risk_factors = identify_risk_factors(analyzed_clauses, text)

    questions = generate_questions(document_type, analyzed_clauses)

    filename = os.path.basename(file_path)

    return AnalysisResponse(
        document_id=request.document_id,
        filename=filename,
        document_type=document_type,
        summary=summary,
        clauses=analyzed_clauses,
        risk_score=risk_score,
        risk_factors=risk_factors,
        questions=questions
    )
