import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

export const metadata = { title: 'LegalAI — Document Analyzer', description: 'AI-powered legal document analysis' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen overflow-hidden bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
