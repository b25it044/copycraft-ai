import React from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Project } from '../../types';
import { analyzeSEO } from '../../services/seo';

interface SEOAnalysisPanelProps {
  project: Project;
  onNavigateToEditor: (tab: string) => void;
}

export const SEOAnalysisPanel: React.FC<SEOAnalysisPanelProps> = ({
  project,
  onNavigateToEditor,
}) => {
  const analysis = analyzeSEO(project.content, project.primaryKeyword);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const scoreBadgeClass = getScoreColor(analysis.score);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Search className="w-4 h-4" />
            <span>On-Page SEO & Metadata Health</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            SEO Optimization Score
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Real-time algorithmic audit inspecting title length, meta description snippet bounds,
            keyword placement, Open Graph social share tags, and site content depth.
          </p>
        </div>

        {/* Score Ring Display */}
        <div
          className={`flex flex-col items-center justify-center w-32 h-32 rounded-3xl border-2 ${scoreBadgeClass} shrink-0 p-4 shadow-xl`}
        >
          <span className="text-4xl font-extrabold tabular-nums tracking-tight">
            {analysis.score}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider mt-0.5">
            / 100 Score
          </span>
          <span className="text-[10px] text-slate-400 mt-1 tabular-nums">
            {analysis.passedChecks} of {analysis.totalChecks} Checks Passed
          </span>
        </div>
      </div>

      {/* Target Focus Keywords Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white">Targeted Keyword Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Primary Focus Keyword:</span>
            <div className="text-sm font-semibold text-indigo-400 mt-1">
              {project.content?.seo.primaryKeyword || project.primaryKeyword || (
                <span className="italic text-slate-500">Not specified yet</span>
              )}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-medium">Secondary Keywords:</span>
            <div className="text-xs text-slate-200 mt-1">
              {project.content?.seo.secondaryKeywords?.length ? (
                project.content.seo.secondaryKeywords.join(', ')
              ) : (
                <span className="italic text-slate-500">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Audit Checklist & Actionable Fixes</h3>
          <button
            onClick={() => onNavigateToEditor('seo')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
          >
            Jump to SEO Metadata Editor <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {analysis.issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                issue.type === 'success'
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : issue.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                  : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {issue.type === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                {issue.type === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
                {issue.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white tracking-tight">{issue.title}</h4>
                  {issue.field && (
                    <button
                      onClick={() => onNavigateToEditor('seo')}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Fix in Editor
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{issue.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Engine Result Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white">Google Search Snippet Simulation</h3>
        <p className="text-xs text-slate-400">
          How your website will appear to prospective users in organic desktop search results:
        </p>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl font-sans">
          <div className="text-[12px] text-slate-600 flex items-center gap-1.5 truncate">
            <span>https://{project.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
            <span>›</span>
            <span>{project.content?.seo.urlSlug || 'home'}</span>
          </div>
          <div className="text-[18px] text-[#1a0dab] hover:underline font-medium cursor-pointer line-clamp-1 mt-0.5">
            {project.content?.seo.seoTitle || project.businessName}
          </div>
          <div className="text-[13px] text-[#4d5156] line-clamp-2 mt-1 leading-snug">
            {project.content?.seo.metaDescription ||
              'Complete website copy and professional services tailored to your organizational goals.'}
          </div>
        </div>
      </div>
    </div>
  );
};
