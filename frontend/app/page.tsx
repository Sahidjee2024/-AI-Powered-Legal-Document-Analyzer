'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentMetadata } from '@/lib/types';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Upload, FileText } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [docs, setDocs] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocs = async () => {
    try { const res = await api.listDocuments(); setDocs(res.data.documents); }
    catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadDocs(); }, []);

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-xs text-slate-400 font-medium">DOCUMENTS</span>
            </div>
            <p className="text-3xl font-bold text-white">{docs.length}</p>
            <p className="text-xs text-slate-400 mt-1">In current session</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Recent Documents</h2>
          <Link href="/upload"><Button size="sm"><Upload className="w-3 h-3" /> Upload New</Button></Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : docs.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No documents yet. Upload your first contract to get started.</p>
            <Link href="/upload" className="mt-4 inline-block">
              <Button className="mt-4">Upload Document</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {docs.map(doc => <DocumentCard key={doc.doc_id} doc={doc} onDelete={loadDocs} />)}
          </div>
        )}
      </div>
    </div>
  );
}
