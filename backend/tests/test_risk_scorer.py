import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.risk_scorer import calculate_risk_score, identify_risk_factors


class TestCalculateRiskScore:
    def test_empty_clauses(self):
        assert calculate_risk_score([]) == 0

    def test_all_low_risk(self):
        clauses = [
            {"risk_level": "Low"},
            {"risk_level": "Low"},
            {"risk_level": "Low"},
        ]
        score = calculate_risk_score(clauses)
        assert score < 30

    def test_all_high_risk(self):
        clauses = [
            {"risk_level": "High"},
            {"risk_level": "High"},
            {"risk_level": "High"},
        ]
        score = calculate_risk_score(clauses)
        assert score == 100

    def test_mixed_risk(self):
        clauses = [
            {"risk_level": "High"},
            {"risk_level": "Medium"},
            {"risk_level": "Low"},
        ]
        score = calculate_risk_score(clauses)
        assert 30 <= score <= 80

    def test_score_capped_at_100(self):
        clauses = [{"risk_level": "High"}] * 20
        score = calculate_risk_score(clauses)
        assert score <= 100

    def test_single_clause(self):
        score = calculate_risk_score([{"risk_level": "Medium"}])
        assert 0 <= score <= 100

    def test_dict_and_object_clauses(self):
        class MockClause:
            def __init__(self, risk_level):
                self.risk_level = risk_level

        clauses_dict = [{"risk_level": "High"}, {"risk_level": "Low"}]
        clauses_obj = [MockClause("High"), MockClause("Low")]

        score_dict = calculate_risk_score(clauses_dict)
        score_obj = calculate_risk_score(clauses_obj)
        assert score_dict == score_obj


class TestIdentifyRiskFactors:
    def test_no_factors(self):
        text = "This is a benign contract."
        factors = identify_risk_factors([], text)
        assert isinstance(factors, list)

    def test_termination_keywords(self):
        clauses = [{"title": "Termination", "risk_level": "High"}]
        text = "The employer may terminate without cause at any time."
        factors = identify_risk_factors(clauses, text)
        assert "One-sided termination" in factors

    def test_hidden_fees(self):
        text = "A processing fee and administrative fee will be charged."
        factors = identify_risk_factors([], text)
        assert "Hidden fees" in factors

    def test_high_risk_clause_factor(self):
        clauses = [{"title": "Non-Compete", "risk_level": "High"}]
        factors = identify_risk_factors(clauses, "")
        high_risk = [f for f in factors if f.startswith("High-risk clause:")]
        assert len(high_risk) > 0

    def test_auto_renewal(self):
        text = "This contract will automatically renew each year."
        factors = identify_risk_factors([], text)
        assert "Auto renewal" in factors

    def test_no_refund(self):
        text = "All payments are non-refundable."
        factors = identify_risk_factors([], text)
        assert "No refund policy" in factors

    def test_empty_text_and_clauses(self):
        factors = identify_risk_factors([], "")
        assert factors == []
