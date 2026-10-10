/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EditorWorkspace } from './components/Editor/EditorWorkspace';
import { WebsitePreview } from './components/Preview/WebsitePreview';
import { SEOAnalysisPanel } from './components/SEO/SEOAnalysisPanel';
import { ProjectFormModal } from './components/ProjectFormModal';
import { ExportWebsiteModal } from './components/Modals/ExportWebsiteModal';
import { ConfirmModal } from './components/Modals/ConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Project,
  ProjectContent,
  ProjectStyling,
} from './types';
import {
  getStoredProjects,
  saveSingleProject,
  deleteStoredProject,
  duplicateStoredProject,
  exportProjectJSON,
  parseAndValidateProjectJSON,
  getActiveProjectId,
  setActiveProjectId,
  saveAllProjects,
} from './services/storage';
import { generateFullCopy, regenerateSection, checkHealth } from './services/api';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectIdState, setActiveProjectIdState] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'preview' | 'seo'>('dashboard');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectBrief, setEditingProjectBrief] = useState<Project | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load projects on startup
  useEffect(() => {
    const loaded = getStoredProjects();
    setProjects(loaded);

    const savedActiveId = getActiveProjectId();
    if (savedActiveId && loaded.some((p) => p.id === savedActiveId)) {
      setActiveProjectIdState(savedActiveId);
    } else if (loaded.length > 0) {
      setActiveProjectIdState(loaded[0].id);
    }

    // Health check
    checkHealth().catch(() => {});
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectIdState) || null;

  // Save current project edits
  const handleSaveActiveProject = () => {
    if (!activeProject) return;
    saveSingleProject(activeProject);
    setHasUnsavedChanges(false);
    showToast('Project saved successfully', 'success');
  };

  // Update active project content in memory
  const handleUpdateContent = (newContent: ProjectContent) => {
    if (!activeProject) return;
    const updated: Project = {
      ...activeProject,
      content: newContent,
      lastModified: Date.now(),
    };
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setHasUnsavedChanges(true);
  };

  // Update active project styling
  const handleUpdateStyling = (newStyling: ProjectStyling) => {
    if (!activeProject) return;
    const updated: Project = {
      ...activeProject,
      styling: newStyling,
      lastModified: Date.now(),
    };
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveSingleProject(updated);
    showToast('Website styling preferences updated', 'success');
  };

  // Generate All 5 Sections with AI
  const handleGenerateFullCopy = async (targetProject?: Project) => {
    const proj = targetProject || activeProject;
    if (!proj) return;

    setIsGenerating(true);
    showToast('CopyCraft AI is generating full website copy...', 'info');

    try {
      const generated = await generateFullCopy(proj);
      const updatedProj: Project = {
        ...proj,
        content: generated,
        lastModified: Date.now(),
      };
      saveSingleProject(updatedProj);
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === updatedProj.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedProj;
          return next;
        }
        return [updatedProj, ...prev];
      });
      setActiveProjectIdState(updatedProj.id);
      setActiveProjectId(updatedProj.id);
      setHasUnsavedChanges(false);
      showToast('All 5 website sections generated successfully!', 'success');
    } catch (err: any) {
      console.error('Generation error:', err);
      showToast(err.message || 'AI Generation failed. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate Single Section
  const handleRegenerateSection = async (section: keyof ProjectContent, instructions: string) => {
    if (!activeProject || !activeProject.content) return;

    try {
      const sectionData = await regenerateSection(activeProject, section, instructions);
      const updatedContent: ProjectContent = {
        ...activeProject.content,
        [section]: sectionData,
      };
      const updatedProj: Project = {
        ...activeProject,
        content: updatedContent,
        lastModified: Date.now(),
      };
      saveSingleProject(updatedProj);
      setProjects((prev) => prev.map((p) => (p.id === updatedProj.id ? updatedProj : p)));
      setHasUnsavedChanges(false);
    } catch (err: any) {
      showToast(err.message || `Failed to regenerate ${section} section.`, 'error');
      throw err;
    }
  };

  // Save Project Form Modal (create or update brief)
  const handleSaveProjectForm = async (projectToSave: Project, shouldGenerateAI: boolean) => {
    saveSingleProject(projectToSave);
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === projectToSave.id);
      return exists ? prev.map((p) => (p.id === projectToSave.id ? projectToSave : p)) : [projectToSave, ...prev];
    });
    setActiveProjectIdState(projectToSave.id);
    setActiveProjectId(projectToSave.id);
    setCurrentView('editor');

    if (shouldGenerateAI) {
      await handleGenerateFullCopy(projectToSave);
    } else {
      showToast('Project brief saved as draft', 'success');
    }
  };

  // Duplicate Project
  const handleDuplicate = (id: string) => {
    const duplicated = duplicateStoredProject(id);
    if (duplicated) {
      setProjects(getStoredProjects());
      showToast(`Duplicated as "${duplicated.projectName}"`, 'success');
    }
  };

  // Delete Project with confirmation
  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    const remaining = deleteStoredProject(deleteConfirmId);
    setProjects(remaining);
    if (activeProjectIdState === deleteConfirmId) {
      const nextId = remaining.length > 0 ? remaining[0].id : null;
      setActiveProjectIdState(nextId);
      setActiveProjectId(nextId);
      if (!nextId) setCurrentView('dashboard');
    }
    setDeleteConfirmId(null);
    showToast('Project deleted successfully', 'info');
  };

  // Import JSON file
  const handleImportJSON = (rawJson: string) => {
    try {
      const imported = parseAndValidateProjectJSON(rawJson);
      saveSingleProject(imported);
      setProjects((prev) => [imported, ...prev]);
      setActiveProjectIdState(imported.id);
      setActiveProjectId(imported.id);
      setCurrentView('editor');
      showToast(`Imported project "${imported.projectName}"`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to import project JSON.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Header */}
      <Header
        currentView={currentView}
        activeProject={activeProject}
        hasUnsavedChanges={hasUnsavedChanges}
        onNavigate={(view) => {
          if (hasUnsavedChanges) {
            handleSaveActiveProject();
          }
          setCurrentView(view);
        }}
        onNewProject={() => {
          setEditingProjectBrief(null);
          setIsProjectModalOpen(true);
        }}
        onExportZip={() => setIsExportModalOpen(true)}
        onSaveCurrent={handleSaveActiveProject}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' && (
          <Dashboard
            projects={projects}
            onOpenProject={(proj, targetView = 'editor') => {
              setActiveProjectIdState(proj.id);
              setActiveProjectId(proj.id);
              setCurrentView(targetView);
            }}
            onNewProject={() => {
              setEditingProjectBrief(null);
              setIsProjectModalOpen(true);
            }}
            onEditBrief={(proj) => {
              setEditingProjectBrief(proj);
              setIsProjectModalOpen(true);
            }}
            onDuplicateProject={handleDuplicate}
            onDeleteProject={(id) => setDeleteConfirmId(id)}
            onExportJSON={exportProjectJSON}
            onImportJSON={handleImportJSON}
            onExportZip={(proj) => {
              setActiveProjectIdState(proj.id);
              setActiveProjectId(proj.id);
              setIsExportModalOpen(true);
            }}
          />
        )}

        {currentView === 'editor' && activeProject && (
          <EditorWorkspace
            project={activeProject}
            onUpdateContent={handleUpdateContent}
            onSaveProject={handleSaveActiveProject}
            hasUnsavedChanges={hasUnsavedChanges}
            onRegenerateSection={handleRegenerateSection}
            onGenerateFull={() => handleGenerateFullCopy()}
            isGenerating={isGenerating}
            onShowToast={showToast}
          />
        )}

        {currentView === 'preview' && activeProject && (
          <WebsitePreview
            project={activeProject}
            onUpdateStyling={handleUpdateStyling}
            onShowToast={showToast}
          />
        )}

        {currentView === 'seo' && activeProject && (
          <SEOAnalysisPanel
            project={activeProject}
            onNavigateToEditor={(tab) => {
              setCurrentView('editor');
            }}
          />
        )}
      </main>

      {/* Project Form Modal (New / Edit) */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        initialProject={editingProjectBrief}
        onSave={handleSaveProjectForm}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProjectBrief(null);
        }}
      />

      {/* Export Website ZIP Modal */}
      {activeProject && (
        <ExportWebsiteModal
          isOpen={isExportModalOpen}
          project={activeProject}
          onClose={() => setIsExportModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Delete Project Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Project Workspace"
        message="Are you sure you want to delete this project? All generated sections and edits for this workspace will be permanently removed."
        confirmLabel="Delete Project"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />

      {/* Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
