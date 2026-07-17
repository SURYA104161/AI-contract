import asyncio
from services.supabase_client import supabase
from services.classifier import classify_document
from services.clause_extractor import extract_clauses
from services.analyzer import analyze_clause, generate_summary, generate_questions
from services.risk_scorer import calculate_risk_score, identify_risk_factors
from services.logger import get_logger

logger = get_logger("analysis_service")


async def analyze_single_clause(clause: dict, document_type: str, language: str = "en") -> dict:
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        analyze_clause,
        clause["title"],
        clause["context"],
        document_type,
        language,
    )
    return {
        "title": clause["title"],
        "original_text": clause["context"],
        "simple_explanation": result["simple_explanation"],
        "risk_level": result["risk_level"],
        "risk_reason": result["risk_reason"],
    }


async def run_full_analysis(contract_id: str, user_id: str, file_url: str, extracted_text: str, language: str = "en") -> str:
    loop = asyncio.get_event_loop()

    document_type = await loop.run_in_executor(None, classify_document, extracted_text)

    raw_clauses = extract_clauses(extracted_text)
    if not raw_clauses:
        raw_clauses = [{"title": "General", "context": extracted_text[:1000]}]

    analyzed_clauses = await asyncio.gather(
        *[analyze_single_clause(c, document_type, language) for c in raw_clauses]
    )
    analyzed_clauses = list(analyzed_clauses)

    summary = await loop.run_in_executor(
        None, generate_summary, document_type, analyzed_clauses, language
    )
    risk_score = calculate_risk_score(analyzed_clauses)
    risk_factors = identify_risk_factors(analyzed_clauses, extracted_text)
    questions = await loop.run_in_executor(
        None, generate_questions, document_type, analyzed_clauses, language
    )

    analysis_insert = supabase.table("analyses").insert({
        "contract_id": contract_id,
        "user_id": user_id,
        "summary": summary,
        "risk_score": risk_score,
        "document_type": document_type,
        "language": language,
        "status": "completed",
    }).execute()

    analysis_id = analysis_insert.data[0]["id"]

    clause_rows = []
    for i, clause in enumerate(analyzed_clauses):
        clause_rows.append({
            "analysis_id": analysis_id,
            "title": clause["title"],
            "original_text": clause["original_text"],
            "simple_explanation": clause["simple_explanation"],
            "risk_level": clause["risk_level"],
            "risk_reason": clause["risk_reason"],
            "sort_order": i,
        })
    if clause_rows:
        supabase.table("clauses").insert(clause_rows).execute()

    if risk_factors:
        rf_rows = [{"analysis_id": analysis_id, "factor_text": f} for f in risk_factors]
        supabase.table("risk_factors").insert(rf_rows).execute()

    if questions:
        q_rows = [
            {"analysis_id": analysis_id, "question_text": q["question"], "context": q.get("context", "")}
            for q in questions
        ]
        supabase.table("questions").insert(q_rows).execute()

    supabase.table("contracts").update({"document_type": document_type}).eq("id", contract_id).execute()

    logger.info(f"Analysis completed for contract {contract_id}: analysis_id={analysis_id}, risk_score={risk_score}, language={language}")
    return analysis_id


def mark_analysis_failed(contract_id: str, user_id: str, error_message: str):
    supabase.table("analyses").insert({
        "contract_id": contract_id,
        "user_id": user_id,
        "summary": "",
        "risk_score": 0,
        "status": "failed",
        "error_message": error_message,
    }).execute()
    logger.error(f"Analysis failed for contract {contract_id}: {error_message}")
