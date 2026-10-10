import { Project, ProjectFormDetails, ProjectStyling } from '../types';

const STORAGE_KEY = 'copycraft_projects_v1';
const ACTIVE_PROJECT_KEY = 'copycraft_active_project_id';

export const defaultStyling: ProjectStyling = {
  fontPairing: 'modern',
  colorPalette: 'slate-indigo',
  buttonStyle: 'rounded',
  themeMode: 'light',
};

export const sampleProjects: Project[] = [
  {
    id: 'demo-saas-novaflow',
    projectName: 'NovaFlow Analytics',
    businessName: 'NovaFlow',
    industry: 'B2B SaaS / Product Analytics',
    businessDescription: 'Real-time user journey analytics and behavioral funnel automation for high-growth digital product teams.',
    targetAudience: 'Product Managers, Growth Engineers, and VP of Product at scale-up tech firms.',
    productsAndServices: 'Self-serve funnel analysis, retention cohort engine, automated drop-off alerts, and privacy-first SDKs.',
    usp: 'Instant zero-latency funnel computation with 100% data sovereignty and no sampling.',
    brandMission: 'Give every product builder complete clarity into user behavior without privacy compromises.',
    brandValues: 'Precision, User Respect, Speed, Transparency',
    tone: 'Professional',
    primaryConversionGoal: 'Start 14-day enterprise trial without a credit card',
    ctaPreference: 'Start Free Trial',
    primaryKeyword: 'product analytics platform',
    secondaryKeywords: 'user journey analytics, conversion funnel automation, behavioral cohort tracking',
    preferredLanguage: 'English',
    websiteStyle: 'Modern',
    createdAt: Date.now() - 86400000 * 3,
    lastModified: Date.now() - 3600000 * 2,
    styling: {
      fontPairing: 'modern',
      colorPalette: 'slate-indigo',
      buttonStyle: 'rounded',
      themeMode: 'light',
    },
    content: {
      home: {
        heroHeadline: 'Understand Every Customer Journey in Real Time',
        supportingHeadline: 'Eliminate blind spots in your product funnels with zero data sampling and sub-second cohort analytics.',
        introduction: 'NovaFlow helps modern product organizations pinpoint friction points, retain high-value users, and scale recurring revenue with confidence.',
        benefits: [
          'Sub-second query response across billions of user events',
          'Automated anomaly detection that alerts you before metrics drop',
          '100% GDPR & HIPAA compliant with native data residency options',
          'Zero engineering overhead with one-line SDK initialization',
        ],
        features: [
          'Dynamic Funnel & Path Exploration',
          'Predictive Churn & Retention Cohorts',
          'Cross-Platform Event Synchronization',
          'Granular Role-Based Access Governance',
        ],
        primaryCTA: 'Start Free 14-Day Trial',
        secondaryCTA: 'Explore Interactive Demo',
      },
      about: {
        companyIntroduction: 'NovaFlow was built by veteran engineers and product leaders frustrated by slow, sampled, and opaque legacy analytics tools.',
        brandStory: 'We recognized that modern engineering teams ship faster than ever, but their analytics tools take hours to crunch queries. NovaFlow was born to give builders real-time answers with absolute precision.',
        mission: 'To empower product teams with instant, trustworthy behavioral insights that drive measurable product adoption.',
        vision: 'A world where software teams never have to guess why users drop off or build features in the dark.',
        brandValues: [
          'Uncompromising Precision: Every metric reflects ground truth with zero sampling.',
          'Respect for Privacy: We treat consumer data with military-grade custody standards.',
          'Velocity as a Virtue: Answers should come in milliseconds, not overnight batches.',
          'Customer Obsession: We exist to remove friction from our users everyday workflows.',
        ],
        differentiators: [
          'Patented columnar in-memory calculation engine built from scratch in Rust',
          'Complete audit logging and enterprise SOC-2 Type II certified infrastructure',
          'Transparent predictable pricing with no penalty for metric spikes',
        ],
      },
      services: [
        {
          id: 'srv-1',
          name: 'Core Behavioral Analytics',
          description: 'Deep funnel visualization, retention curves, and path mapping designed for cross-functional product squads.',
          benefits: ['Instant visualization of drop-off points', 'Pinpoint bottlenecks in onboarding workflows'],
          features: ['Unlimited custom properties', 'Retroactive data query indexing', 'Real-time alerting'],
          callToAction: 'View Funnel Features',
        },
        {
          id: 'srv-2',
          name: 'Cohort Intelligence Engine',
          description: 'Automated clustering that isolates your highest-converting user segments and reveals retention drivers.',
          benefits: ['Identify stickiest product features', 'Personalize re-engagement campaigns'],
          features: ['Machine-learning behavioral clusters', 'Export sync to CRM and email tools', 'Segment comparison matrix'],
          callToAction: 'Learn About Cohorts',
        },
        {
          id: 'srv-3',
          name: 'Enterprise Data Mesh Sync',
          description: 'Direct pipeline connectors for Snowflake, BigQuery, and Databricks with bi-directional schema synchronization.',
          benefits: ['Keep your data warehouse as the single source of truth', 'Zero pipeline maintenance burden'],
          features: ['Automated ETL orchestration', 'Airflow & dbt plugin ecosystem', 'End-to-end field encryption'],
          callToAction: 'Discuss Enterprise Architecture',
        },
      ],
      faq: [
        {
          id: 'faq-1',
          category: 'Implementation',
          question: 'How long does NovaFlow take to integrate into our web or mobile app?',
          answer: 'Most development teams complete initialization within 15 minutes. Our lightweight TypeScript and native mobile SDKs require a single configuration call.',
        },
        {
          id: 'faq-2',
          category: 'Data Privacy',
          question: 'Does NovaFlow sample our event stream or throttle data during traffic spikes?',
          answer: 'Never. NovaFlow indexes 100% of captured event streams with zero sampling, guaranteeing exact numbers for financial and engagement audits.',
        },
        {
          id: 'faq-3',
          category: 'Security',
          question: 'What certifications and data residency options are supported?',
          answer: 'We maintain SOC-2 Type II, ISO 27001, and HIPAA compliance. Dedicated cloud regions are available across US, EU, and Asia-Pacific zones.',
        },
        {
          id: 'faq-4',
          category: 'Billing',
          question: 'Can we test NovaFlow in staging environments prior to production rollout?',
          answer: 'Yes. Every trial includes full access to sandbox environments with unlimited test events and synthetic data generation tools.',
        },
      ],
      seo: {
        seoTitle: 'NovaFlow | Real-Time Product Analytics & Funnel Platform',
        metaDescription: 'Discover friction in your product funnels with zero data sampling. NovaFlow gives growth and product teams instant behavioral cohort clarity.',
        urlSlug: 'product-analytics-platform',
        primaryKeyword: 'product analytics platform',
        secondaryKeywords: [
          'user journey analytics',
          'conversion funnel automation',
          'cohort retention software',
          'real-time event analytics',
        ],
        ogTitle: 'NovaFlow | Zero-Sampling Product Analytics for High-Growth Teams',
        ogDescription: 'Pinpoint user drop-offs and optimize product retention with sub-second funnel computation.',
        suggestedImageAltText: 'NovaFlow real-time product dashboard showing behavioral funnels and cohort retention matrix.',
      },
    },
  },
];

