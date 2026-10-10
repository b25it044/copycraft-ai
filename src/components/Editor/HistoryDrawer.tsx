import React from 'react';
import {
  History,
  Clock,
  RotateCcw,
  CheckCircle2,
  X,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ContentSnapshot } from '../../hooks/useContentHistory';

interface HistoryDrawerProps {
  isOpen: boolean;
  snapshots: ContentSnapshot[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onJumpTo: (index: number) => void;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  snapshots,
  currentIndex,
  canUndo,
  canRedo,
  undoCount,
  redoCount,
  onUndo,
  onRedo,
  onJumpTo,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Revision History</h3>
              <p className="text-xs text-slate-400">
                Stack of {snapshots.length} content snapshots
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close revision history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Undo / Redo Control Bar */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Undo ({undoCount})</span>
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Redo ({redoCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Index: {currentIndex + 1} / {snapshots.length}
          </span>
        </div>

        {/* Snapshots Timeline List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {snapshots.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No snapshots recorded yet.
            </div>
          ) : (
            // Render in reverse chronological order (newest first)
            snapshots
              .map((snapshot, originalIndex) => {
                const isCurrent = originalIndex === currentIndex;
                const isPast = originalIndex < currentIndex;
                const isFuture = originalIndex > currentIndex;
                const timeString = new Date(snapshot.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={snapshot.id}
                    onClick={() => onJumpTo(originalIndex)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all relative group ${
                      isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                        : isPast
                        ? 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                        : 'bg-slate-950/40 border-dashed border-slate-800/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {isCurrent ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active State</span>
                          </div>
                        ) : isPast ? (
                          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                            Step #{originalIndex + 1}
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-semibold text-amber-500/80 tracking-wider">
                            Redo Target #{originalIndex + 1}
                          </span>
                        )}

                        {snapshot.section && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {snapshot.section}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{timeString}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {snapshot.actionLabel}
                      </p>

                      {!isCurrent && (
                        <span className="text-[11px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1 shrink-0">
                          <RotateCcw className="w-3 h-3" /> Revert
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
              .reverse()
          )}
        </div>

        {/* Drawer Footer with Keyboard Shortcuts */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0 text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Keyboard Shortcuts</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Undo recent change:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
              Cmd / Ctrl + Z
            </kbd>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Redo next change:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-300">
              Cmd + Shift + Z
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
