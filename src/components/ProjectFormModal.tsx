import React, { useState } from 'react';
import { Sparkles, Save, X, AlertCircle } from 'lucide-react';
import { Project, ProjectFormDetails, Tone, WebsiteStyle } from '../types';
import { defaultStyling } from '../services/storage';

interface ProjectFormModalProps {
  isOpen: boolean;
  initialProject?: Project | null;
  onSave: (project: Project, shouldGenerateAI: boolean) => Promise<void>;
  onClose: () => void;
}

const toneOptions: { value: Tone; label: string; desc: string }[] = [
  { value: 'Professional', label: 'Professional', desc: 'Authoritative, clear, and trustworthy.' },
  { value: 'Friendly', label: 'Friendly', desc: 'Warm, approachable, and conversational.' },
  { value: 'Bold', label: 'Bold', desc: 'Punchy, confident, and direct.' },
  { value: 'Luxurious', label: 'Luxurious', desc: 'Refined, sophisticated, and exclusive.' },
  { value: 'Minimal', label: 'Minimal', desc: 'Succinct, understated, and precise.' },
  { value: 'Playful', label: 'Playful', desc: 'Witty, vibrant, and energetic.' },
  { value: 'Persuasive', label: 'Persuasive', desc: 'High-conversion, benefit-focused, and compelling.' },
];

const styleOptions: { value: WebsiteStyle; label: string; desc: string }[] = [
  { value: 'Modern', label: 'Modern', desc: 'Sleek spacing, bold hero typography, clean cards.' },
  { value: 'Minimal', label: 'Minimal', desc: 'Generous whitespace, quiet elegance, distraction-free.' },
  { value: 'Corporate', label: 'Corporate', desc: 'Structured grids, robust enterprise layout.' },
  { value: 'Creative', label: 'Creative', desc: 'Expressive headings, energetic layouts.' },
  { value: 'Elegant', label: 'Elegant', desc: 'Classic editorial serif typography and subtle warmth.' },
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  initialProject,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(initialProject);

  const [formData, setFormData] = useState<ProjectFormDetails>({
    projectName: initialProject?.projectName || '',
    businessName: initialProject?.businessName || '',
    industry: initialProject?.industry || '',
    businessDescription: initialProject?.businessDescription || '',
    targetAudience: initialProject?.targetAudience || '',
    productsAndServices: initialProject?.productsAndServices || '',
    usp: initialProject?.usp || '',
    brandMission: initialProject?.brandMission || '',
    brandValues: initialProject?.brandValues || '',
    tone: initialProject?.tone || 'Professional',
    primaryConversionGoal: initialProject?.primaryConversionGoal || 'Generate inquiries/leads',
    ctaPreference: initialProject?.ctaPreference || 'Get Started',
    primaryKeyword: initialProject?.primaryKeyword || '',
    secondaryKeywords: initialProject?.secondaryKeywords || '',
    preferredLanguage: initialProject?.preferredLanguage || 'English',
    websiteStyle: initialProject?.websiteStyle || 'Modern',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.projectName.trim()) errs.projectName = 'Project name is required.';
    if (!formData.businessName.trim()) errs.businessName = 'Business or brand name is required.';
    if (!formData.industry.trim()) errs.industry = 'Industry is required.';
    if (!formData.businessDescription.trim()) errs.businessDescription = 'Please supply a brief business description.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (shouldGenerate: boolean) => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const projectToSave: Project = {
        id: initialProject?.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...formData,
        createdAt: initialProject?.createdAt || Date.now(),
        lastModified: Date.now(),
        styling: initialProject?.styling || defaultStyling,
        content: initialProject?.content || null,
      };

      await onSave(projectToSave, shouldGenerate);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? 'Edit Project Brief' : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Provide your business fundamentals so CopyCraft AI can craft authentic, high-converting copy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section: Core Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              1. Brand Identity & Industry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Workspace Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Apex Studio Redesign"
                  className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                    errors.projectName ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.projectName && <p className="text-xs text-rose-400 mt-1">{errors.projectName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Business / Brand Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Apex Industrial Systems"
                  className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                    errors.businessName ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.businessName && <p className="text-xs text-rose-400 mt-1">{errors.businessName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Industry / Market Domain <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Precision Manufacturing / Robotics"
                  className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                    errors.industry ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.industry && <p className="text-xs text-rose-400 mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Operations Directors, Chief Engineers, B2B Procurement"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Business Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                placeholder="What does your company do, who does it serve, and why does it matter?"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                  errors.businessDescription ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.businessDescription && (
                <p className="text-xs text-rose-400 mt-1">{errors.businessDescription}</p>
              )}
            </div>
          </div>

          {/* Section: Value Proposition & Offerings */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              2. Offerings & Differentiators
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Products and Services (List key packages or offerings)
              </label>
              <textarea
                rows={2}
                value={formData.productsAndServices}
                onChange={(e) => setFormData({ ...formData, productsAndServices: e.target.value })}
                placeholder="e.g. Custom CNC Machining, Additive Prototyping, Automated Quality Inspection"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Unique Selling Proposition (USP)
              </label>
              <input
                type="text"
                value={formData.usp}
                onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                placeholder="e.g. 99.9% tolerance precision with 48-hour turnarounds and zero minimum orders"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Brand Mission
                </label>
                <input
                  type="text"
                  value={formData.brandMission}
                  onChange={(e) => setFormData({ ...formData, brandMission: e.target.value })}
                  placeholder="e.g. To accelerate hardware innovation through friction-free manufacturing"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Core Brand Values
                </label>
                <input
                  type="text"
                  value={formData.brandValues}
                  onChange={(e) => setFormData({ ...formData, brandValues: e.target.value })}
                  placeholder="e.g. Integrity, Relentless Precision, Speed, Environmental Responsibility"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Tone, Style & Goals */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              3. Writing Tone & Conversion Goals
            </h3>

            {/* Tone selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Preferred Writing Tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {toneOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone: opt.value })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.tone === opt.value
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{opt.label}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style preference */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Website Style Aesthetic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, websiteStyle: style.value })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.websiteStyle === style.value
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{style.label}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Primary Conversion Goal
                </label>
                <input
                  type="text"
                  value={formData.primaryConversionGoal}
                  onChange={(e) => setFormData({ ...formData, primaryConversionGoal: e.target.value })}
                  placeholder="e.g. Schedule a 30-min discovery call, Request a quote"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Call-to-Action (CTA) Label Preference
                </label>
                <input
                  type="text"
                  value={formData.ctaPreference}
                  onChange={(e) => setFormData({ ...formData, ctaPreference: e.target.value })}
                  placeholder="e.g. Request Instant Quote, Start Free Trial"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Primary Keyword
                </label>
                <input
                  type="text"
                  value={formData.primaryKeyword}
                  onChange={(e) => setFormData({ ...formData, primaryKeyword: e.target.value })}
                  placeholder="e.g. precision CNC machining"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Secondary Keywords
                </label>
                <input
                  type="text"
                  value={formData.secondaryKeywords}
                  onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
                  placeholder="e.g. rapid tooling, 5-axis milling"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Preferred Language
                </label>
                <input
                  type="text"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  placeholder="e.g. English, Spanish, German, French"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-slate-400" />
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Generating with AI...' : 'Save & Generate Copy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
