import axios from 'axios';
import { supabase } from '../supabase/supabaseClient';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn('No access token available - user may need to re-login');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Auth Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export async function testAuth() {
  const response = await api.get('/api/auth/test');
  return response.data;
}

export async function inspectToken() {
  const response = await api.get('/api/auth/inspect');
  console.log('Token inspection:', response.data);
  return response.data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/upload', formData);
  return response.data;
}

export async function analyzeDocument(contractId, language = 'en') {
  const response = await api.post('/api/analyze', { contract_id: contractId, language });
  return response.data;
}

export async function downloadReport(contractId, language = 'en') {
  const response = await api.post('/api/report', { contract_id: contractId, language }, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `contract_analysis_${contractId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function getContracts() {
  const response = await api.get('/api/contracts');
  return response.data.contracts;
}

export async function getContract(contractId) {
  const response = await api.get(`/api/contracts/${contractId}`);
  return response.data;
}

export async function deleteContract(contractId) {
  const response = await api.delete(`/api/contracts/${contractId}`);
  return response.data;
}

export async function getDashboardStats() {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
}

export async function getHistory() {
  const response = await api.get('/api/history');
  return response.data.history;
}

export async function chatWithAI(contractId, question, language = 'en') {
  const response = await api.post('/api/chat', {
    contract_id: contractId,
    question,
    language,
  });
  return response.data;
}

export default api;
