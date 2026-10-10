import React from 'react';
import { Sparkles, Download, Plus, LayoutDashboard, Edit3, Eye, Search, FileJson } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  currentView: 'dashboard' | 'editor' | 'preview' | 'seo';
  activeProject: Project | null;
  hasUnsavedChanges: boolean;
  onNavigate: (view: 'dashboard' | 'editor' | 'preview' | 'seo') => void;
  onNewProject: () => void;
  onExportZip: () => void;
  onSaveCurrent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeProject,
  hasUnsavedChanges,
  onNavigate,
  onNewProject,
  onExportZip,
  onSaveCurrent,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800/80 backdrop-blur-md px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                CopyCraft AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                WEBSITE COPY GENERATOR
              </span>
            </div>
          </button>

          {activeProject && (
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <span className="text-slate-500">Project:</span>
              <span className="font-medium text-slate-200 truncate max-w-[200px]">
                {activeProject.projectName}
              </span>
              {hasUnsavedChanges && (
                <span className="text-amber-400 text-[11px] font-medium animate-pulse">
                  (Unsaved changes)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {activeProject && (
            <>
              <button
                onClick={() => onNavigate('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  currentView === 'editor'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Copy Editor</span>
              </button>

              <button
                onClick={() => onNavigate('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  currentView === 'preview'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                onClick={() => onNavigate('seo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  currentView === 'seo'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>SEO Analysis</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeProject && activeProject.content && (
            <button
              onClick={onExportZip}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 hover:text-white border border-slate-700/80 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
              title="Download functional static website ZIP"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export ZIP</span>
            </button>
          )}

          <button
            onClick={onNewProject}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};
