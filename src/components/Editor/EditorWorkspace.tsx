import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Undo2,
  Redo2,
  Save,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Sliders,
  AlertCircle,
  HelpCircle,
  Wand2,
  History,
} from 'lucide-react';
import { Project, ProjectContent, ServiceItem, FAQItem } from '../../types';
import { RewriteBlockModal } from '../Modals/RewriteBlockModal';
import { RegenerateSectionModal } from '../Modals/RegenerateSectionModal';
import { useContentHistory } from '../../hooks/useContentHistory';
import { HistoryDrawer } from './HistoryDrawer';

interface EditorWorkspaceProps {
  project: Project;
  onUpdateContent: (newContent: ProjectContent) => void;
  onSaveProject: () => void;
  hasUnsavedChanges: boolean;
  onRegenerateSection: (section: keyof ProjectContent, instructions: string) => Promise<void>;
  onGenerateFull: () => Promise<void>;
  isGenerating: boolean;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  project,
  onUpdateContent,
  onSaveProject,
  hasUnsavedChanges,
  onRegenerateSection,
  onGenerateFull,
  isGenerating,
  onShowToast,
}) => {
  const content = project.content;
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'services' | 'faq' | 'seo'>('home');
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // History state management system with snapshot stack
  const history = useContentHistory({
    projectId: project.id,
    initialContent: project.content,
    maxStackSize: 50,
    onApplyContent: (newContent) => onUpdateContent(newContent),
    onShowToast,
  });

  // Modals state
  const [rewriteModal, setRewriteModal] = useState<{
    isOpen: boolean;
    fieldName: string;
    fieldLabel: string;
    currentValue: string;
  }>({
    isOpen: false,
    fieldName: '',
    fieldLabel: '',
    currentValue: '',
  });

  const [regenSectionModal, setRegenSectionModal] = useState<{
    isOpen: boolean;
    section: keyof ProjectContent;
  }>({
    isOpen: false,
    section: 'home',
  });

  // Record an immutable snapshot to the history stack
  const pushUpdate = (newContent: ProjectContent, actionLabel: string = 'Edited Content') => {
    history.recordSnapshot(newContent, actionLabel, activeTab);
  };

  // Keyboard shortcut listener for Cmd+Z (undo), Cmd+Shift+Z / Cmd+Y (redo), Cmd+S (save), Cmd+H (history)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        history.redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSaveProject();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsHistoryDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, onSaveProject]);

  // Copy helpers
  const handleCopySection = () => {
    if (!content) return;
    let markdown = '';
    if (activeTab === 'home') {
      markdown = `# Home Page Copy\n\n## Hero Headline\n${content.home.heroHeadline}\n\n## Subheadline\n${content.home.supportingHeadline}\n\n## Introduction\n${content.home.introduction}\n\n## Key Benefits\n${content.home.benefits.map((b) => `- ${b}`).join('\n')}\n\n## Features\n${content.home.features.map((f) => `- ${f}`).join('\n')}\n\nPrimary CTA: ${content.home.primaryCTA}\nSecondary CTA: ${content.home.secondaryCTA}`;
    } else if (activeTab === 'about') {
      markdown = `# About Page Copy\n\n## Company Intro\n${content.about.companyIntroduction}\n\n## Brand Story\n${content.about.brandStory}\n\n## Mission\n${content.about.mission}\n\n## Vision\n${content.about.vision}\n\n## Values\n${content.about.brandValues.map((v) => `- ${v}`).join('\n')}\n\n## Differentiators\n${content.about.differentiators.map((d) => `- ${d}`).join('\n')}`;
    } else if (activeTab === 'services') {
      markdown = `# Services Copy\n\n` + content.services.map((s) => `### ${s.name}\n${s.description}\nBenefits:\n${s.benefits.map((b) => `- ${b}`).join('\n')}\nFeatures:\n${s.features.map((f) => `- ${f}`).join('\n')}\nCTA: ${s.callToAction}`).join('\n\n');
    } else if (activeTab === 'faq') {
      markdown = `# Frequently Asked Questions\n\n` + content.faq.map((f) => `**Q: ${f.question}**\nA: ${f.answer}`).join('\n\n');
    } else if (activeTab === 'seo') {
      markdown = `# SEO Metadata\n\nTitle: ${content.seo.seoTitle}\nMeta Description: ${content.seo.metaDescription}\nSlug: ${content.seo.urlSlug}\nPrimary Keyword: ${content.seo.primaryKeyword}\nOG Title: ${content.seo.ogTitle}\nOG Description: ${content.seo.ogDescription}\nAlt Text: ${content.seo.suggestedImageAltText}`;
    }

    navigator.clipboard.writeText(markdown);
    onShowToast(`Copied ${activeTab.toUpperCase()} section copy as Markdown!`, 'success');
  };

  const handleCopyAllCopy = () => {
    if (!content) return;
    const fullMarkdown = `
# ${project.businessName} Website Copy

## 1. HOME SECTION
Hero Headline: ${content.home.heroHeadline}
Supporting Headline: ${content.home.supportingHeadline}
Introduction: ${content.home.introduction}
Benefits:
${content.home.benefits.map((b) => `- ${b}`).join('\n')}
Features:
${content.home.features.map((f) => `- ${f}`).join('\n')}
Primary CTA: ${content.home.primaryCTA}
Secondary CTA: ${content.home.secondaryCTA}

---

## 2. ABOUT SECTION
Introduction: ${content.about.companyIntroduction}
Story: ${content.about.brandStory}
Mission: ${content.about.mission}
Vision: ${content.about.vision}
Values:
${content.about.brandValues.map((v) => `- ${v}`).join('\n')}
Differentiators:
${content.about.differentiators.map((d) => `- ${d}`).join('\n')}

---

## 3. SERVICES SECTION
${content.services.map((s) => `### ${s.name}\n${s.description}\nCTA: ${s.callToAction}`).join('\n\n')}

---

## 4. FAQ SECTION
${content.faq.map((f) => `**Q: ${f.question}**\nA: ${f.answer}`).join('\n\n')}

---

## 5. SEO METADATA
SEO Title: ${content.seo.seoTitle}
Meta Description: ${content.seo.metaDescription}
Primary Keyword: ${content.seo.primaryKeyword}
Secondary Keywords: ${content.seo.secondaryKeywords.join(', ')}
    `.trim();

    navigator.clipboard.writeText(fullMarkdown);
    onShowToast('Copied all 5 sections as formatted Markdown!', 'success');
  };

  // If no content yet, show empty state with Generate button
  if (!content) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto my-12 space-y-6 shadow-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Ready to generate website copy?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            CopyCraft AI will generate structured, editable copy for all five website sections
            (Home, About, Services, FAQ, and SEO Metadata) tailored to {project.businessName}.
          </p>
        </div>

        <button
          onClick={onGenerateFull}
          disabled={isGenerating}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all inline-flex items-center gap-2.5 shadow-lg shadow-indigo-600/30"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating Full Website Copy...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate All 5 Website Sections
            </>
          )}
        </button>
      </div>
    );
  }

  // Section labels
  const tabs = [
    { id: 'home', label: '1. Home Page', icon: '🏠' },
    { id: 'about', label: '2. About Page', icon: '📖' },
    { id: 'services', label: '3. Services', icon: '⚡' },
    { id: 'faq', label: '4. FAQ', icon: '❓' },
    { id: 'seo', label: '5. SEO Metadata', icon: '🔍' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Editor Sub-Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Undo and Redo Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={history.undo}
              disabled={!history.canUndo}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                history.canUndo
                  ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-100 hover:text-white border-slate-700/80 shadow-sm cursor-pointer'
                  : 'bg-slate-900/60 text-slate-600 border-slate-800/40 opacity-40 cursor-not-allowed'
              }`}
              title={
                history.canUndo
                  ? `Undo last action (${history.undoCount} steps available) [Cmd/Ctrl + Z]`
                  : 'No actions to undo'
              }
              aria-label="Undo last editing action"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
              {history.undoCount > 0 && (
                <span className="font-mono text-[10px] text-slate-400">({history.undoCount})</span>
              )}
            </button>

            <button
              type="button"
              onClick={history.redo}
              disabled={!history.canRedo}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                history.canRedo
                  ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-100 hover:text-white border-slate-700/80 shadow-sm cursor-pointer'
                  : 'bg-slate-900/60 text-slate-600 border-slate-800/40 opacity-40 cursor-not-allowed'
              }`}
              title={
                history.canRedo
                  ? `Redo next action (${history.redoCount} steps available) [Cmd+Shift+Z / Cmd+Y]`
                  : 'No actions to redo'
              }
              aria-label="Redo previous editing action"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>Redo</span>
              {history.redoCount > 0 && (
                <span className="font-mono text-[10px] text-slate-400">({history.redoCount})</span>
              )}
            </button>
          </div>

          {/* History Revision Stack Drawer Button */}
          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all flex items-center gap-1.5"
            title="Open Revision History timeline"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            <span className="text-[10px] font-mono text-slate-400">({history.totalSnapshots})</span>
          </button>

          {/* Regenerate Current Section */}
          <button
            onClick={() => setRegenSectionModal({ isOpen: true, section: activeTab })}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all flex items-center gap-1.5"
            title="Regenerate this specific section with AI"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Regenerate Section</span>
          </button>

          {/* Copy section */}
          <button
            onClick={handleCopySection}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all flex items-center gap-1.5"
            title="Copy current section as Markdown"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Section</span>
          </button>

          {/* Copy all copy */}
          <button
            onClick={handleCopyAllCopy}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-all"
            title="Copy all website copy as Markdown"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          {/* Save button */}
          <button
            onClick={onSaveProject}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-800 text-slate-500 cursor-default'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasUnsavedChanges ? 'Save Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="space-y-6">
        {/* ==================== 1. HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Hero Section</h3>
                  <p className="text-xs text-slate-400">The first impression and primary conversion anchor.</p>
                </div>
              </div>

              {/* Hero Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Hero Headline</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {content.home.heroHeadline.length} chars
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRewriteModal({
                          isOpen: true,
                          fieldName: 'heroHeadline',
                          fieldLabel: 'Hero Headline',
                          currentValue: content.home.heroHeadline,
                        })
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Rewrite
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={content.home.heroHeadline}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      home: { ...content.home, heroHeadline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Supporting Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Supporting Subheadline</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 tabular-nums">
                      {content.home.supportingHeadline.length} chars
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRewriteModal({
                          isOpen: true,
                          fieldName: 'supportingHeadline',
                          fieldLabel: 'Supporting Subheadline',
                          currentValue: content.home.supportingHeadline,
                        })
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Rewrite
                    </button>
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={content.home.supportingHeadline}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      home: { ...content.home, supportingHeadline: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Primary & Secondary CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Call to Action</label>
                  <input
                    type="text"
                    value={content.home.primaryCTA}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        home: { ...content.home, primaryCTA: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Secondary Call to Action</label>
                  <input
                    type="text"
                    value={content.home.secondaryCTA}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        home: { ...content.home, secondaryCTA: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Introduction statement */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Introduction Overview</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRewriteModal({
                        isOpen: true,
                        fieldName: 'introduction',
                        fieldLabel: 'Introduction',
                        currentValue: content.home.introduction,
                      })
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Rewrite
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={content.home.introduction}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      home: { ...content.home, introduction: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Benefits & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Benefits list */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Key Benefits</h3>
                    <p className="text-[11px] text-slate-400">Core customer advantages.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...content.home.benefits, 'New strategic benefit'];
                      pushUpdate({ ...content, home: { ...content.home, benefits: updated } });
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Benefit
                  </button>
                </div>

                <div className="space-y-2.5">
                  {content.home.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...content.home.benefits];
                          updated[idx] = e.target.value;
                          pushUpdate({ ...content, home: { ...content.home, benefits: updated } });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.home.benefits.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, home: { ...content.home, benefits: updated } });
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features list */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Tangible Features</h3>
                    <p className="text-[11px] text-slate-400">Capabilities and deliverables.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...content.home.features, 'New capability feature'];
                      pushUpdate({ ...content, home: { ...content.home, features: updated } });
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Feature
                  </button>
                </div>

                <div className="space-y-2.5">
                  {content.home.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => {
                          const updated = [...content.home.features];
                          updated[idx] = e.target.value;
                          pushUpdate({ ...content, home: { ...content.home, features: updated } });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.home.features.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, home: { ...content.home, features: updated } });
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. ABOUT TAB ==================== */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">About Us Narrative</h3>
                  <p className="text-xs text-slate-400">Origin, core convictions, and organizational mission.</p>
                </div>
              </div>

              {/* Company Introduction */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Company Introduction</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRewriteModal({
                        isOpen: true,
                        fieldName: 'companyIntroduction',
                        fieldLabel: 'Company Introduction',
                        currentValue: content.about.companyIntroduction,
                      })
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Rewrite
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={content.about.companyIntroduction}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      about: { ...content.about, companyIntroduction: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Brand Origin Story */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Brand Origin Story</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRewriteModal({
                        isOpen: true,
                        fieldName: 'brandStory',
                        fieldLabel: 'Brand Story',
                        currentValue: content.about.brandStory,
                      })
                    }
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Rewrite
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={content.about.brandStory}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      about: { ...content.about, brandStory: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Mission & Vision */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={content.about.mission}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        about: { ...content.about, mission: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Vision Statement</label>
                  <textarea
                    rows={3}
                    value={content.about.vision}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        about: { ...content.about, vision: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Values & Differentiators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Values */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Brand Values</h3>
                    <p className="text-[11px] text-slate-400">Operational principles.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...content.about.brandValues, 'Authentic Customer Respect'];
                      pushUpdate({ ...content, about: { ...content.about, brandValues: updated } });
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Value
                  </button>
                </div>

                <div className="space-y-2.5">
                  {content.about.brandValues.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => {
                          const updated = [...content.about.brandValues];
                          updated[idx] = e.target.value;
                          pushUpdate({ ...content, about: { ...content.about, brandValues: updated } });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.about.brandValues.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, about: { ...content.about, brandValues: updated } });
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Competitive Differentiators</h3>
                    <p className="text-[11px] text-slate-400">Why choose this firm.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...content.about.differentiators, 'Guaranteed 24-hour turnaround'];
                      pushUpdate({ ...content, about: { ...content.about, differentiators: updated } });
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Differentiator
                  </button>
                </div>

                <div className="space-y-2.5">
                  {content.about.differentiators.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={d}
                        onChange={(e) => {
                          const updated = [...content.about.differentiators];
                          updated[idx] = e.target.value;
                          pushUpdate({ ...content, about: { ...content.about, differentiators: updated } });
                        }}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.about.differentiators.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, about: { ...content.about, differentiators: updated } });
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Services & Packages</h3>
                <p className="text-xs text-slate-400">
                  Manage service offerings, deliverables, and customized CTAs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newService: ServiceItem = {
                    id: `srv-${Date.now()}`,
                    name: 'New Custom Service',
                    description: 'Comprehensive solutions delivering clear, predictable ROI for your team.',
                    benefits: ['Fast integration', 'Expert guidance'],
                    features: ['Dedicated architect', 'Complete documentation'],
                    callToAction: 'Book Consultation',
                  };
                  pushUpdate({ ...content, services: [...content.services, newService] });
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {content.services.map((srv, idx) => (
                <div
                  key={srv.id || idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Service {idx + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...content.services];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        disabled={idx === content.services.length - 1}
                        onClick={() => {
                          const updated = [...content.services];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.services.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Service Name</label>
                      <input
                        type="text"
                        value={srv.name}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx] = { ...srv, name: e.target.value };
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Call to Action Label</label>
                      <input
                        type="text"
                        value={srv.callToAction}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx] = { ...srv, callToAction: e.target.value };
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Description</label>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const updated = [...content.services];
                        updated[idx] = { ...srv, description: e.target.value };
                        pushUpdate({ ...content, services: updated });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  {/* Benefits & Features Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        Benefits <span className="text-slate-500">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={(srv.benefits || []).join(', ')}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx] = {
                            ...srv,
                            benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          };
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        Features <span className="text-slate-500">(comma-separated)</span>
                      </label>
                      <input
                        type="text"
                        value={(srv.features || []).join(', ')}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx] = {
                            ...srv,
                            features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          };
                          pushUpdate({ ...content, services: updated });
                        }}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. FAQ TAB ==================== */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400">
                  Address customer objections, pricing clarity, and onboarding processes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newFAQ: FAQItem = {
                    id: `faq-${Date.now()}`,
                    category: 'General',
                    question: 'How do we get started?',
                    answer: 'Reach out to our team via the contact form and we will schedule an introductory discovery session within one business day.',
                  };
                  pushUpdate({ ...content, faq: [...content.faq, newFAQ] });
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {content.faq.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        Q{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.category || 'General'}
                        onChange={(e) => {
                          const updated = [...content.faq];
                          updated[idx] = { ...item, category: e.target.value };
                          pushUpdate({ ...content, faq: updated });
                        }}
                        placeholder="Category"
                        className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...content.faq];
                          const temp = updated[idx - 1];
                          updated[idx - 1] = updated[idx];
                          updated[idx] = temp;
                          pushUpdate({ ...content, faq: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={idx === content.faq.length - 1}
                        onClick={() => {
                          const updated = [...content.faq];
                          const temp = updated[idx + 1];
                          updated[idx + 1] = updated[idx];
                          updated[idx] = temp;
                          pushUpdate({ ...content, faq: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-20 rounded-lg transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.faq.filter((_, i) => i !== idx);
                          pushUpdate({ ...content, faq: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Question</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => {
                        const updated = [...content.faq];
                        updated[idx] = { ...item, question: e.target.value };
                        pushUpdate({ ...content, faq: updated });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Answer</label>
                    <textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => {
                        const updated = [...content.faq];
                        updated[idx] = { ...item, answer: e.target.value };
                        pushUpdate({ ...content, faq: updated });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 5. SEO TAB ==================== */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Search Engine Optimization</h3>
                  <p className="text-xs text-slate-400">
                    Metadata tags, Open Graph social share cards, and keyword targeting.
                  </p>
                </div>
              </div>

              {/* SEO Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">SEO Title Tag</label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-medium tabular-nums ${
                        content.seo.seoTitle.length >= 40 && content.seo.seoTitle.length <= 60
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {content.seo.seoTitle.length} / 60 chars (Optimal: 40-60)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRewriteModal({
                          isOpen: true,
                          fieldName: 'seoTitle',
                          fieldLabel: 'SEO Title',
                          currentValue: content.seo.seoTitle,
                        })
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Rewrite
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={content.seo.seoTitle}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      seo: { ...content.seo, seoTitle: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Meta Description</label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-medium tabular-nums ${
                        content.seo.metaDescription.length >= 120 &&
                        content.seo.metaDescription.length <= 160
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {content.seo.metaDescription.length} / 160 chars (Optimal: 120-160)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setRewriteModal({
                          isOpen: true,
                          fieldName: 'metaDescription',
                          fieldLabel: 'Meta Description',
                          currentValue: content.seo.metaDescription,
                        })
                      }
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" /> Rewrite
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={content.seo.metaDescription}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      seo: { ...content.seo, metaDescription: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Slugs and Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    value={content.seo.urlSlug}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        seo: { ...content.seo, urlSlug: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Keyword</label>
                  <input
                    type="text"
                    value={content.seo.primaryKeyword}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        seo: { ...content.seo, primaryKeyword: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Secondary keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Secondary Keywords <span className="text-slate-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={(content.seo.secondaryKeywords || []).join(', ')}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      seo: {
                        ...content.seo,
                        secondaryKeywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Open Graph Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Open Graph Social Title</label>
                  <input
                    type="text"
                    value={content.seo.ogTitle}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        seo: { ...content.seo, ogTitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Open Graph Social Description</label>
                  <input
                    type="text"
                    value={content.seo.ogDescription}
                    onChange={(e) =>
                      pushUpdate({
                        ...content,
                        seo: { ...content.seo, ogDescription: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Suggested Alt text */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Suggested Hero Image Alt Text</label>
                <input
                  type="text"
                  value={content.seo.suggestedImageAltText}
                  onChange={(e) =>
                    pushUpdate({
                      ...content,
                      seo: { ...content.seo, suggestedImageAltText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rewrite Block Modal */}
      <RewriteBlockModal
        isOpen={rewriteModal.isOpen}
        fieldName={rewriteModal.fieldName}
        fieldLabel={rewriteModal.fieldLabel}
        currentValue={rewriteModal.currentValue}
        project={project}
        onApply={(newValue) => {
          if (!content) return;
          const label = `Rewrote ${rewriteModal.fieldLabel} with AI`;
          if (rewriteModal.fieldName === 'heroHeadline') {
            pushUpdate({ ...content, home: { ...content.home, heroHeadline: newValue } }, label);
          } else if (rewriteModal.fieldName === 'supportingHeadline') {
            pushUpdate({ ...content, home: { ...content.home, supportingHeadline: newValue } }, label);
          } else if (rewriteModal.fieldName === 'introduction') {
            pushUpdate({ ...content, home: { ...content.home, introduction: newValue } }, label);
          } else if (rewriteModal.fieldName === 'companyIntroduction') {
            pushUpdate({ ...content, about: { ...content.about, companyIntroduction: newValue } }, label);
          } else if (rewriteModal.fieldName === 'brandStory') {
            pushUpdate({ ...content, about: { ...content.about, brandStory: newValue } }, label);
          } else if (rewriteModal.fieldName === 'seoTitle') {
            pushUpdate({ ...content, seo: { ...content.seo, seoTitle: newValue } }, label);
          } else if (rewriteModal.fieldName === 'metaDescription') {
            pushUpdate({ ...content, seo: { ...content.seo, metaDescription: newValue } }, label);
          }
          onShowToast(`Updated ${rewriteModal.fieldLabel}`, 'success');
        }}
        onClose={() => setRewriteModal({ ...rewriteModal, isOpen: false })}
      />

      {/* Regenerate Section Modal */}
      <RegenerateSectionModal
        isOpen={regenSectionModal.isOpen}
        section={regenSectionModal.section}
        sectionTitle={tabs.find((t) => t.id === regenSectionModal.section)?.label || 'Section'}
        project={project}
        onRegenerate={async (instructions) => {
          await onRegenerateSection(regenSectionModal.section, instructions);
          onShowToast(`Successfully regenerated ${regenSectionModal.section.toUpperCase()}`, 'success');
        }}
        onClose={() => setRegenSectionModal({ ...regenSectionModal, isOpen: false })}
      />

      {/* History Snapshots Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        snapshots={history.snapshots}
        currentIndex={history.currentIndex}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        undoCount={history.undoCount}
        redoCount={history.redoCount}
        onUndo={history.undo}
        onRedo={history.redo}
        onJumpTo={history.jumpToSnapshot}
        onClose={() => setIsHistoryDrawerOpen(false)}
      />
    </div>
  );
};
