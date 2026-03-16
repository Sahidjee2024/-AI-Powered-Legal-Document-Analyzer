'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import api from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSessionHistory().then(r => setHistory(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div>
      <Header title="Session History" />
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <div className="bg-slate-800 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-2xl font-bold text-white">{history?.total_documents ?? 0}</p>
            <p className="text-xs text-slate-400">Documents</p>
          </div>
          <div className="bg-slate-800 rounded-xl px-5 py-3 border border-slate-700">
            <p className="text-2xl font-bold text-white">{history?.total_queries ?? 0}</p>
            <p className="text-xs text-slate-400">Questions Asked</p>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-white pt-2">Q&A History</h2>
        {history?.queries?.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No questions asked yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history?.queries?.map((q: any) => (
              <div key={q.query_id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <p className="text-sm font-medium text-white">{q.question}</p>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{q.answer}</p>
                <p className="text-xs text-slate-500 mt-2">{formatDate(q.timestamp)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
