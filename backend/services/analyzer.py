import json
import re
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL
from services.logger import get_logger

logger = get_logger("analyzer")

client = Groq(api_key=GROQ_API_KEY)

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in plain simple English that a non-lawyer can understand.",
    "ta": "Respond entirely in Tamil (தமிழ்). Use clear, simple Tamil that a non-lawyer can understand. All explanations, reasons, and questions must be in Tamil script.",
}

RISK_LEVEL_LABELS = {
    "en": {"Low": "Low", "Medium": "Medium", "High": "High"},
    "ta": {"Low": "குறைவு", "Medium": "நடுத்தரம்", "High": "அதிகம்"},
}


def _get_system_prompt(language: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    return f"""You are a legal document analysis AI. Your job is to help ordinary people understand legal documents.

{lang_instruction}

For each clause provided, output a JSON object with:
1. "simple_explanation": Explain the clause in simple terms (2-3 sentences).
2. "risk_level": One of "Low", "Medium", or "High" based on how risky the clause is for the signing party. Always use the English words Low, Medium, or High for this field.
3. "risk_reason": A brief reason why this clause is rated that way.
4. "suggested_question": A question the user should ask before signing related to this clause.

Only output valid JSON, no other text."""


def _get_summary_prompt(language: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    return f"""You are a legal document analysis AI. Given the document type and clauses found in a legal document, provide a brief summary of what this document covers (2-3 sentences).

{lang_instruction}

Output as a JSON object with key "summary". Only output valid JSON."""


def _get_question_prompt(language: str) -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    return f"""You are a legal document analysis AI. Based on the document type and clauses, generate 5 important questions the signer should ask before signing this document.

{lang_instruction}

Output as a JSON object with key "questions" containing an array of strings. Only output valid JSON."""


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def analyze_clause(clause_title: str, clause_text: str, document_type: str, language: str = "en") -> dict:
    system_prompt = _get_system_prompt(language)
    prompt = f"""Document Type: {document_type}
Clause Title: {clause_title}
Clause Text: {clause_text}

Analyze this clause and return a JSON object with keys: simple_explanation, risk_level, risk_reason, suggested_question."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
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
        if language == "ta":
            return {
                "simple_explanation": f"இந்த உட்பிரிவு {clause_title} பற்றியது. விரிவான விளக்கத்திற்கு சட்ட நிபுணரை அணுகவும்.",
                "risk_level": "Medium",
                "risk_reason": "API பிழை காரணமாக பகுப்பாய்வு செய்ய இயலவில்லை.",
                "suggested_question": f"{clause_title} உட்பிரிவு எனக்கு என்ன பொருள்?",
            }
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


def generate_summary(document_type: str, clauses: list, language: str = "en") -> str:
    system_prompt = _get_summary_prompt(language)
    clause_names = [_clause_name(c) for c in clauses]
    prompt = f"""Document Type: {document_type}
Clauses Found: {', '.join(clause_names)}

Provide a brief summary of what this document covers."""

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
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
        if language == "ta":
            return "இது ஒரு சட்ட ஆவணம். தயவுசெய்து அதை கவனமாக மதிப்பாய்வு செய்யுங்கள்."
        return "This is a legal document. Please review it carefully."


def generate_questions(document_type: str, clauses: list, language: str = "en") -> list[dict]:
    system_prompt = _get_question_prompt(language)
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
                {"role": "system", "content": system_prompt},
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
        if language == "ta":
            return [
                {"question": "இந்த உட்பிரிவுகளை பேச்சுவார்த்தை செய்ய முடியுமா?", "context": "பேச்சுவார்த்தை"},
                {"question": "இந்த ஒப்பந்தத்தை நான் ரத்து செய்தால் என்ன நடக்கும்?", "context": "ரத்து"},
                {"question": "மறைந்த கட்டணங்கள் அல்லது கட்டணங்கள் ஏதேனும் உள்ளதா?", "context": "கட்டணங்கள்"},
                {"question": "முடிவுக்கு வர எவ்வளவு அறிவிப்பு தேவை?", "context": "முடிவு"},
                {"question": "வாக்குவாதம் ஏற்பட்டால் சட்ட செலவுகளை யார் ஏற்றுக்கொள்வார்கள்?", "context": "சட்ட செலவுகள்"},
            ]
        return [
            {"question": "Can any of these clauses be negotiated?", "context": "General negotiation"},
            {"question": "What happens if I want to cancel this agreement?", "context": "Cancellation"},
            {"question": "Are there any hidden fees or charges?", "context": "Fees"},
            {"question": "How much notice is required to terminate?", "context": "Termination"},
            {"question": "Who bears legal costs in case of a dispute?", "context": "Legal costs"},
        ]


def generate_chat_response(question: str, contract_context: str, document_type: str, language: str = "en") -> str:
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    prompt = f"""You are a legal document assistant. A user has uploaded a {document_type} contract.
Here is the relevant contract information:

{contract_context}

The user asks: {question}

Answer the question referencing specific clauses from the contract when relevant. Be helpful and concise. {lang_instruction}"""

    system_content = f"You are a helpful legal document assistant. Answer questions about uploaded contracts. {lang_instruction}"

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_content},
                {"role": "user", "content": prompt},
            ],
            temperature=0.5,
            max_tokens=800,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"LLM chat response failed: {e}")
        if language == "ta":
            return "மன்னிக்கவும், உங்கள் கேள்வியை இப்போது செயலாக்க இயலவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்."
        return "I'm sorry, I couldn't process your question right now. Please try again later."
