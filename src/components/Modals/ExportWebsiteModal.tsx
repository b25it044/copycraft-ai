import React, { useState } from 'react';
import {
  Download,
  FolderArchive,
  FileCode,
  CheckCircle,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project } from '../../types';
import { exportToZip } from '../../services/exporter';

interface ExportWebsiteModalProps {
  isOpen: boolean;
  project: Project;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExportWebsiteModal: React.FC<ExportWebsiteModalProps> = ({
  isOpen,
  project,
  onClose,
  onShowToast,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await exportToZip(project);
      onShowToast('Static website ZIP package exported successfully!', 'success');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to export ZIP package.');
    } finally {
      setIsExporting(false);
    }
  };

  const fileManifest = [
    { name: 'index.html', desc: 'Home Page with Hero, Benefits, Features, and Primary CTA' },
    { name: 'about.html', desc: 'About Page with Origin Story, Mission, Vision, and Values' },
    { name: 'services.html', desc: 'Services Page with Deliverables, Packages, and Actions' },
    { name: 'faq.html', desc: 'Frequently Asked Questions Page with Accordion Behavior' },
    { name: 'styles.css', desc: `Responsive Stylesheet (${project.styling.fontPairing}, ${project.styling.colorPalette})` },
    { name: 'script.js', desc: 'Interactive Mobile Hamburger & FAQ Accordion Controls' },
    { name: 'content.json', desc: 'Structured JSON representation of all website copy' },
    { name: 'metadata.json', desc: 'Project configuration and export timestamp' },
    { name: 'README.md', desc: 'One-click local preview and zero-config hosting guide' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white tracking-tight">Export Static Website ZIP</h3>
              <p className="text-xs text-slate-400">Complete, production-ready static site package.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Package Highlights */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Package File Manifest (9 Files)</label>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-52 overflow-y-auto space-y-2 divide-y divide-slate-900 text-xs font-mono">
            {fileManifest.map((f) => (
              <div key={f.name} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                <span className="text-indigo-400 font-semibold">{f.name}</span>
                <span className="text-slate-500 text-[11px] font-sans truncate text-right">
                  {f.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1.5 text-xs text-emerald-300">
          <div className="flex items-center gap-1.5 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Ready for Instant Deployment</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            No server or build dependencies. Extract and double-click <code>index.html</code> to test locally,
            or drag and drop into Netlify, Vercel, or GitHub Pages.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            {isExporting ? (
              <>
                <Download className="w-4 h-4 animate-bounce" />
                Bundling ZIP Package...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Website ZIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
