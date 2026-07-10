import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload', formData);
  return response.data;
}

export async function analyzeDocument(documentId) {
  const response = await api.post('/api/analyze', { document_id: documentId });
  return response.data;
}

export async function downloadReport(documentId) {
  const response = await api.post('/api/report', { document_id: documentId }, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `contract_analysis_${documentId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
