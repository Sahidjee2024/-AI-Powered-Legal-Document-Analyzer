import axios from 'axios';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  let id = localStorage.getItem('legal_session_id');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('legal_session_id', id);
  }
  return id;
};

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 120000,
});

client.interceptors.request.use((config) => {
  config.headers['X-Session-ID'] = getSessionId();
  return config;
});

export const api = {
  // Documents
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return client.post('/api/documents/upload', form);
  },
  listDocuments: () => client.get('/api/documents/'),
  deleteDocument: (docId: string) => client.delete(`/api/documents/${docId}`),

  // Analysis
  extractClauses: (docId: string) => client.post(`/api/analysis/clauses/${docId}`),
  flagRisks: (docId: string) => client.post(`/api/analysis/risks/${docId}`),
  generateSummary: (docId: string) => client.post(`/api/analysis/summary/${docId}`),

  // Query
  askQuestion: (question: string, docIds: string[]) =>
    client.post('/api/query/', { question, doc_ids: docIds }),

  // Compare
  compareDocuments: (doc1Id: string, doc2Id: string) =>
    client.post('/api/compare/', { doc1_id: doc1Id, doc2_id: doc2Id }),

  // Export
  exportPdf: (docId: string) =>
    client.get(`/api/export/${docId}`, { responseType: 'blob' }),

  // Session
  getSessionHistory: () => client.get(`/api/sessions/${getSessionId()}`),

  getSessionId,
};

export default api;
