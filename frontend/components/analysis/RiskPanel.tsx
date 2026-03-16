import { RiskFlag } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { riskColor } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

export function RiskPanel({ risks, counts }: {
  risks: RiskFlag[];
  counts: { high: number; medium: number; low: number };
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {(['high', 'medium', 'low'] as const).map(level => (
          <div key={level} className={`rounded-xl p-4 border text-center ${riskColor(level)}`}>
            <p className="text-2xl font-bold">{counts[level]}</p>
            <p className="text-xs font-medium capitalize">{level} Risk</p>
          </div>
        ))}
      </div>

      {risks.map((risk, i) => (
        <div key={i} className={`rounded-xl p-4 border ${riskColor(risk.risk_level)} bg-slate-800`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <Badge label={risk.risk_level} color={riskColor(risk.risk_level)} />
            <span className="font-semibold text-sm">{risk.risk_category}</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">{risk.description}</p>
          <blockquote className="border-l-4 border-slate-500 pl-3 italic text-xs text-slate-400 mb-3">
            &quot;{risk.citation}&quot;
          </blockquote>
          <p className="text-xs text-slate-400"><span className="font-semibold text-slate-300">Recommendation:</span> {risk.recommendation}</p>
        </div>
      ))}
    </div>
  );
}
