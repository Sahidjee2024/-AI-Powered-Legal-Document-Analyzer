'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { QueryRecord } from '@/lib/types';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export function QueryInput({ docIds, onAnswer }: { docIds: string[]; onAnswer: (r: QueryRecord) => void }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.askQuestion(question, docIds);
      onAnswer(res.data);
      setQuestion('');
    } catch (e: any) {
      setError(e.response?.data?.error || 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask anything about this document..."
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary"
        />
        <button onClick={handleSubmit} disabled={loading || !question.trim()}
          className="p-2.5 bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">
          {loading ? <Spinner size="sm" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
