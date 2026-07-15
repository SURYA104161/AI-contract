import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.classifier import classify_document


class TestClassifyDocument:
    def test_employment_contract(self):
        text = "This employment agreement is between the employer and the employee. The employee shall receive salary and benefits during the probation period. Confidentiality and non-compete clauses apply after termination."
        assert classify_document(text) == "Employment"

    def test_rental_agreement(self):
        text = "This rental agreement is between the landlord and the tenant. The tenant shall pay monthly rent and a security deposit. The landlord is responsible for maintenance of the premises."
        assert classify_document(text) == "Rental"

    def test_loan_agreement(self):
        text = "This loan agreement is between the borrower and the lender. The borrower shall repay the loan with interest through monthly EMI payments. Default on repayment will result in penalty charges."
        assert classify_document(text) == "Loan"

    def test_insurance_policy(self):
        text = "This insurance policy provides coverage for the policyholder. The premium must be paid annually. The beneficiary can file a claim in case of loss. Exclusions apply as per the policy terms."
        assert classify_document(text) == "Insurance"

    def test_other_document(self):
        text = "This is a random document about cooking recipes and gardening tips."
        assert classify_document(text) == "Other"

    def test_empty_text(self):
        assert classify_document("") == "Other"

    def test_mixed_keywords_employment_wins(self):
        text = "Employment agreement with salary, termination, and some insurance coverage mentioned."
        result = classify_document(text)
        assert result == "Employment"

    def test_case_insensitive(self):
        text = "EMPLOYER and EMPLOYEE must follow SALARY rules during PROBATION."
        assert classify_document(text) == "Employment"
