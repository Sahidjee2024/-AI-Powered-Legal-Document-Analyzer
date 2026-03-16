export function formatDate(isoString: string): string {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function formatFileSize(kb: number): string {
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function riskColor(level: string) {
  return {
    high: 'text-red-400 bg-red-900/30 border-red-700',
    medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
    low: 'text-green-400 bg-green-900/30 border-green-700'
  }[level] || '';
}

export function importanceColor(importance: string) {
  return {
    critical: 'text-red-400 bg-red-900/30',
    important: 'text-yellow-400 bg-yellow-900/30',
    standard: 'text-slate-400 bg-slate-800'
  }[importance] || '';
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
