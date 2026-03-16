'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ExtractedClause } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { importanceColor } from '@/lib/utils';

export function ClausePanel({ clauses }: { clauses: ExtractedClause[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');

  const types = ['all', ...Array.from(new Set(clauses.map(c => c.clause_type)))];
  const filtered = filter === 'all' ? clauses : clauses.filter(c => c.clause_type === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all
              ${filter === t ? 'bg-primary text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {filtered.map((clause, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-all"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              {expanded === i ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              <div>
                <span className="text-sm font-medium text-white">{clause.title}</span>
                <span className="text-xs text-slate-400 ml-2">({clause.clause_type.replace(/_/g, ' ')})</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={clause.importance} color={importanceColor(clause.importance)} />
              <span className="text-xs text-slate-500">p.{clause.page_reference}</span>
            </div>
          </button>
          {expanded === i && (
            <div className="px-4 pb-4 text-sm text-slate-300 border-t border-slate-700 pt-3">
              {clause.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
