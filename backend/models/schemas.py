from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    contract_id: str = Field(..., min_length=1, description="Contract UUID")
    language: str = Field(default="en", description="Output language: 'en' for English, 'ta' for Tamil")


class Clause(BaseModel):
    title: str
    original_text: str
    simple_explanation: str
    risk_level: str
    risk_reason: str


class Question(BaseModel):
    question: str
    context: str = ""


class AnalysisResponse(BaseModel):
    contract_id: str
    filename: str
    document_type: str
    summary: str
    clauses: list[Clause]
    risk_score: int
    risk_factors: list[str]
    questions: list[Question]
    status: str
    language: str = "en"
    created_at: str | None = None


class ChatRequest(BaseModel):
    contract_id: str = Field(..., min_length=1)
    question: str = Field(..., min_length=1, max_length=2000)
    language: str = Field(default="en", description="Response language: 'en' for English, 'ta' for Tamil")


class ChatResponse(BaseModel):
    answer: str
