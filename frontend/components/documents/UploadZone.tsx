'use client';
import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.uploadDocument(file);
      router.push(`/analyze/${res.data.document.doc_id}`);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
          ${dragging ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'}`}
      >
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-300 font-medium">Drop your document here</p>
        <p className="text-slate-500 text-sm mt-1">PDF, DOCX, or TXT — max 50MB</p>
        <input id="file-input" type="file" accept=".pdf,.docx,.txt" className="hidden"
          onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
      </div>

      {file && (
        <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} loading={loading}>
              {loading ? 'Uploading...' : 'Analyze Document'}
            </Button>
            <Button variant="ghost" onClick={() => setFile(null)}><X className="w-4 h-4" /></Button>
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{error}</p>}
    </div>
  );
}
