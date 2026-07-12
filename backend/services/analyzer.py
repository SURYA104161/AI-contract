import json
import re
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL
from services.logger import get_logger

logger = get_logger("analyzer")

client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = """You are a legal document analysis AI. Your job is to help ordinary people understand legal documents.

For each clause provided, output a JSON object with:
1. "simple_explanation": Explain the clause in plain simple English that a non-lawyer can understand (2-3 sentences).
2. "risk_level": One of "Low", "Medium", or "High" based on how risky the clause is for the signing party.
3. "risk_reason": A brief reason why this clause is rated that way.
4. "suggested_question": A question the user should ask before signing related to this clause.

Only output valid JSON, no other text."""

SUMMARY_SYSTEM_PROMPT = """You are a legal document analysis AI. Given the document type and clauses found in a legal document, provide a brief summary of what this document covers in plain simple English (2-3 sentences).

Output as a JSON object with key "summary". Only output valid JSON."""

QUESTION_SYSTEM_PROMPT = """You are a legal document analysis AI. Based on the document type and clauses, generate 5 important questions the signer should ask before signing this document.

Output as a JSON object with key "questions" containing an array of strings. Only output valid JSON."""


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def analyze_clause(clause_title: str, clause_text: str, document_type: str) -> dict:
    prompt = f"""Document Type: {document_type}
Clause Title: {clause_title}
Clause Text: {clause_text}

Analyze this clause and return a JSON object with keys: simple_explanation, risk_level, risk_reason, suggested_question."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )
        raw = _strip_code_fences(response.choices[0].message.content)
        result = json.loads(raw)
        return {
            "simple_explanation": result.get("simple_explanation", "No explanation available."),
            "risk_level": result.get("risk_level", "Medium"),
            "risk_reason": result.get("risk_reason", "No reason provided."),
            "suggested_question": result.get("suggested_question", ""),
        }
    except Exception as e:
        logger.error(f"LLM clause analysis failed: {e}")
        return {
            "simple_explanation": f"This clause discusses {clause_title}. Please consult a legal professional for a detailed interpretation.",
            "risk_level": "Medium",
            "risk_reason": "Unable to analyze due to API error.",
            "suggested_question": f"What does the {clause_title} clause mean for me?",
        }


def _clause_name(c):
    return c["title"] if isinstance(c, dict) else c.title


def _clause_risk(c):
    return c.get("risk_level", "Medium") if isinstance(c, dict) else c.risk_level


def generate_summary(document_type: str, clauses: list) -> str:
    clause_names = [_clause_name(c) for c in clauses]
    prompt = f"""Document Type: {document_type}
Clauses Found: {', '.join(clause_names)}

Provide a brief plain-English summary of what this document covers."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SUMMARY_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=300,
        )
        raw = _strip_code_fences(response.choices[0].message.content)
        result = json.loads(raw)
        return result.get("summary", "This is a legal document. Please review it carefully.")
    except Exception as e:
        logger.error(f"LLM summary generation failed: {e}")
        return "This is a legal document. Please review it carefully."


def generate_questions(document_type: str, clauses: list) -> list[dict]:
    clause_names = [_clause_name(c) for c in clauses]
    risks = [_clause_risk(c) for c in clauses]
    prompt = f"""Document Type: {document_type}
Clauses: {', '.join(clause_names)}
Risk Levels: {', '.join(risks)}

Generate 5 important questions the signer should ask before signing."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": QUESTION_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=400,
        )
        raw = _strip_code_fences(response.choices[0].message.content)
        result = json.loads(raw)
        questions = result.get("questions", [])
        return [{"question": q, "context": f"Related to {document_type} document"} for q in questions]
    except Exception as e:
        logger.error(f"LLM question generation failed: {e}")
        return [
            {"question": "Can any of these clauses be negotiated?", "context": "General negotiation"},
            {"question": "What happens if I want to cancel this agreement?", "context": "Cancellation"},
            {"question": "Are there any hidden fees or charges?", "context": "Fees"},
            {"question": "How much notice is required to terminate?", "context": "Termination"},
            {"question": "Who bears legal costs in case of a dispute?", "context": "Legal costs"},
        ]


def generate_chat_response(question: str, contract_context: str, document_type: str) -> str:
    prompt = f"""You are a legal document assistant. A user has uploaded a {document_type} contract.
Here is the relevant contract information:

{contract_context}

The user asks: {question}

Answer the question in plain English, referencing specific clauses from the contract when relevant. Be helpful and concise."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful legal document assistant. Answer questions about uploaded contracts in plain English."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=800,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"LLM chat response failed: {e}")
        return "I'm sorry, I couldn't process your question right now. Please try again later."
