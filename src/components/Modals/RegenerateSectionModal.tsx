import React, { useState } from 'react';
import { RefreshCw, Sparkles, X, AlertTriangle } from 'lucide-react';
import { Project, ProjectContent } from '../../types';

interface RegenerateSectionModalProps {
  isOpen: boolean;
  section: keyof ProjectContent;
  sectionTitle: string;
  project: Project;
  onRegenerate: (instructions: string) => Promise<void>;
  onClose: () => void;
}

export const RegenerateSectionModal: React.FC<RegenerateSectionModalProps> = ({
  isOpen,
  section,
  sectionTitle,
  project,
  onRegenerate,
  onClose,
}) => {
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onRegenerate(instructions);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate section.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-tight">Regenerate {sectionTitle}</h3>
              <p className="text-xs text-slate-400">Other sections will remain completely intact.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            Regenerating will replace your current edits for the <strong>{sectionTitle}</strong> section only.
            Recent edits can be reversed via the Undo button.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">
              Specific Instructions or Focus Points <span className="text-slate-500">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus heavily on enterprise security, shorten the headline, or emphasize rapid setup..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Regenerating {sectionTitle}...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Regenerate Section
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
