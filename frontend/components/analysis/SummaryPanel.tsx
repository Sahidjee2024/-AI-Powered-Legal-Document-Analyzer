import { Calendar, Users, Scale, CreditCard } from 'lucide-react';

export function SummaryPanel({ summary }: { summary: any }) {
  // Handle both the full response {doc_id, filename, summary} and just the summary object
  const summaryData = summary?.summary || summary;
  
  if (!summaryData) return (
    <div className="text-center py-12 text-slate-500">
      <p className="text-sm">No summary available. Click the button below to generate one.</p>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-2">Overview</h3>
        <p className="text-slate-300 text-sm">{summaryData.overall_summary || 'No overall summary available.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {summaryData.parties && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Users className="w-4 h-4" /><span className="text-xs font-medium">PARTIES</span></div>
            {summaryData.parties.map((p: string, i: number) => <p key={i} className="text-sm text-slate-300">{p}</p>)}
          </div>
        )}
        {summaryData.governing_law && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Scale className="w-4 h-4" /><span className="text-xs font-medium">GOVERNING LAW</span></div>
            <p className="text-sm text-slate-300">{summaryData.governing_law}</p>
          </div>
        )}
        {summaryData.payment_terms && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><CreditCard className="w-4 h-4" /><span className="text-xs font-medium">PAYMENT</span></div>
            <p className="text-sm text-slate-300">{summaryData.payment_terms}</p>
          </div>
        )}
        {(summaryData.effective_date || summaryData.expiration_date) && (
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-slate-400"><Calendar className="w-4 h-4" /><span className="text-xs font-medium">DATES</span></div>
            {summaryData.effective_date && <p className="text-sm text-slate-300">Effective: {summaryData.effective_date}</p>}
            {summaryData.expiration_date && <p className="text-sm text-slate-300">Expires: {summaryData.expiration_date}</p>}
          </div>
        )}
      </div>
      {summaryData.key_obligations?.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-xs font-medium text-slate-400 mb-2">KEY OBLIGATIONS</p>
          <ul className="space-y-1">{summaryData.key_obligations.map((o: string, i: number) =>
            <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-primary">•</span>{o}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
