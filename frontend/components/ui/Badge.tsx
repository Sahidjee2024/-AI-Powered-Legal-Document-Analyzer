import { clsx } from 'clsx';

export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold border', color)}>
      {label.toUpperCase()}
    </span>
  );
}
