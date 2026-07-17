jest.mock('../supabase/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
      }),
    },
  },
}));

jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  };
  return mockAxios;
});

import { analyzeDocument, downloadReport, chatWithAI, uploadDocument, getContracts, deleteContract } from '../services/api';
import api from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('analyzeDocument sends correct params', async () => {
    api.post.mockResolvedValue({ data: { status: 'completed' } });

    await analyzeDocument('contract-123', 'ta');

    expect(api.post).toHaveBeenCalledWith('/api/analyze', {
      contract_id: 'contract-123',
      language: 'ta',
    });
  });

  test('analyzeDocument defaults to English', async () => {
    api.post.mockResolvedValue({ data: { status: 'completed' } });

    await analyzeDocument('contract-123');

    expect(api.post).toHaveBeenCalledWith('/api/analyze', {
      contract_id: 'contract-123',
      language: 'en',
    });
  });

  test('chatWithAI sends correct params', async () => {
    api.post.mockResolvedValue({ data: { answer: 'Response' } });

    await chatWithAI('contract-123', 'What is the notice period?', 'ta');

    expect(api.post).toHaveBeenCalledWith('/api/chat', {
      contract_id: 'contract-123',
      question: 'What is the notice period?',
      language: 'ta',
    });
  });

  test('chatWithAI defaults to English', async () => {
    api.post.mockResolvedValue({ data: { answer: 'Response' } });

    await chatWithAI('contract-123', 'Question?');

    expect(api.post).toHaveBeenCalledWith('/api/chat', {
      contract_id: 'contract-123',
      question: 'Question?',
      language: 'en',
    });
  });

  test('downloadReport sends correct params', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    api.post.mockResolvedValue({ data: mockBlob });

    const mockLink = {
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn(),
      remove: jest.fn(),
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test');
    jest.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});

    await downloadReport('contract-123', 'ta');

    expect(api.post).toHaveBeenCalledWith(
      '/api/report',
      { contract_id: 'contract-123', language: 'ta' },
      { responseType: 'blob' }
    );

    jest.restoreAllMocks();
  });

  test('uploadDocument sends file as FormData', async () => {
    api.post.mockResolvedValue({ data: { contract_id: 'new-123' } });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    await uploadDocument(file);

    expect(api.post).toHaveBeenCalledWith('/api/upload', expect.any(FormData));
  });

  test('getContracts returns contracts list', async () => {
    api.get.mockResolvedValue({ data: { contracts: [{ id: 'c1' }] } });

    const result = await getContracts();
    expect(result).toEqual([{ id: 'c1' }]);
    expect(api.get).toHaveBeenCalledWith('/api/contracts');
  });

  test('deleteContract sends correct request', async () => {
    api.delete.mockResolvedValue({ data: { message: 'deleted' } });

    await deleteContract('contract-123');
    expect(api.delete).toHaveBeenCalledWith('/api/contracts/contract-123');
  });
});
