import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Type,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Check,
} from 'lucide-react';
import {
  Project,
  FontPairing,
  ColorPalette,
  ButtonStyle,
  ThemeMode,
  ProjectStyling,
} from '../../types';

interface WebsitePreviewProps {
  project: Project;
  onUpdateStyling: (newStyling: ProjectStyling) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  project,
  onUpdateStyling,
  onShowToast,
}) => {
  const content = project.content;
  const styling = project.styling;

  const [activePage, setActivePage] = useState<'home' | 'about' | 'services' | 'faq'>('home');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!content) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto my-12 space-y-3">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">No content to preview yet</h3>
        <p className="text-xs text-slate-400">
          Generate website copy in the Editor to view your live interactive website.
        </p>
      </div>
    );
  }

  // Device width styles
  const getContainerWidth = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-[1140px]';
    }
  };

  // Dynamic theme colors
  const isDark = styling.themeMode === 'dark';

  const getColorClasses = () => {
    switch (styling.colorPalette) {
      case 'emerald-sage':
        return {
          primaryBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          primaryText: 'text-emerald-600 dark:text-emerald-400',
          primaryBorder: 'border-emerald-600',
          accentBg: isDark ? 'bg-emerald-950/40' : 'bg-emerald-50',
          cardBorder: isDark ? 'border-emerald-900/40' : 'border-emerald-100',
        };
      case 'noir-amber':
        return {
          primaryBg: 'bg-amber-600 hover:bg-amber-700 text-white',
          primaryText: 'text-amber-600 dark:text-amber-400',
          primaryBorder: 'border-amber-600',
          accentBg: isDark ? 'bg-amber-950/40' : 'bg-amber-50',
          cardBorder: isDark ? 'border-amber-900/40' : 'border-amber-100',
        };
      case 'navy-sky':
        return {
          primaryBg: 'bg-sky-600 hover:bg-sky-700 text-white',
          primaryText: 'text-sky-600 dark:text-sky-400',
          primaryBorder: 'border-sky-600',
          accentBg: isDark ? 'bg-sky-950/40' : 'bg-sky-50',
          cardBorder: isDark ? 'border-sky-900/40' : 'border-sky-100',
        };
      case 'crimson-stone':
        return {
          primaryBg: 'bg-rose-600 hover:bg-rose-700 text-white',
          primaryText: 'text-rose-600 dark:text-rose-400',
          primaryBorder: 'border-rose-600',
          accentBg: isDark ? 'bg-rose-950/40' : 'bg-rose-50',
          cardBorder: isDark ? 'border-rose-900/40' : 'border-rose-100',
        };
      case 'slate-indigo':
      default:
        return {
          primaryBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          primaryText: 'text-indigo-600 dark:text-indigo-400',
          primaryBorder: 'border-indigo-600',
          accentBg: isDark ? 'bg-indigo-950/40' : 'bg-indigo-50',
          cardBorder: isDark ? 'border-indigo-900/40' : 'border-indigo-100',
        };
    }
  };

  const colors = getColorClasses();

  const getFontFamilyStyle = () => {
    switch (styling.fontPairing) {
      case 'editorial':
        return { fontFamily: "'Fraunces', serif" };
      case 'bold':
        return { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 };
      case 'clean':
        return { fontFamily: "'DM Sans', sans-serif" };
      case 'modern':
      default:
        return { fontFamily: "'Plus Jakarta Sans', sans-serif" };
    }
  };

  const getButtonRadiusClass = () => {
    switch (styling.buttonStyle) {
      case 'pill':
        return 'rounded-full';
      case 'sharp':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  const btnRadius = getButtonRadiusClass();

  const handleCTAClick = (label: string) => {
    onShowToast(`Interactive CTA Triggered: "${label}"`, 'info');
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Top Preview Control Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Viewport device toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'desktop'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop view (1140px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'tablet'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              deviceView === 'mobile'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile view (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Page Switcher in Preview */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['home', 'about', 'services', 'faq'] as const).map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                activePage === page
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Style Customizer Toggle & Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStylePanel(!showStylePanel)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
              showStylePanel
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Style</span>
          </button>

          <button
            onClick={() => {
              setRefreshKey((k) => k + 1);
              onShowToast('Refreshed website preview', 'info');
            }}
            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-colors"
            title="Refresh preview state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable Style Customizer Panel */}
      {showStylePanel && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn shadow-md">
          {/* Font Pairing */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-400" /> Typography
            </label>
            <select
              value={styling.fontPairing}
              onChange={(e) =>
                onUpdateStyling({ ...styling, fontPairing: e.target.value as FontPairing })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="modern">Modern Sans (Plus Jakarta + DM Sans)</option>
              <option value="editorial">Editorial Serif (Fraunces + Manrope)</option>
              <option value="bold">Athletic Bold (Plus Jakarta Sans)</option>
              <option value="clean">Clean Minimal (DM Sans + Manrope)</option>
            </select>
          </div>

          {/* Color Palette */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" /> Color Palette
            </label>
            <select
              value={styling.colorPalette}
              onChange={(e) =>
                onUpdateStyling({ ...styling, colorPalette: e.target.value as ColorPalette })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="slate-indigo">Slate & Indigo (Corporate SaaS)</option>
              <option value="emerald-sage">Emerald & Mint (Growth & Eco)</option>
              <option value="noir-amber">Noir & Warm Amber (Luxury & Craft)</option>
              <option value="navy-sky">Navy & Sky (Engineering & Trust)</option>
              <option value="crimson-stone">Crimson & Warm Stone (Bold Impact)</option>
            </select>
          </div>

          {/* Button Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Button Curvature</label>
            <select
              value={styling.buttonStyle}
              onChange={(e) =>
                onUpdateStyling({ ...styling, buttonStyle: e.target.value as ButtonStyle })
              }
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="rounded">Rounded Corners (8px)</option>
              <option value="pill">Pill Shape (Full Round)</option>
              <option value="sharp">Sharp Rectangular (0px)</option>
            </select>
          </div>

          {/* Light / Dark Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Theme Surface</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateStyling({ ...styling, themeMode: 'light' })}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  styling.themeMode === 'light'
                    ? 'bg-white text-slate-900 border-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => onUpdateStyling({ ...styling, themeMode: 'dark' })}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  styling.themeMode === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Realistic Browser Frame */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-3 sm:p-5 shadow-2xl flex justify-center overflow-x-auto min-h-[700px]">
        <div
          key={refreshKey}
          className={`w-full ${getContainerWidth()} rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
          style={{
            minHeight: deviceView === 'mobile' ? '680px' : '650px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          }}
        >
          {/* Mock Browser Header / URL bar */}
          <div
            className={`px-4 py-2.5 flex items-center justify-between border-b text-xs ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div
              className={`px-4 py-0.5 rounded-md text-[11px] font-mono border max-w-sm truncate ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              https://{project.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/{activePage === 'home' ? '' : activePage}
            </div>

            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              {activePage}
            </div>
          </div>

          {/* Website Header */}
          <header
            className={`px-6 py-4 border-b flex items-center justify-between sticky top-0 z-30 ${
              isDark ? 'bg-slate-950/95 border-slate-800/80 backdrop-blur' : 'bg-white/95 border-slate-100 backdrop-blur'
            }`}
          >
            <button
              onClick={() => setActivePage('home')}
              className="text-lg font-bold tracking-tight text-left"
              style={getFontFamilyStyle()}
            >
              {project.businessName}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {(['home', 'about', 'services', 'faq'] as const).map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`capitalize transition-colors ${
                    activePage === page
                      ? `${colors.primaryText} font-semibold underline underline-offset-8`
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleCTAClick(content.home.primaryCTA)}
                className={`px-4 py-2 text-xs font-semibold ${colors.primaryBg} ${btnRadius} transition-all shadow-sm`}
              >
                {content.home.primaryCTA || 'Get Started'}
              </button>
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden px-6 py-4 border-b space-y-3 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {(['home', 'about', 'services', 'faq'] as const).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setActivePage(page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left text-sm font-medium capitalize py-1.5 ${
                    activePage === page ? colors.primaryText : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => {
                  handleCTAClick(content.home.primaryCTA);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 text-xs font-semibold ${colors.primaryBg} ${btnRadius}`}
              >
                {content.home.primaryCTA}
              </button>
            </div>
          )}

          {/* Website Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* 1. HOME PAGE VIEW */}
            {activePage === 'home' && (
              <div>
                {/* Hero */}
                <section className={`py-16 md:py-24 px-6 md:px-12 text-center ${colors.accentBg}`}>
                  <div className="max-w-3xl mx-auto space-y-6">
                    <h1
                      className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
                      style={getFontFamilyStyle()}
                    >
                      {content.home.heroHeadline}
                    </h1>
                    <p
                      className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {content.home.supportingHeadline}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => handleCTAClick(content.home.primaryCTA)}
                        className={`px-6 py-3 text-sm font-semibold ${colors.primaryBg} ${btnRadius} shadow-lg transition-transform hover:-translate-y-0.5`}
                      >
                        {content.home.primaryCTA}
                      </button>
                      <button
                        onClick={() => setActivePage('services')}
                        className={`px-6 py-3 text-sm font-semibold border ${colors.cardBorder} ${btnRadius} transition-colors ${
                          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                        }`}
                      >
                        {content.home.secondaryCTA || 'Explore Services'}
                      </button>
                    </div>
                  </div>
                </section>

                {/* Introduction statement */}
                <section className="py-12 px-6 max-w-4xl mx-auto text-center">
                  <div
                    className={`p-8 rounded-2xl border ${colors.cardBorder} ${
                      isDark ? 'bg-slate-900/60' : 'bg-slate-50'
                    }`}
                  >
                    <p className="text-base md:text-lg leading-relaxed font-medium">
                      "{content.home.introduction}"
                    </p>
                  </div>
                </section>

                {/* Benefits */}
                <section className="py-12 px-6 max-w-5xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight" style={getFontFamilyStyle()}>
                      Key Benefits
                    </h2>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Engineered for high performance and measurable value.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.home.benefits.map((b, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-xl border ${colors.cardBorder} flex items-start gap-3.5 ${
                          isDark ? 'bg-slate-900/40' : 'bg-white'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colors.primaryBg}`}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{b}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Features */}
                <section
                  className={`py-12 px-6 ${
                    isDark ? 'bg-slate-900/30' : 'bg-slate-50/70'
                  } border-t border-b ${colors.cardBorder}`}
                >
                  <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold tracking-tight" style={getFontFamilyStyle()}>
                        Core Capabilities
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {content.home.features.map((f, i) => (
                        <div
                          key={i}
                          className={`p-5 rounded-xl border ${colors.cardBorder} ${
                            isDark ? 'bg-slate-950' : 'bg-white'
                          }`}
                        >
                          <h4 className="text-sm font-bold">{f}</h4>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            Built to rigorous engineering and quality standards for mission-critical operations.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* 2. ABOUT PAGE VIEW */}
            {activePage === 'about' && (
              <div className="py-12 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold" style={getFontFamilyStyle()}>
                    About {project.businessName}
                  </h1>
                  <p className={`text-base max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {content.about.companyIntroduction}
                  </p>
                </div>

                <div className={`p-8 rounded-2xl border ${colors.cardBorder} ${isDark ? 'bg-slate-900/40' : 'bg-slate-50'} space-y-4`}>
                  <h2 className="text-xl font-bold" style={getFontFamilyStyle()}>Our Origin Story</h2>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {content.about.brandStory}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-2xl border ${colors.cardBorder} ${isDark ? 'bg-slate-900/30' : 'bg-white'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${colors.primaryText}`}>Mission</span>
                    <p className="text-sm font-medium mt-2 leading-relaxed">{content.about.mission}</p>
                  </div>
                  <div className={`p-6 rounded-2xl border ${colors.cardBorder} ${isDark ? 'bg-slate-900/30' : 'bg-white'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${colors.primaryText}`}>Vision</span>
                    <p className="text-sm font-medium mt-2 leading-relaxed">{content.about.vision}</p>
                  </div>
                </div>

                {/* Values */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center" style={getFontFamilyStyle()}>Our Core Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {content.about.brandValues.map((v, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${colors.cardBorder} ${isDark ? 'bg-slate-900/40' : 'bg-white'} text-xs leading-relaxed`}
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Differentiators */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-center" style={getFontFamilyStyle()}>What Sets Us Apart</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {content.about.differentiators.map((d, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${colors.cardBorder} ${isDark ? 'bg-slate-900/40' : 'bg-white'} text-xs leading-relaxed`}
                      >
                        ⚡ {d}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. SERVICES PAGE VIEW */}
            {activePage === 'services' && (
              <div className="py-12 px-6 md:px-12 max-w-5xl mx-auto space-y-10">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold" style={getFontFamilyStyle()}>
                    Services & Solutions
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Scalable offerings engineered for measurable business transformation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.services.map((srv, i) => (
                    <div
                      key={srv.id || i}
                      className={`p-6 rounded-2xl border ${colors.cardBorder} flex flex-col justify-between ${
                        isDark ? 'bg-slate-900/40' : 'bg-white'
                      }`}
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold" style={getFontFamilyStyle()}>
                            {srv.name}
                          </h3>
                          <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {srv.description}
                          </p>
                        </div>

                        {srv.benefits && srv.benefits.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Benefits:
                            </span>
                            <ul className="text-xs space-y-1 text-slate-300">
                              {srv.benefits.map((b, bi) => (
                                <li key={bi} className="flex items-center gap-1.5">
                                  <Check className={`w-3 h-3 ${colors.primaryText}`} /> {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {srv.features && srv.features.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Deliverables:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {srv.features.map((f, fi) => (
                                <span
                                  key={fi}
                                  className={`text-[10px] px-2 py-0.5 rounded-md border ${colors.cardBorder} ${
                                    isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleCTAClick(srv.callToAction)}
                        className={`mt-6 w-full py-2.5 text-xs font-semibold ${colors.primaryBg} ${btnRadius}`}
                      >
                        {srv.callToAction || 'Learn More'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. FAQ PAGE VIEW */}
            {activePage === 'faq' && (
              <div className="py-12 px-6 md:px-12 max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold" style={getFontFamilyStyle()}>
                    Frequently Asked Questions
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Everything you need to know about partnering with {project.businessName}.
                  </p>
                </div>

                <div className="space-y-3">
                  {content.faq.map((item, idx) => {
                    const isOpen = expandedFaqIndex === idx;
                    return (
                      <div
                        key={item.id || idx}
                        className={`rounded-xl border transition-all overflow-hidden ${colors.cardBorder} ${
                          isDark ? 'bg-slate-900/40' : 'bg-white'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-semibold text-sm flex items-center justify-between gap-3"
                          style={getFontFamilyStyle()}
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div
                            className={`p-4 pt-0 text-xs leading-relaxed border-t border-slate-800/20 ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Common CTA Banner */}
            <section
              className={`p-8 md:p-12 text-center border-t ${colors.cardBorder} ${
                isDark ? 'bg-slate-900/40' : 'bg-slate-50'
              }`}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={getFontFamilyStyle()}>
                Ready to elevate your outcomes?
              </h3>
              <p className={`text-xs max-w-md mx-auto mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Get in touch with the {project.businessName} team today.
              </p>
              <button
                onClick={() => handleCTAClick(content.home.primaryCTA)}
                className={`px-6 py-2.5 text-xs font-semibold ${colors.primaryBg} ${btnRadius}`}
              >
                {content.home.primaryCTA}
              </button>
            </section>
          </div>

          {/* Website Footer */}
          <footer
            className={`px-6 py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <span>&copy; {new Date().getFullYear()} {project.businessName}. All rights reserved.</span>
            <div className="flex items-center gap-4">
              {(['home', 'about', 'services', 'faq'] as const).map((page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className="capitalize hover:underline"
                >
                  {page}
                </button>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
