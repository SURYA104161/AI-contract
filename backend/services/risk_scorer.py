def _clause_attr(c, key, default=""):
    if isinstance(c, dict):
        return c.get(key, default)
    return getattr(c, key, default) or default

RISK_WEIGHTS = {
    "High": 15,
    "Medium": 7,
    "Low": 2
}

RISK_FACTOR_KEYWORDS = {
    "One-sided termination": ["terminate without cause", "terminate at will", "termination without notice"],
    "Unlimited liability": ["unlimited liability", "indemnify", "hold harmless", "all losses"],
    "Hidden fees": ["processing fee", "administrative fee", "service charge"],
    "Auto renewal": ["automatically renew", "auto renewal", "renew automatically"],
    "Long notice period": ["90 days notice", "60 days notice", "notice period of"],
    "High penalties": ["penalty of", "late fee of", "charged"],
    "Non-compete restrictions": ["non-compete", "not compete", "restrictive covenant"],
    "No refund policy": ["non-refundable", "no refund", "no reimbursement"],
}

def calculate_risk_score(clauses: list) -> int:
    if not clauses:
        return 0

    total_weight = sum(RISK_WEIGHTS.get(_clause_attr(c, "risk_level", "Low"), 2) for c in clauses)
    max_weight = len(clauses) * 15
    score = int((total_weight / max_weight) * 100) if max_weight > 0 else 0
    score = min(score, 100)

    return score


def identify_risk_factors(clauses: list, full_text: str = "") -> list[str]:
    factors = []
    text_lower = full_text.lower()

    for factor, keywords in RISK_FACTOR_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in text_lower:
                factors.append(factor)
                break

    high_risk_clauses = [_clause_attr(c, "title", "") for c in clauses if _clause_attr(c, "risk_level") == "High"]
    factors.extend([f"High-risk clause: {c}" for c in high_risk_clauses if c])

    return list(set(factors))
