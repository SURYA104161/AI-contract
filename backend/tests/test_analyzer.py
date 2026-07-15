import sys
import os
import json
import re
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.analyzer import (
    _strip_code_fences,
    _get_system_prompt,
    _get_summary_prompt,
    _get_question_prompt,
    LANGUAGE_INSTRUCTIONS,
    RISK_LEVEL_LABELS,
    _clause_name,
    _clause_risk,
)


class TestStripCodeFences:
    def test_plain_json(self):
        text = '{"key": "value"}'
        assert _strip_code_fences(text) == '{"key": "value"}'

    def test_json_with_code_fence(self):
        text = '```json\n{"key": "value"}\n```'
        assert _strip_code_fences(text) == '{"key": "value"}'

    def test_code_fence_no_json_tag(self):
        text = '```\n{"key": "value"}\n```'
        assert _strip_code_fences(text) == '{"key": "value"}'

    def test_whitespace_only(self):
        text = '   \n  '
        assert _strip_code_fences(text) == ''

    def test_nested_json(self):
        inner = '{"a": {"b": 1}}'
        assert _strip_code_fences(inner) == inner


class TestLanguageInstructions:
    def test_english_instruction(self):
        assert "English" in LANGUAGE_INSTRUCTIONS["en"]

    def test_tamil_instruction(self):
        assert "Tamil" in LANGUAGE_INSTRUCTIONS["ta"]
        assert "தமிழ்" in LANGUAGE_INSTRUCTIONS["ta"]

    def test_both_languages_exist(self):
        assert "en" in LANGUAGE_INSTRUCTIONS
        assert "ta" in LANGUAGE_INSTRUCTIONS


class TestRiskLevelLabels:
    def test_english_labels(self):
        assert RISK_LEVEL_LABELS["en"]["Low"] == "Low"
        assert RISK_LEVEL_LABELS["en"]["High"] == "High"

    def test_tamil_labels(self):
        assert RISK_LEVEL_LABELS["ta"]["Low"] == "குறைவு"
        assert RISK_LEVEL_LABELS["ta"]["High"] == "அதிகம்"


class TestGetPrompts:
    def test_system_prompt_english(self):
        prompt = _get_system_prompt("en")
        assert "English" in prompt
        assert "JSON" in prompt

    def test_system_prompt_tamil(self):
        prompt = _get_system_prompt("ta")
        assert "Tamil" in prompt
        assert "தமிழ்" in prompt

    def test_summary_prompt_english(self):
        prompt = _get_summary_prompt("en")
        assert "summary" in prompt.lower()

    def test_summary_prompt_tamil(self):
        prompt = _get_summary_prompt("ta")
        assert "Tamil" in prompt

    def test_question_prompt_english(self):
        prompt = _get_question_prompt("en")
        assert "questions" in prompt.lower()

    def test_question_prompt_tamil(self):
        prompt = _get_question_prompt("ta")
        assert "Tamil" in prompt

    def test_unknown_language_fallback(self):
        prompt = _get_system_prompt("fr")
        assert "English" in prompt


class TestClauseHelpers:
    def test_clause_name_dict(self):
        assert _clause_name({"title": "Salary"}) == "Salary"

    def test_clause_name_object(self):
        obj = MagicMock()
        obj.title = "Termination"
        assert _clause_name(obj) == "Termination"

    def test_clause_risk_dict(self):
        assert _clause_risk({"risk_level": "High"}) == "High"

    def test_clause_risk_dict_default(self):
        assert _clause_risk({}) == "Medium"

    def test_clause_risk_object(self):
        obj = MagicMock()
        obj.risk_level = "Low"
        assert _clause_risk(obj) == "Low"


class TestAnalyzerFunctions:
    @patch("services.analyzer.client")
    def test_analyze_clause_english(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps({
            "simple_explanation": "This is a test clause.",
            "risk_level": "Low",
            "risk_reason": "No risk.",
            "suggested_question": "What does this mean?",
        })
        mock_client.chat.completions.create.return_value = mock_response

        from services.analyzer import analyze_clause
        result = analyze_clause("Test", "Test text", "Employment", "en")

        assert result["simple_explanation"] == "This is a test clause."
        assert result["risk_level"] == "Low"

    @patch("services.analyzer.client")
    def test_analyze_clause_tamil(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps({
            "simple_explanation": "இது ஒரு சோதனை உட்பிரிவு.",
            "risk_level": "Medium",
            "risk_reason": "சோதனை காரணம்.",
            "suggested_question": "இதன் பொருள் என்ன?",
        })
        mock_client.chat.completions.create.return_value = mock_response

        from services.analyzer import analyze_clause
        result = analyze_clause("Test", "Test text", "Employment", "ta")

        assert "தமிழ்" in result["simple_explanation"] or "சோதனை" in result["simple_explanation"]

    @patch("services.analyzer.client")
    def test_analyze_clause_api_error_english(self, mock_client):
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        from services.analyzer import analyze_clause
        result = analyze_clause("Test", "Test text", "Employment", "en")

        assert result["risk_level"] == "Medium"
        assert "API error" in result["risk_reason"]

    @patch("services.analyzer.client")
    def test_analyze_clause_api_error_tamil(self, mock_client):
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        from services.analyzer import analyze_clause
        result = analyze_clause("Test", "Test text", "Employment", "ta")

        assert result["risk_level"] == "Medium"
        assert "API" in result["risk_reason"]

    @patch("services.analyzer.client")
    def test_generate_summary_english(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps({
            "summary": "This is an employment contract."
        })
        mock_client.chat.completions.create.return_value = mock_response

        from services.analyzer import generate_summary
        result = generate_summary("Employment", [{"title": "Salary"}], "en")
        assert result == "This is an employment contract."

    @patch("services.analyzer.client")
    def test_generate_summary_api_error_tamil(self, mock_client):
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        from services.analyzer import generate_summary
        result = generate_summary("Employment", [{"title": "Salary"}], "ta")
        assert "சட்ட ஆவணம்" in result

    @patch("services.analyzer.client")
    def test_generate_questions_english(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = json.dumps({
            "questions": ["Can this be negotiated?", "What are the terms?"]
        })
        mock_client.chat.completions.create.return_value = mock_response

        from services.analyzer import generate_questions
        result = generate_questions("Employment", [{"title": "Salary", "risk_level": "Low"}], "en")
        assert len(result) == 2
        assert result[0]["question"] == "Can this be negotiated?"

    @patch("services.analyzer.client")
    def test_generate_questions_api_error_tamil(self, mock_client):
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        from services.analyzer import generate_questions
        result = generate_questions("Employment", [{"title": "Salary", "risk_level": "Low"}], "ta")
        assert len(result) == 5
        assert "உட்பிரிவுகளை" in result[0]["question"]

    @patch("services.analyzer.client")
    def test_generate_chat_response_english(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = "The notice period is 30 days."
        mock_client.chat.completions.create.return_value = mock_response

        from services.analyzer import generate_chat_response
        result = generate_chat_response("What is the notice period?", "Contract text", "Employment", "en")
        assert result == "The notice period is 30 days."

    @patch("services.analyzer.client")
    def test_generate_chat_response_api_error_tamil(self, mock_client):
        mock_client.chat.completions.create.side_effect = Exception("API Error")

        from services.analyzer import generate_chat_response
        result = generate_chat_response("Question?", "Context", "Employment", "ta")
        assert "மன்னிக்கவும்" in result
