'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ClausePanel } from '@/components/analysis/ClausePanel';
import { RiskPanel } from '@/components/analysis/RiskPanel';
import { SummaryPanel } from '@/components/analysis/SummaryPanel';
import { QueryInput } from '@/components/query/QueryInput';
import { ChatHistory } from '@/components/query/ChatHistory';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ClauseExtractionResult, RiskAnalysisResult, QueryRecord, SummaryResult } from '@/lib/types';
import api from '@/lib/api';
import { Download } from 'lucide-react';
import { downloadBlob } from '@/lib/utils';

const TABS = ['Summary', 'Clauses', 'Risks', 'Ask'];

export default function AnalyzePage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState('Summary');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [clauses, setClauses] = useState<ClauseExtractionResult | null>(null);
  const [risks, setRisks] = useState<RiskAnalysisResult | null>(null);
  const [queries, setQueries] = useState<QueryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (type: string) => {
    if (!params?.id) return;
    setLoading(true);
    setError(null);
    try {
      if (type === 'Summary' && !summary) {
        const res = await api.generateSummary(params.id);
        setSummary(res.data);
      } else if (type === 'Clauses' && !clauses) {
        const res = await api.extractClauses(params.id);
        setClauses(res.data);
      } else if (type === 'Risks' && !risks) {
        const res = await api.flagRisks(params.id);
        setRisks(res.data);
      }
    } catch (e: any) {
      console.error('Analysis error:', e);
      setError(e.response?.data?.error || `Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      runAnalysis('Summary');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const handleTabChange = (t: string) => {
    setTab(t);
    runAnalysis(t);
  };

  const handleExport = async () => {
    const res = await api.exportPdf(params.id);
    downloadBlob(res.data, `analysis_${params.id}.pdf`);
  };

  return (
    <div>
      <Header title="Document Analysis" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {TABS.map(t => (
              <button key={t} onClick={() => handleTabChange(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${tab === t ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={handleExport} size="sm">
            <Download className="w-3 h-3" /> Export PDF
          </Button>
        </div>

        {error ? (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <Button onClick={() => runAnalysis(tab)} size="sm" className="mt-3">Retry</Button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <>
            {tab === 'Summary' && <SummaryPanel summary={summary} />}
            {tab === 'Clauses' && (clauses ? <ClausePanel clauses={clauses.clauses} /> : <Button onClick={() => runAnalysis('Clauses')}>Extract Clauses</Button>)}
            {tab === 'Risks' && (risks ? <RiskPanel risks={risks.risk_flags} counts={{ high: risks.high_count, medium: risks.medium_count, low: risks.low_count }} /> : <Button onClick={() => runAnalysis('Risks')}>Analyze Risks</Button>)}
            {tab === 'Ask' && (
              <div className="space-y-4">
                <QueryInput docIds={[params.id]} onAnswer={r => setQueries(prev => [...prev, r])} />
                <ChatHistory records={queries} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
