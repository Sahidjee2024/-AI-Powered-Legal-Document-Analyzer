import { Header } from '@/components/layout/Header';
import { UploadZone } from '@/components/documents/UploadZone';

export default function UploadPage() {
  return (
    <div>
      <Header title="Upload Document" />
      <div className="p-6 max-w-2xl">
        <p className="text-slate-400 text-sm mb-6">Upload a contract, NDA, or legal brief to begin AI-powered analysis.</p>
        <UploadZone />
      </div>
    </div>
  );
}
