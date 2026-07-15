import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.clause_extractor import extract_clauses


class TestExtractClauses:
    def test_salary_clause(self):
        text = "The employee shall receive a monthly salary of $5000. Working hours are from 9 AM to 5 PM."
        clauses = extract_clauses(text)
        titles = [c["title"] for c in clauses]
        assert "Salary" in titles

    def test_termination_clause(self):
        text = "Either party may terminate this agreement with 30 days notice. The termination must be in writing."
        clauses = extract_clauses(text)
        titles = [c["title"] for c in clauses]
        assert "Termination" in titles

    def test_confidentiality_clause(self):
        text = "The employee must maintain confidentiality of all trade secrets and confidential information."
        clauses = extract_clauses(text)
        titles = [c["title"] for c in clauses]
        assert "Confidentiality" in titles

    def test_multiple_clauses(self):
        text = "Salary is $5000. Working hours are 9-5. Notice period is 30 days. Non-compete applies for 2 years."
        clauses = extract_clauses(text)
        titles = [c["title"] for c in clauses]
        assert len(clauses) >= 3
        assert "Salary" in titles
        assert "Working Hours" in titles

    def test_no_clauses_found(self):
        text = "This is a simple document with no relevant clauses."
        clauses = extract_clauses(text)
        assert len(clauses) == 0

    def test_empty_text(self):
        clauses = extract_clauses("")
        assert len(clauses) == 0

    def test_context_extraction(self):
        text = "The company provides a monthly salary of $5000 to the employee."
        clauses = extract_clauses(text)
        assert len(clauses) > 0
        assert "context" in clauses[0]
        assert len(clauses[0]["context"]) > 0

    def test_duplicate_clauses_not_duplicated(self):
        text = "The salary is $5000. The salary is paid monthly. The salary includes benefits."
        clauses = extract_clauses(text)
        salary_clauses = [c for c in clauses if c["title"] == "Salary"]
        assert len(salary_clauses) == 1
