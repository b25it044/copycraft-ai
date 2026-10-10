export type Tone = 
  | 'Professional' 
  | 'Friendly' 
  | 'Bold' 
  | 'Luxurious' 
  | 'Minimal' 
  | 'Playful' 
  | 'Persuasive';

export type WebsiteStyle = 
  | 'Modern' 
  | 'Minimal' 
  | 'Corporate' 
  | 'Creative' 
  | 'Elegant';

export type FontPairing = 
  | 'modern'     // Plus Jakarta Sans + DM Sans
  | 'editorial'  // Fraunces + Manrope
  | 'bold'       // Plus Jakarta Sans (Black) + Plus Jakarta Sans
  | 'clean';     // DM Sans + Manrope

export type ColorPalette = 
  | 'slate-indigo' 
  | 'emerald-sage' 
  | 'noir-amber' 
  | 'navy-sky' 
  | 'crimson-stone';

export type ButtonStyle = 
  | 'rounded' 
  | 'pill' 
  | 'sharp';

export type ThemeMode = 
  | 'light' 
  | 'dark';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  features: string[];
  callToAction: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface HomeSection {
  heroHeadline: string;
  supportingHeadline: string;
  introduction: string;
  benefits: string[];
  features: string[];
  primaryCTA: string;
  secondaryCTA: string;
}

export interface AboutSection {
  companyIntroduction: string;
  brandStory: string;
  mission: string;
  vision: string;
  brandValues: string[];
  differentiators: string[];
}

export interface SEOSection {
  seoTitle: string;
  metaDescription: string;
  urlSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  suggestedImageAltText: string;
}

export interface ProjectContent {
  home: HomeSection;
  about: AboutSection;
  services: ServiceItem[];
  faq: FAQItem[];
  seo: SEOSection;
}

export interface ProjectStyling {
  fontPairing: FontPairing;
  colorPalette: ColorPalette;
  buttonStyle: ButtonStyle;
  themeMode: ThemeMode;
}

export interface ProjectFormDetails {
  projectName: string;
  businessName: string;
  industry: string;
  businessDescription: string;
  targetAudience: string;
  productsAndServices: string;
  usp: string;
  brandMission: string;
  brandValues: string;
  tone: Tone;
  primaryConversionGoal: string;
  ctaPreference: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  preferredLanguage: string;
  websiteStyle: WebsiteStyle;
}

export interface Project extends ProjectFormDetails {
  id: string;
  createdAt: number;
  lastModified: number;
  content: ProjectContent | null;
  styling: ProjectStyling;
}

export interface SEOIssue {
  id: string;
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
  field?: string;
}

export interface SEOAnalysisResult {
  score: number;
  issues: SEOIssue[];
  passedChecks: number;
  totalChecks: number;
}