export function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleProjects));
      return sampleProjects;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return sampleProjects;
  } catch (err) {
    console.error('Error reading projects from storage:', err);
    return sampleProjects;
  }
}

export function saveAllProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to persist projects to localStorage:', err);
  }
}

export function saveSingleProject(updatedProject: Project): void {
  const current = getStoredProjects();
  const index = current.findIndex((p) => p.id === updatedProject.id);
  const toSave: Project = {
    ...updatedProject,
    lastModified: Date.now(),
  };

  let nextProjects: Project[];
  if (index >= 0) {
    nextProjects = [...current];
    nextProjects[index] = toSave;
  } else {
    nextProjects = [toSave, ...current];
  }
  saveAllProjects(nextProjects);
}

export function deleteStoredProject(id: string): Project[] {
  const current = getStoredProjects();
  const filtered = current.filter((p) => p.id !== id);
  saveAllProjects(filtered);
  return filtered;
}

export function duplicateStoredProject(id: string): Project | null {
  const current = getStoredProjects();
  const source = current.find((p) => p.id === id);
  if (!source) return null;

  const duplicated: Project = {
    ...source,
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    projectName: `${source.projectName} (Copy)`,
    createdAt: Date.now(),
    lastModified: Date.now(),
    content: source.content ? JSON.parse(JSON.stringify(source.content)) : null,
    styling: { ...source.styling },
  };

  const updated = [duplicated, ...current];
  saveAllProjects(updated);
  return duplicated;
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_KEY);
}

export function setActiveProjectId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
}

export function exportProjectJSON(project: Project): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(project, null, 2)
  )}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const safeName = project.projectName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
  downloadAnchor.setAttribute('download', `${safeName}_copycraft_export.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseAndValidateProjectJSON(rawJson: string): Project {
  const parsed = JSON.parse(rawJson);
  if (!parsed.projectName || !parsed.businessName) {
    throw new Error('Invalid project file: missing projectName or businessName.');
  }

  return {
    id: `imported-${Date.now()}`,
    projectName: parsed.projectName || 'Imported Project',
    businessName: parsed.businessName || 'Business Name',
    industry: parsed.industry || '',
    businessDescription: parsed.businessDescription || '',
    targetAudience: parsed.targetAudience || '',
    productsAndServices: parsed.productsAndServices || '',
    usp: parsed.usp || '',
    brandMission: parsed.brandMission || '',
    brandValues: parsed.brandValues || '',
    tone: parsed.tone || 'Professional',
    primaryConversionGoal: parsed.primaryConversionGoal || '',
    ctaPreference: parsed.ctaPreference || '',
    primaryKeyword: parsed.primaryKeyword || '',
    secondaryKeywords: parsed.secondaryKeywords || '',
    preferredLanguage: parsed.preferredLanguage || 'English',
    websiteStyle: parsed.websiteStyle || 'Modern',
    createdAt: Date.now(),
    lastModified: Date.now(),
    styling: parsed.styling || defaultStyling,
    content: parsed.content || null,
  };
}
