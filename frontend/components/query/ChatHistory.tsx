import { QueryRecord } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Bot } from 'lucide-react';

export function ChatHistory({ records }: { records: QueryRecord[] }) {
  if (!records.length) return (
    <div className="text-center py-12 text-slate-500">
      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">Ask your first question above</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {[...records].reverse().map(r => (
        <div key={r.query_id} className="space-y-3">
          <div className="flex justify-end">
            <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md">
              <p className="text-sm text-white">{r.question}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-1.5 bg-slate-700 rounded-full h-fit"><Bot className="w-4 h-4 text-primary" /></div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
              <p className="text-sm text-slate-200 leading-relaxed">{r.answer}</p>
              {r.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.sources.map((s, i) => (
                    <span key={i} className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">{formatDate(r.timestamp)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
