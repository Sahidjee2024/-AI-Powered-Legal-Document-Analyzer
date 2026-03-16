'use client';
import { FileText, Trash2, ArrowRight } from 'lucide-react';
import { DocumentMetadata } from '@/lib/types';
import { formatDate, formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/lib/api';

export function DocumentCard({ doc, onDelete }: { doc: DocumentMetadata; onDelete: () => void }) {
  const handleDelete = async () => {
    if (!confirm('Delete this document?')) return;
    await api.deleteDocument(doc.doc_id);
    onDelete();
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">{doc.filename}</p>
            <p className="text-xs text-slate-400">{doc.file_type.toUpperCase()} · {formatFileSize(doc.file_size_kb)} · {doc.chunk_count} chunks</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDelete}><Trash2 className="w-4 h-4 text-red-400" /></Button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{formatDate(doc.upload_time)}</p>
        <Link href={`/analyze/${doc.doc_id}`}>
          <Button size="sm" variant="secondary">
            Analyze <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
