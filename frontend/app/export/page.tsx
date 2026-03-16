'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { DocumentMetadata } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { FileText, Download } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ExportPage() {
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.listDocuments().then(r => setDocs(r.data.documents));
  }, []);

  const handleExport = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    try {
      const res = await api.exportPdf(selectedDoc);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis_${selectedDoc}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDocData = docs.find(d => d.doc_id === selectedDoc);

  return (
    <div>
      <Header title="Export Analysis Report" />
      <div className="p-6 max-w-2xl space-y-6">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Select Document</label>
          <select
            value={selectedDoc}
            onChange={e => setSelectedDoc(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="">Select a document...</option>
            {docs.map(doc => (
              <option key={doc.doc_id} value={doc.doc_id}>
                {doc.filename} ({doc.file_type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {selectedDocData && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{selectedDocData.filename}</p>
                <p className="text-xs text-slate-400">
                  {selectedDocData.chunk_count} chunks · {selectedDocData.file_size_kb} KB
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleExport}
          loading={loading}
          disabled={!selectedDoc}
          className="w-full"
        >
          <Download className="w-4 h-4" />
          {loading ? 'Generating PDF...' : 'Export Analysis as PDF'}
        </Button>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium">The exported PDF will include:</p>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Executive summary</li>
            <li>• Extracted clauses with importance levels</li>
            <li>• Risk analysis with recommendations</li>
            <li>• Q&A history for this document</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
