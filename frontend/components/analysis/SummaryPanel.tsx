import { Calendar, Users, Scale, CreditCard } from 'lucide-react';

export function SummaryPanel({ summary }: { summary: any }) {
  if (!summary) return <p className="text-slate-400">No summary available.</p>;
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-2">Overview</h3>
        <p className="text-slate-300 text-sm">{summary.overall_summary}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {summary.parties && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Users className="w-4 h-4" /><span className="text-xs font-medium">PARTIES</span></div>
            {summary.parties.map((p: string, i: number) => <p key={i} className="text-sm text-slate-300">{p}</p>)}
          </div>
        )}
        {summary.governing_law && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Scale className="w-4 h-4" /><span className="text-xs font-medium">GOVERNING LAW</span></div>
            <p className="text-sm text-slate-300">{summary.governing_law}</p>
          </div>
        )}
        {summary.payment_terms && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><CreditCard className="w-4 h-4" /><span className="text-xs font-medium">PAYMENT</span></div>
            <p className="text-sm text-slate-300">{summary.payment_terms}</p>
          </div>
        )}
        {(summary.effective_date || summary.expiration_date) && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Calendar className="w-4 h-4" /><span className="text-xs font-medium">DATES</span></div>
            {summary.effective_date && <p className="text-sm text-slate-300">Effective: {summary.effective_date}</p>}
            {summary.expiration_date && <p className="text-sm text-slate-300">Expires: {summary.expiration_date}</p>}
          </div>
        )}
      </div>
      {summary.key_obligations?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs font-medium text-slate-400 mb-2">KEY OBLIGATIONS</p>
          <ul className="space-y-1">{summary.key_obligations.map((o: string, i: number) =>
            <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-primary">•</span>{o}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
