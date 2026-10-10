import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Upload,
  Download,
  Trash2,
  Copy,
  Edit2,
  Eye,
  FileCode,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onOpenProject: (project: Project, view?: 'editor' | 'preview') => void;
  onNewProject: () => void;
  onEditBrief: (project: Project) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onExportJSON: (project: Project) => void;
  onImportJSON: (rawJson: string) => void;
  onExportZip: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onEditBrief,
  onDuplicateProject,
  onDeleteProject,
  onExportJSON,
  onImportJSON,
  onExportZip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTone = selectedTone === 'all' || p.tone === selectedTone;
    return matchesSearch && matchesTone;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onImportJSON(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generatedCount = projects.filter((p) => p.content !== null).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Website Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your AI-crafted website copy workspaces, customize section texts, and export static sites.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all flex items-center gap-1.5"
            title="Import previously exported project JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={onNewProject}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Workspaces</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">{projects.length}</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl text-slate-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Generated Copies</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">{generatedCount}</div>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Ready to Export</span>
            <div className="text-2xl font-bold text-white mt-1 tabular-nums">{generatedCount}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or industry..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tone Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Professional', 'Bold', 'Friendly', 'Luxurious', 'Persuasive'].map((tone) => (
            <button
              key={tone}
              onClick={() => setSelectedTone(tone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTone === tone
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tone === 'all' ? 'All Tones' : tone}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No projects matched "${searchQuery}". Try clearing your search query.`
                : 'Get started by creating your first website project brief.'}
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const hasContent = Boolean(project.content);
            const timeAgo = new Date(project.lastModified).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={project.id}
                className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  {/* Card Header & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-indigo-400">{project.businessName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.industry || 'General'}</span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                        {project.projectName}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                        hasContent
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {hasContent ? 'Generated' : 'Draft'}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.businessDescription || 'No description provided.'}
                  </p>

                  {/* Metadata line */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>Tone: {project.tone}</span>
                    <span aria-hidden="true">·</span>
                    <span>Style: {project.websiteStyle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="tabular-nums">{timeAgo}</span>
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditBrief(project)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit project brief inputs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onExportJSON(project)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Export project data as JSON"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                    {hasContent && (
                      <button
                        onClick={() => onExportZip(project)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Download static site ZIP"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasContent && (
                      <button
                        onClick={() => onOpenProject(project, 'preview')}
                        className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    )}

                    <button
                      onClick={() => onOpenProject(project, 'editor')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {hasContent ? 'Edit Copy' : 'Generate'}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
