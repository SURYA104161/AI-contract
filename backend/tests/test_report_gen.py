import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.report_gen import _escape_xml, REPORT_TITLES, RISK_LABELS, generate_pdf_report


class TestEscapeXml:
    def test_plain_text(self):
        assert _escape_xml("Hello World") == "Hello World"

    def test_ampersand(self):
        assert _escape_xml("A & B") == "A &amp; B"

    def test_less_than(self):
        assert _escape_xml("A < B") == "A &lt; B"

    def test_greater_than(self):
        assert _escape_xml("A > B") == "A &gt; B"

    def test_multiple_special_chars(self):
        result = _escape_xml("Tom & Jerry < 10 > 5")
        assert "&amp;" in result
        assert "&lt;" in result
        assert "&gt;" in result

    def test_empty_string(self):
        assert _escape_xml("") == ""

    def test_no_special_chars(self):
        text = "Normal text with numbers 123 and symbols @#$"
        assert _escape_xml(text) == text


class TestReportTitles:
    def test_english_titles_exist(self):
        assert "title" in REPORT_TITLES["en"]
        assert "summary" in REPORT_TITLES["en"]
        assert "clause_analysis" in REPORT_TITLES["en"]
        assert "questions_heading" in REPORT_TITLES["en"]

    def test_tamil_titles_exist(self):
        assert "title" in REPORT_TITLES["ta"]
        assert "summary" in REPORT_TITLES["ta"]
        assert "clause_analysis" in REPORT_TITLES["ta"]
        assert "questions_heading" in REPORT_TITLES["ta"]

    def test_tamil_titles_are_in_tamil(self):
        assert "ஒப்பந்த" in REPORT_TITLES["ta"]["title"]
        assert "சுருக்கம்" in REPORT_TITLES["ta"]["summary"]


class TestRiskLabels:
    def test_english_labels(self):
        assert RISK_LABELS["en"]["High"] == "High Risk"
        assert RISK_LABELS["en"]["Low"] == "Low Risk"

    def test_tamil_labels(self):
        assert "ஆபத்து" in RISK_LABELS["ta"]["High"]
        assert "ஆபத்து" in RISK_LABELS["ta"]["Low"]


class TestGeneratePdfReport:
    def test_english_report(self, sample_analysis):
        pdf_bytes = generate_pdf_report("test.pdf", sample_analysis, "en")
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0
        assert pdf_bytes[:4] == b'%PDF'

    def test_tamil_report(self, sample_analysis):
        pdf_bytes = generate_pdf_report("test.pdf", sample_analysis, "ta")
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0
        assert pdf_bytes[:4] == b'%PDF'

    def test_report_with_no_risk_factors(self, sample_analysis):
        sample_analysis["risk_factors"] = []
        pdf_bytes = generate_pdf_report("test.pdf", sample_analysis, "en")
        assert len(pdf_bytes) > 0

    def test_report_with_many_clauses(self, sample_analysis):
        for i in range(10):
            sample_analysis["clauses"].append({
                "title": f"Clause {i}",
                "simple_explanation": f"Explanation {i}",
                "risk_level": "Low",
                "risk_reason": f"Reason {i}",
            })
        pdf_bytes = generate_pdf_report("test.pdf", sample_analysis, "en")
        assert len(pdf_bytes) > 0

    def test_unknown_language_falls_back_to_english(self, sample_analysis):
        pdf_bytes = generate_pdf_report("test.pdf", sample_analysis, "fr")
        assert len(pdf_bytes) > 0
        assert pdf_bytes[:4] == b'%PDF'
