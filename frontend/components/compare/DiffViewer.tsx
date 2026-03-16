import { ClauseComparison } from '@/lib/types';
import { ArrowRight, AlertTriangle, CheckCircle, MinusCircle } from 'lucide-react';

const deltaIcon = (delta: string) => ({
  improved: <CheckCircle className="w-4 h-4 text-green-400" />,
  worsened: <AlertTriangle className="w-4 h-4 text-red-400" />,
  missing: <MinusCircle className="w-4 h-4 text-slate-400" />,
  neutral: <ArrowRight className="w-4 h-4 text-slate-400" />,
}[delta]);

export function DiffViewer({ comparisons, doc1Name, doc2Name, summary, recommendation }: {
  comparisons: ClauseComparison[]; doc1Name: string; doc2Name: string;
  summary: string; recommendation: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
          <p className="text-sm font-semibold text-white truncate">{doc1Name}</p>
          <p className="text-xs text-slate-400">Document 1</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
          <p className="text-sm font-semibold text-white truncate">{doc2Name}</p>
          <p className="text-xs text-slate-400">Document 2</p>
        </div>
      </div>

      {comparisons.map((c, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border-b border-slate-700">
            {deltaIcon(c.risk_delta)}
            <span className="text-xs font-semibold text-slate-200">{c.clause_type.replace(/_/g, ' ').toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-slate-700">
            <div className="p-4">
              {c.doc1_content
                ? <p className="text-sm text-slate-300">{c.doc1_content}</p>
                : <p className="text-sm text-red-400 italic">Not present in Document 1</p>}
            </div>
            <div className="p-4">
              {c.doc2_content
                ? <p className="text-sm text-slate-300">{c.doc2_content}</p>
                : <p className="text-sm text-red-400 italic">Not present in Document 2</p>}
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
            <p className="text-xs text-slate-400">{c.difference_summary}</p>
          </div>
        </div>
      ))}

      <div className="bg-slate-800 border border-primary/30 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Overall Assessment</h3>
        <p className="text-sm text-slate-300">{summary}</p>
        <div className="bg-primary/10 rounded-lg p-3">
          <p className="text-xs font-semibold text-primary mb-1">RECOMMENDATION</p>
          <p className="text-sm text-slate-200">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}
