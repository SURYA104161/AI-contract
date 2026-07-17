import sys
import os
import io
import json
import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("GROQ_API_KEY", "test-groq-key")


@pytest.fixture
def mock_supabase_client():
    client = MagicMock()
    return client


@pytest.fixture
def client(mock_supabase_client):
    with patch("services.supabase_client.supabase", mock_supabase_client):
        with patch("routes.upload.supabase", mock_supabase_client):
            with patch("routes.analyze.supabase", mock_supabase_client):
                with patch("routes.chat.supabase", mock_supabase_client):
                    with patch("routes.report.supabase", mock_supabase_client):
                        with patch("routes.contracts.supabase", mock_supabase_client):
                            with patch("services.analysis_service.supabase", mock_supabase_client):
                                from app import app

                                def override_get_current_user():
                                    return "test-user-id"

                                app.dependency_overrides.clear()
                                from services.auth import get_current_user
                                app.dependency_overrides[get_current_user] = override_get_current_user

                                with TestClient(app) as c:
                                    yield c

                                app.dependency_overrides.clear()


class TestHealthEndpoint:
    def test_health_check(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "AI Contract Explainer" in data["message"]


class TestUploadEndpoint:
    def test_upload_non_pdf_fails(self, client):
        response = client.post(
            "/api/upload",
            files={"file": ("test.txt", b"content", "text/plain")},
        )
        assert response.status_code == 400

    def test_upload_empty_file_fails(self, client):
        response = client.post(
            "/api/upload",
            files={"file": ("test.pdf", b"", "application/pdf")},
        )
        assert response.status_code == 400

    def test_upload_valid_pdf(self, client, mock_supabase_client):
        mock_supabase_client.storage.from_.return_value.upload.return_value = None
        mock_supabase_client.storage.from_.return_value.get_public_url.return_value = "http://example.com/file.pdf"
        mock_supabase_client.table.return_value.insert.return_value.execute.return_value.data = [{"id": "contract-123"}]

        with patch("routes.upload.extract_text_from_bytes", return_value="Employment agreement with salary and termination clauses."):
            with patch("routes.upload.classify_document", return_value="Employment"):
                response = client.post(
                    "/api/upload",
                    files={"file": ("test.pdf", b"%PDF-1.4 fake content", "application/pdf")},
                )

        assert response.status_code == 200
        data = response.json()
        assert "contract_id" in data
        assert data["document_type"] == "Employment"


class TestAnalyzeEndpoint:
    def test_analyze_without_auth(self, mock_supabase_client):
        with patch("services.supabase_client.supabase", mock_supabase_client):
            with patch("routes.upload.supabase", mock_supabase_client):
                with patch("routes.analyze.supabase", mock_supabase_client):
                    with patch("routes.chat.supabase", mock_supabase_client):
                        with patch("routes.report.supabase", mock_supabase_client):
                            with patch("routes.contracts.supabase", mock_supabase_client):
                                with patch("services.analysis_service.supabase", mock_supabase_client):
                                    from app import app

                                    test_client = TestClient(app)
                                    response = test_client.post(
                                        "/api/analyze",
                                        json={"contract_id": "test-123"},
                                    )
                                    assert response.status_code in [401, 422]

    def test_analyze_contract_not_found(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

        response = client.post("/api/analyze", json={"contract_id": "nonexistent"})
        assert response.status_code == 404

    def test_analyze_with_cached_result(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table

        contract_data = {
            "id": "contract-123",
            "original_file_name": "test.pdf",
            "extracted_text": "Employment agreement with salary.",
            "document_type": "Employment",
            "file_url": "http://example.com/test.pdf",
        }

        analysis_data = {
            "id": "analysis-123",
            "contract_id": "contract-123",
            "summary": "An employment contract.",
            "risk_score": 45,
            "document_type": "Employment",
            "language": "en",
            "status": "completed",
            "created_at": "2024-01-01",
        }

        clause_data = [
            {"title": "Salary", "original_text": "text", "simple_explanation": "exp", "risk_level": "Low", "risk_reason": "reason"}
        ]
        risk_data = [{"factor_text": "No risk"}]
        question_data = [{"question_text": "What?", "context": ""}]

        call_count = [0]

        def mock_execute():
            call_count[0] += 1
            mock_result = MagicMock()
            if call_count[0] == 1:
                mock_result.data = contract_data
            elif call_count[0] == 2:
                mock_result.data = [analysis_data]
            elif call_count[0] == 3:
                mock_result.data = clause_data
            elif call_count[0] == 4:
                mock_result.data = risk_data
            elif call_count[0] == 5:
                mock_result.data = question_data
            else:
                mock_result.data = None
            return mock_result

        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.execute = mock_execute

        response = client.post("/api/analyze", json={"contract_id": "contract-123", "language": "en"})
        assert response.status_code == 200
        data = response.json()
        assert data["language"] == "en"

    def test_analyze_language_switch_triggers_new_analysis(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table

        contract_data = {
            "id": "contract-123",
            "original_file_name": "test.pdf",
            "extracted_text": "Employment agreement with salary.",
            "document_type": "Employment",
            "file_url": "http://example.com/test.pdf",
        }
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = contract_data

        existing_analysis = {
            "id": "analysis-old",
            "language": "en",
            "status": "completed",
        }
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [existing_analysis]

        with patch("routes.analyze.run_full_analysis", new_callable=AsyncMock, return_value="analysis-new-123"):
            mock_table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = {
                "id": "analysis-new-123",
                "summary": "Tamil summary",
                "risk_score": 50,
                "document_type": "Employment",
                "language": "ta",
                "created_at": "2024-01-01",
            }
            mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = []
            mock_table.return_value.select.return_value.eq.return_value.return_value.execute.return_value.data = []
            mock_table.return_value.select.return_value.eq.return_value.return_value.return_value.execute.return_value.data = []

            response = client.post("/api/analyze", json={"contract_id": "contract-123", "language": "ta"})
            assert response.status_code == 200

    def test_analyze_invalid_language_defaults_to_english(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table

        contract_data = {
            "id": "contract-123",
            "original_file_name": "test.pdf",
            "extracted_text": "Employment agreement.",
            "document_type": "Employment",
            "file_url": "",
        }

        existing_analysis = {
            "id": "analysis-1",
            "language": "en",
            "status": "completed",
            "summary": "An employment contract.",
            "risk_score": 45,
            "document_type": "Employment",
            "created_at": "2024-01-01",
        }

        call_count = [0]

        def mock_execute():
            call_count[0] += 1
            mock_result = MagicMock()
            if call_count[0] == 1:
                mock_result.data = contract_data
            elif call_count[0] == 2:
                mock_result.data = [existing_analysis]
            elif call_count[0] == 3:
                mock_result.data = []
            elif call_count[0] == 4:
                mock_result.data = []
            elif call_count[0] == 5:
                mock_result.data = []
            else:
                mock_result.data = None
            return mock_result

        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute = mock_execute
        mock_table.return_value.select.return_value.eq.return_value.execute = mock_execute

        response = client.post("/api/analyze", json={"contract_id": "contract-123", "language": "fr"})
        assert response.status_code == 200
        data = response.json()
        assert data["language"] == "en"


class TestChatEndpoint:
    def test_chat_contract_not_found(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

        response = client.post("/api/chat", json={
            "contract_id": "nonexistent",
            "question": "What is this?",
        })
        assert response.status_code == 404

    def test_chat_with_language(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = {
            "extracted_text": "Employment contract text.",
            "document_type": "Employment",
        }

        with patch("routes.chat.generate_chat_response", return_value="The answer is in Tamil."):
            response = client.post("/api/chat", json={
                "contract_id": "contract-123",
                "question": "What is the notice period?",
                "language": "ta",
            })
            assert response.status_code == 200
            data = response.json()
            assert "answer" in data


class TestReportEndpoint:
    def test_report_no_analysis(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = {
            "original_file_name": "test.pdf"
        }
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = []

        response = client.post("/api/report", json={"contract_id": "contract-123"})
        assert response.status_code == 404

    def test_report_generates_pdf(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = {
            "original_file_name": "test.pdf"
        }
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [{
            "id": "analysis-1",
            "document_type": "Employment",
            "summary": "Test summary",
            "risk_score": 45,
            "language": "en",
        }]
        mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
            {"title": "Salary", "simple_explanation": "Exp", "risk_level": "Low", "risk_reason": "Reason"}
        ]
        mock_table.return_value.select.return_value.eq.return_value.return_value.execute.return_value.data = [
            {"factor_text": "No risk"}
        ]
        mock_table.return_value.select.return_value.eq.return_value.return_value.return_value.execute.return_value.data = [
            {"question_text": "What?"}
        ]

        response = client.post("/api/report", json={"contract_id": "contract-123"})
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"


class TestContractsEndpoint:
    def test_list_contracts(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
            {"id": "c1", "original_file_name": "test.pdf"}
        ]

        response = client.get("/api/contracts")
        assert response.status_code == 200
        data = response.json()
        assert "contracts" in data

    def test_get_contract_not_found(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

        response = client.get("/api/contracts/nonexistent")
        assert response.status_code == 404

    def test_delete_contract_not_found(self, client, mock_supabase_client):
        mock_supabase_client.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

        response = client.delete("/api/contracts/nonexistent")
        assert response.status_code == 404

    def test_dashboard_stats(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table
        mock_table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
            {"id": "c1", "status": "completed"}
        ]
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
            {"risk_score": 45}
        ]
        mock_table.return_value.select.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [
            {"id": "c1", "original_file_name": "test.pdf", "uploaded_at": "2024-01-01"}
        ]
        mock_table.return_value.select.return_value.eq.return_value.eq.return_value.order.return_value.limit.return_value.execute.return_value.data = [
            {"risk_score": 45}
        ]

        response = client.get("/api/dashboard/stats")
        assert response.status_code == 200

    def test_history(self, client, mock_supabase_client):
        mock_table = mock_supabase_client.table
        mock_table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
            {"id": "a1", "contract_id": "c1", "document_type": "Employment", "risk_score": 45, "status": "completed", "created_at": "2024-01-01"}
        ]
        mock_table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = {
            "original_file_name": "test.pdf"
        }

        response = client.get("/api/history")
        assert response.status_code == 200
