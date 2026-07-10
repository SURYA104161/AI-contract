from pydantic import BaseModel
from typing import Optional

class AnalysisRequest(BaseModel):
    document_id: str

class Clause(BaseModel):
    title: str
    original_text: str
    simple_explanation: str
    risk_level: str
    risk_reason: str

class Question(BaseModel):
    question: str
    context: str

class AnalysisResponse(BaseModel):
    document_id: str
    filename: str
    document_type: str
    summary: str
    clauses: list[Clause]
    risk_score: int
    risk_factors: list[str]
    questions: list[Question]
