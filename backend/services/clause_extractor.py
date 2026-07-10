import re

CLAUSE_PATTERNS = {
    "Salary": r"(?i)(salary|compensation|pay|wages|remuneration)",
    "Working Hours": r"(?i)(working hours|work hours|office hours|shift|overtime)",
    "Probation": r"(?i)(probation|trial period|probationary period)",
    "Termination": r"(?i)(termination|terminate|dismissal|fire|end employment)",
    "Leave Policy": r"(?i)(leave|vacation|time off|sick leave|holiday)",
    "Confidentiality": r"(?i)(confidential|confidentiality|trade secret|non-disclosure)",
    "Non-Compete": r"(?i)(non-compete|non compete|restrictive covenant)",
    "Notice Period": r"(?i)(notice period|notice of|resignation notice)",
    "Rent": r"(?i)(rent|monthly rent|rental amount)",
    "Deposit": r"(?i)(deposit|security deposit|advance deposit)",
    "Maintenance": r"(?i)(maintenance|repair|upkeep|property maintenance)",
    "Eviction": r"(?i)(eviction|vacate|possession|writ)",
    "Interest": r"(?i)(interest|interest rate|annual percentage|apr)",
    "EMI": r"(?i)(emi|monthly payment|installment|equated)",
    "Default": r"(?i)(default|late payment|non-payment|breach)",
    "Penalty": r"(?i)(penalty|late fee|penalty charge|fine)",
    "Coverage": r"(?i)(coverage|covers|insured|sum assured)",
    "Exclusions": r"(?i)(exclusion|not covered|excluded|exception)",
    "Claim": r"(?i)(claim|claim process|claim settlement|file a claim)",
    "Auto Renewal": r"(?i)(auto(?:matic)?\s*renewal|renew automatically)",
    "Liability": r"(?i)(liability|indemnify|indemnification|hold harmless)",
}

def extract_clauses(text: str) -> list[dict]:
    found_clauses = []
    seen_titles = set()

    for title, pattern in CLAUSE_PATTERNS.items():
        matches = list(re.finditer(pattern, text))
        for match in matches:
            start = max(0, match.start() - 200)
            end = min(len(text), match.end() + 300)
            context = text[start:end].strip()

            if context and title not in seen_titles:
                seen_titles.add(title)
                found_clauses.append({
                    "title": title,
                    "context": context
                })
                break

    return found_clauses
