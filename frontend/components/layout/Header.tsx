'use client';
import { Bell } from 'lucide-react';

export function Header({ title }: { title: string }) {
  return (
    <header className="h-14 bg-slate-900/80 border-b border-slate-700 flex items-center px-6 justify-between sticky top-0 z-10 backdrop-blur">
      <h1 className="text-sm font-semibold text-white">{title}</h1>
      <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
        <Bell className="w-4 h-4" />
      </button>
    </header>
  );
}
