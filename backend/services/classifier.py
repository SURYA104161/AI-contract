DOCUMENT_KEYWORDS = {
    "Employment": [
        "employee", "employer", "salary", "compensation", "termination",
        "probation", "notice period", "confidentiality", "non-compete",
        "working hours", "leave", "benefits", "resignation"
    ],
    "Rental": [
        "landlord", "tenant", "rent", "deposit", "lease", "premises",
        "maintenance", "eviction", "sublease", "security deposit",
        "notice period", "utility"
    ],
    "Loan": [
        "loan", "interest", "emi", "borrower", "lender", "repayment",
        "default", "penalty", "principal", "collateral", "guarantor",
        "prepayment"
    ],
    "Insurance": [
        "insurance", "policy", "coverage", "premium", "claim", "beneficiary",
        "exclusion", "deductible", "policyholder", "risk", "renewal",
        "sum assured"
    ]
}

def classify_document(text: str) -> str:
    text_lower = text.lower()
    scores = {}

    for doc_type, keywords in DOCUMENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw.lower() in text_lower)
        scores[doc_type] = score

    if not scores or max(scores.values()) == 0:
        return "Other"

    best_type = max(scores, key=scores.get)
    return best_type
