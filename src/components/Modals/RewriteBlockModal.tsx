import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, X, ArrowRight } from 'lucide-react';
import { rewriteBlock } from '../../services/api';
import { Project } from '../../types';

interface RewriteBlockModalProps {
  isOpen: boolean;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  project: Project;
  onApply: (newValue: string) => void;
  onClose: () => void;
}

export const RewriteBlockModal: React.FC<RewriteBlockModalProps> = ({
  isOpen,
  fieldName,
  fieldLabel,
  currentValue,
  project,
  onApply,
  onClose,
}) => {
  const [instructions, setInstructions] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Make it more concise and punchy',
    'Emphasize enterprise security and trust',
    'Add urgent conversion-oriented phrasing',
    'Highlight speed and frictionless workflow',
    'Soften the tone to be warmer and friendlier',
  ];

  const handleGenerate = async (customInstruction?: string) => {
    setIsLoading(true);
    setError(null);
    const instructionToUse = customInstruction || instructions;

    try {
      const result = await rewriteBlock(
        fieldName,
        currentValue,
        instructionToUse,
        {
          businessName: project.businessName,
          industry: project.industry,
          tone: project.tone,
          usp: project.usp,
          preferredLanguage: project.preferredLanguage,
        }
      );
      setRewrittenText(result);
    } catch (err: any) {
      setError(err.message || 'Failed to rewrite text.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-tight">Rewrite with AI</h3>
              <p className="text-xs text-slate-400">Field: {fieldLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Current Value</label>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-300 max-h-28 overflow-y-auto">
            {currentValue || <span className="italic text-slate-500">Empty</span>}
          </div>
        </div>

        {/* Rewrite Guidance */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">
            Guidance for AI <span className="text-slate-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Make it shorter, more urgent, focus on ROI..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          {/* Quick prompt chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setInstructions(prompt);
                  handleGenerate(prompt);
                }}
                className="text-xs px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Crafting Revision...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Revision
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Rewritten Preview */}
        {rewrittenText && (
          <div className="space-y-3 pt-2 border-t border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Suggested Revision
              </span>
              <span className="text-xs text-slate-500">{rewrittenText.length} characters</span>
            </div>
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-sm text-emerald-200 leading-relaxed max-h-36 overflow-y-auto">
              {rewrittenText}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(rewrittenText);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                Apply This Revision <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
