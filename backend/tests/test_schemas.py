import sys
import os
import pytest
from pydantic import ValidationError

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    Clause,
    Question,
    ChatRequest,
    ChatResponse,
)


class TestAnalysisRequest:
    def test_valid_request(self):
        req = AnalysisRequest(contract_id="abc-123")
        assert req.contract_id == "abc-123"
        assert req.language == "en"

    def test_tamil_language(self):
        req = AnalysisRequest(contract_id="abc-123", language="ta")
        assert req.language == "ta"

    def test_empty_contract_id_fails(self):
        with pytest.raises(ValidationError):
            AnalysisRequest(contract_id="")

    def test_missing_contract_id_fails(self):
        with pytest.raises(ValidationError):
            AnalysisRequest()


class TestClause:
    def test_valid_clause(self):
        clause = Clause(
            title="Salary",
            original_text="Monthly salary is $5000",
            simple_explanation="You get paid $5000/month",
            risk_level="Low",
            risk_reason="Standard clause",
        )
        assert clause.title == "Salary"
        assert clause.risk_level == "Low"


class TestAnalysisResponse:
    def test_valid_response(self):
        resp = AnalysisResponse(
            contract_id="abc-123",
            filename="contract.pdf",
            document_type="Employment",
            summary="An employment contract",
            clauses=[],
            risk_score=45,
            risk_factors=[],
            questions=[],
            status="completed",
        )
        assert resp.language == "en"

    def test_tamil_response(self):
        resp = AnalysisResponse(
            contract_id="abc-123",
            filename="contract.pdf",
            document_type="Employment",
            summary="An employment contract",
            clauses=[],
            risk_score=45,
            risk_factors=[],
            questions=[],
            status="completed",
            language="ta",
        )
        assert resp.language == "ta"


class TestChatRequest:
    def test_valid_chat(self):
        req = ChatRequest(contract_id="abc-123", question="What is the notice period?")
        assert req.language == "en"

    def test_tamil_chat(self):
        req = ChatRequest(contract_id="abc-123", question="அறிவிப்பு காலம் என்ன?", language="ta")
        assert req.language == "ta"

    def test_empty_question_fails(self):
        with pytest.raises(ValidationError):
            ChatRequest(contract_id="abc-123", question="")

    def test_long_question_fails(self):
        with pytest.raises(ValidationError):
            ChatRequest(contract_id="abc-123", question="x" * 2001)


class TestChatResponse:
    def test_valid_response(self):
        resp = ChatResponse(answer="The notice period is 30 days.")
        assert resp.answer == "The notice period is 30 days."


class TestQuestion:
    def test_valid_question(self):
        q = Question(question="Can this be negotiated?", context="Related to salary")
        assert q.context == "Related to salary"

    def test_question_without_context(self):
        q = Question(question="What does this mean?")
        assert q.context == ""
