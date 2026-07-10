import httpx
import sys

BASE = "http://localhost:8000"

# Upload
files = {'file': open(r'backend\sample_contract.pdf', 'rb')}
r = httpx.post(f"{BASE}/api/upload", files=files)
upload = r.json()
doc_id = upload['document_id']
print(f"Upload OK, doc_id: {doc_id}")
print(f"Text length: {upload['text_length']}")

# Analyze
r = httpx.post(f"{BASE}/api/analyze", json={"document_id": doc_id})
if r.status_code == 200:
    data = r.json()
    print(f"\nAnalysis OK")
    print(f"Document Type: {data['document_type']}")
    print(f"Summary: {data['summary'][:150]}...")
    print(f"Risk Score: {data['risk_score']}/100")
    print(f"Clauses found: {len(data['clauses'])}")
    print(f"Questions generated: {len(data['questions'])}")
    for c in data['clauses']:
        print(f"  - {c['title']}: {c['risk_level']} risk")
    if data['risk_factors']:
        print(f"\nRisk Factors:")
        for f in data['risk_factors']:
            print(f"  - {f}")
    print(f"\nQuestions:")
    for q in data['questions']:
        print(f"  - {q['question']}")
else:
    print(f"Analyze error {r.status_code}: {r.text}")
