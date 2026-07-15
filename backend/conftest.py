import sys
import os
import pytest
from unittest.mock import MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key")
os.environ.setdefault("GROQ_MODEL", "llama-3.3-70b-versatile")

mock_supabase_module = MagicMock()
mock_supabase_module.create_client.return_value = MagicMock()
mock_supabase_module.Client = MagicMock

if "supabase" not in sys.modules:
    sys.modules["supabase"] = mock_supabase_module
else:
    sys.modules["supabase"].create_client = mock_supabase_module.create_client

mock_cryptography = MagicMock()
mock_ec = MagicMock()
mock_cryptography.hazmat.primitives.asymmetric.ec = mock_ec
mock_ec.SECP256R1 = MagicMock()
mock_ec.EllipticCurvePublicNumbers = MagicMock()
mock_serialization = MagicMock()
mock_cryptography.hazmat.primitives.serialization = mock_serialization
mock_serialization.Encoding = MagicMock()
mock_serialization.PublicFormat = MagicMock()

for mod_name, mod_obj in [
    ("cryptography", mock_cryptography),
    ("cryptography.hazmat", mock_cryptography.hazmat),
    ("cryptography.hazmat.primitives", mock_cryptography.hazmat.primitives),
    ("cryptography.hazmat.primitives.asymmetric", mock_cryptography.hazmat.primitives.asymmetric),
    ("cryptography.hazmat.primitives.asymmetric.ec", mock_ec),
    ("cryptography.hazmat.primitives.serialization", mock_serialization),
]:
    if mod_name not in sys.modules:
        sys.modules[mod_name] = mod_obj


@pytest.fixture
def sample_analysis():
    return {
        "document_type": "Employment",
        "summary": "This is an employment agreement between employer and employee.",
        "risk_score": 45,
        "risk_factors": ["Non-compete restrictions", "Long notice period"],
        "clauses": [
            {
                "title": "Salary",
                "simple_explanation": "The employee will receive a monthly salary.",
                "risk_level": "Low",
                "risk_reason": "Standard compensation clause.",
            },
            {
                "title": "Termination",
                "simple_explanation": "Either party can terminate with 30 days notice.",
                "risk_level": "Medium",
                "risk_reason": "Requires 30 days notice period.",
            },
        ],
        "questions": [
            {"question": "Can the salary be negotiated?"},
            {"question": "What happens during the notice period?"},
        ],
    }


@pytest.fixture
def sample_clauses():
    return [
        {"title": "Salary", "context": "The employee shall receive a monthly salary of $5000."},
        {"title": "Termination", "context": "Either party may terminate this agreement with 30 days written notice."},
    ]


@pytest.fixture
def sample_analyzed_clauses():
    return [
        {
            "title": "Salary",
            "original_text": "The employee shall receive a monthly salary of $5000.",
            "simple_explanation": "You will be paid $5000 per month.",
            "risk_level": "Low",
            "risk_reason": "Standard compensation.",
        },
        {
            "title": "Termination",
            "original_text": "Either party may terminate this agreement with 30 days written notice.",
            "simple_explanation": "Either side can end the contract with 30 days notice.",
            "risk_level": "Medium",
            "risk_reason": "Notice period required.",
        },
    ]
