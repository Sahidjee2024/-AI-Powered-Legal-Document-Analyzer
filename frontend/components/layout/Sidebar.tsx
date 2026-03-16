'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Upload, GitCompare, History, FileText, Scale, Download } from 'lucide-react';
import { clsx } from 'clsx';

const nav = [
  { href: '/', label: 'Dashboard', icon: FileText },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/export', label: 'Export', icon: Download },
  { href: '/history', label: 'History', icon: History },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <Scale className="w-7 h-7 text-primary" />
        <div>
          <p className="font-bold text-white text-sm">LegalAI</p>
          <p className="text-xs text-slate-400">Document Analyzer</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
              path === href ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800')}>
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Powered by Ollama + ChromaDB</p>
      </div>
    </aside>
  );
}
