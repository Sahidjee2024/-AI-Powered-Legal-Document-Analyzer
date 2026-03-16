'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DiffViewer } from '@/components/compare/DiffViewer';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { DocumentMetadata, ComparisonResult } from '@/lib/types';
import api from '@/lib/api';

export default function ComparePage() {
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [doc1, setDoc1] = useState('');
  const [doc2, setDoc2] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.listDocuments().then(r => setDocs(r.data.documents)); }, []);

  const compare = async () => {
    if (!doc1 || !doc2) return;
    setLoading(true);
    try { const r = await api.compareDocuments(doc1, doc2); setResult(r.data); }
    catch {}
    finally { setLoading(false); }
  };

  const d1 = docs.find(d => d.doc_id === doc1);
  const d2 = docs.find(d => d.doc_id === doc2);

  return (
    <div>
      <Header title="Compare Documents" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[{ val: doc1, set: setDoc1, label: 'Document 1' }, { val: doc2, set: setDoc2, label: 'Document 2' }].map(({ val, set, label }) => (
            <div key={label}>
              <label className="text-xs text-slate-400 mb-1 block">{label}</label>
              <select value={val} onChange={e => set(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary">
                <option value="">Select document...</option>
                {docs.map(d => <option key={d.doc_id} value={d.doc_id}>{d.filename}</option>)}
              </select>
            </div>
          ))}
        </div>
        <Button onClick={compare} loading={loading} disabled={!doc1 || !doc2}>Compare Documents</Button>

        {loading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          : result && d1 && d2 && (
            <DiffViewer comparisons={result.clause_comparisons}
              doc1Name={d1.filename} doc2Name={d2.filename}
              summary={result.overall_summary} recommendation={result.recommendation} />
          )}
      </div>
    </div>
  );
}
