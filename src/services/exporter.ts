import JSZip from 'jszip';
import { Project, ProjectContent, ProjectStyling } from '../types';

function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPaletteCSS(palette: ProjectStyling['colorPalette'], isDark: boolean) {
  switch (palette) {
    case 'emerald-sage':
      return {
        primary: '#059669',
        primaryHover: '#047857',
        primaryLight: isDark ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5',
        primaryText: '#ffffff',
        accent: '#10b981',
        bg: isDark ? '#064e3b' : '#f0fdf4',
        surface: isDark ? '#065f46' : '#ffffff',
        text: isDark ? '#f0fdf4' : '#064e3b',
        muted: isDark ? '#a7f3d0' : '#4b7c65',
        border: isDark ? '#047857' : '#d1fae5',
      };
    case 'noir-amber':
      return {
        primary: '#d97706',
        primaryHover: '#b45309',
        primaryLight: isDark ? 'rgba(217, 119, 6, 0.2)' : '#fef3c7',
        primaryText: '#ffffff',
        accent: '#f59e0b',
        bg: isDark ? '#18181b' : '#fafaf9',
        surface: isDark ? '#27272a' : '#ffffff',
        text: isDark ? '#f4f4f5' : '#1c1917',
        muted: isDark ? '#a1a1aa' : '#78716c',
        border: isDark ? '#3f3f46' : '#e7e5e4',
      };
    case 'navy-sky':
      return {
        primary: '#0284c7',
        primaryHover: '#0369a1',
        primaryLight: isDark ? 'rgba(2, 132, 199, 0.2)' : '#f0f9ff',
        primaryText: '#ffffff',
        accent: '#38bdf8',
        bg: isDark ? '#0f172a' : '#f8fafc',
        surface: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f8fafc' : '#0f172a',
        muted: isDark ? '#94a3b8' : '#64748b',
        border: isDark ? '#334155' : '#e2e8f0',
      };
    case 'crimson-stone':
      return {
        primary: '#e11d48',
        primaryHover: '#be123c',
        primaryLight: isDark ? 'rgba(225, 29, 72, 0.2)' : '#fff1f2',
        primaryText: '#ffffff',
        accent: '#f43f5e',
        bg: isDark ? '#1c1917' : '#fafaf9',
        surface: isDark ? '#292524' : '#ffffff',
        text: isDark ? '#fafaf9' : '#1c1917',
        muted: isDark ? '#a8a29e' : '#78716c',
        border: isDark ? '#44403c' : '#e7e5e4',
      };
    case 'slate-indigo':
    default:
      return {
        primary: '#4f46e5',
        primaryHover: '#4338ca',
        primaryLight: isDark ? 'rgba(79, 70, 229, 0.2)' : '#eef2ff',
        primaryText: '#ffffff',
        accent: '#6366f1',
        bg: isDark ? '#0f172a' : '#f8fafc',
        surface: isDark ? '#1e293b' : '#ffffff',
        text: isDark ? '#f8fafc' : '#0f172a',
        muted: isDark ? '#94a3b8' : '#64748b',
        border: isDark ? '#334155' : '#e2e8f0',
      };
  }
}

function getFontFamily(fontPairing: ProjectStyling['fontPairing']) {
  switch (fontPairing) {
    case 'editorial':
      return {
        display: "'Fraunces', serif",
        body: "'Manrope', sans-serif",
        googleImport: '@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Manrope:wght@400..600&display=swap");',
      };
    case 'bold':
      return {
        display: "'Plus Jakarta Sans', sans-serif",
        body: "'Plus Jakarta Sans', sans-serif",
        googleImport: '@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap");',
      };
    case 'clean':
      return {
        display: "'DM Sans', sans-serif",
        body: "'Manrope', sans-serif",
        googleImport: '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&family=Manrope:wght@400;500;600&display=swap");',
      };
    case 'modern':
    default:
      return {
        display: "'Plus Jakarta Sans', sans-serif",
        body: "'DM Sans', sans-serif",
        googleImport: '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap");',
      };
  }
}

function getButtonRadius(buttonStyle: ProjectStyling['buttonStyle']): string {
  switch (buttonStyle) {
    case 'pill':
      return '9999px';
    case 'sharp':
      return '0px';
    case 'rounded':
    default:
      return '8px';
  }
}

export function generateCSS(styling: ProjectStyling): string {
  const isDark = styling.themeMode === 'dark';
  const c = getPaletteCSS(styling.colorPalette, isDark);
  const f = getFontFamily(styling.fontPairing);
  const btnRadius = getButtonRadius(styling.buttonStyle);

  return `/* CopyCraft AI Generated Website Styles */
${f.googleImport}

:root {
  --font-display: ${f.display};
  --font-body: ${f.body};
  --color-primary: ${c.primary};
  --color-primary-hover: ${c.primaryHover};
  --color-primary-light: ${c.primaryLight};
  --color-primary-text: ${c.primaryText};
  --color-accent: ${c.accent};
  --color-bg: ${c.bg};
  --color-surface: ${c.surface};
  --color-text: ${c.text};
  --color-muted: ${c.muted};
  --color-border: ${c.border};
  --btn-radius: ${btnRadius};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6, .brand-logo {
  font-family: var(--font-display);
  color: var(--color-text);
  line-height: 1.2;
  font-weight: 700;
}

a {
  color: inherit;
  text-decoration: none;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header & Navigation */
.site-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.brand-logo {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-muted);
  transition: color 0.15s ease;
  position: relative;
  padding: 0.25rem 0;
}

.nav-link:hover, .nav-link.active {
  color: var(--color-text);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text);
  cursor: pointer;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  text-align: center;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.btn-lg {
  padding: 0.95rem 2rem;
  font-size: 1.05rem;
}

/* Hero Section */
.hero {
  padding: 5rem 0 4rem;
  text-align: center;
}

.hero h1 {
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  letter-spacing: -0.03em;
  max-width: 860px;
  margin: 0 auto 1.5rem;
}

.hero-subheadline {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: var(--color-muted);
  max-width: 720px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Intro Banner */
.intro-banner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 3rem;
  margin: 2rem auto;
  text-align: center;
  max-width: 900px;
}

.intro-banner p {
  font-size: 1.2rem;
  color: var(--color-text);
  line-height: 1.7;
}

/* Grid Sections */
.section-padding {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.section-header p {
  font-size: 1.05rem;
  color: var(--color-muted);
  max-width: 600px;
  margin: 0 auto;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2.5rem;
}

/* Cards */
.feature-card, .service-card, .value-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2.25rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.feature-card:hover, .service-card:hover, .value-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.card-desc {
  color: var(--color-muted);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.bullet-list {
  list-style: none;
  margin-bottom: 1.5rem;
}

.bullet-list li {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bullet-list li::before {
  content: '✓';
  color: var(--color-primary);
  font-weight: bold;
}

/* FAQ Accordion */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.5rem;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-chevron {
  transition: transform 0.2s ease;
  font-size: 1.2rem;
  color: var(--color-muted);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out;
  padding: 0 1.5rem;
  color: var(--color-muted);
  font-size: 0.98rem;
  line-height: 1.7;
}

.faq-item.open .faq-answer {
  max-height: 400px;
  padding-bottom: 1.5rem;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
}

/* Call to Action Banner */
.cta-banner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  margin: 4rem auto;
}

.cta-banner h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}

.cta-banner p {
  color: var(--color-muted);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Footer */
.site-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 4rem 0 2rem;
  margin-top: 5rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  color: var(--color-muted);
  font-size: 0.85rem;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
    align-items: flex-start;
  }

  .nav-links.open {
    display: flex;
  }

  .mobile-toggle {
    display: block;
  }

  .nav-cta {
    display: none;
  }

  .hero {
    padding: 3rem 0;
  }

  .intro-banner {
    padding: 1.75rem;
  }
}
`;
}

export function generateScriptJS(): string {
  return `/* CopyCraft AI Generated Interactive Scripts */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle
  var mobileToggle = document.getElementById('mobile-toggle');
  var navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      var isExpanded = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // 2. FAQ Accordion Interaction
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      // Close other open items
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
        }
      });

      if (!isOpen) {
        item.classList.add('open');
      } else {
        item.classList.remove('open');
      }
    });
  });

  // 3. CTA Click Feedback
  var ctaButtons = document.querySelectorAll('a[href="#cta"]');
  ctaButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      alert('Thank you for your interest! In your live production build, link this button to your contact form, booking scheduler, or signup page.');
    });
  });
});
`;
}

function renderHeader(businessName: string, activePage: string, primaryCTA: string): string {
  const pages = [
    { title: 'Home', href: 'index.html', key: 'home' },
    { title: 'About', href: 'about.html', key: 'about' },
    { title: 'Services', href: 'services.html', key: 'services' },
    { title: 'FAQ', href: 'faq.html', key: 'faq' },
  ];

  return `
  <header class="site-header">
    <div class="container nav-row">
      <a href="index.html" class="brand-logo">${escapeHtml(businessName)}</a>
      <button class="mobile-toggle" id="mobile-toggle" aria-label="Toggle navigation menu">☰</button>
      <nav class="nav-links" id="nav-links">
        ${pages
          .map(
            (p) =>
              `<a href="${p.href}" class="nav-link ${p.key === activePage ? 'active' : ''}">${p.title}</a>`
          )
          .join('\n        ')}
      </nav>
      <div class="nav-cta">
        <a href="#cta" class="btn btn-primary">${escapeHtml(primaryCTA || 'Contact Us')}</a>
      </div>
    </div>
  </header>`;
}

function renderFooter(businessName: string, ctaText: string): string {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div>
          <div class="brand-logo" style="margin-bottom: 0.5rem;">${escapeHtml(businessName)}</div>
          <p style="color: var(--color-muted); font-size: 0.9rem;">Modern website copy generated with precision.</p>
        </div>
        <div style="display: flex; gap: 2rem;">
          <a href="index.html" class="nav-link">Home</a>
          <a href="about.html" class="nav-link">About</a>
          <a href="services.html" class="nav-link">Services</a>
          <a href="faq.html" class="nav-link">FAQ</a>
        </div>
        <div>
          <a href="#cta" class="btn btn-primary">${escapeHtml(ctaText || 'Get Started')}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(businessName)}. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

export function generateIndexHtml(project: Project): string {
  const c = project.content!;
  const lang = project.preferredLanguage ? project.preferredLanguage.substring(0, 2).toLowerCase() : 'en';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(c.seo.seoTitle || project.businessName)}</title>
  <meta name="description" content="${escapeHtml(c.seo.metaDescription || project.businessDescription)}">
  <!-- Open Graph / Social Media Meta -->
  <meta property="og:title" content="${escapeHtml(c.seo.ogTitle || c.seo.seoTitle)}">
  <meta property="og:description" content="${escapeHtml(c.seo.ogDescription || c.seo.metaDescription)}">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${renderHeader(project.businessName, 'home', c.home.primaryCTA)}

  <main>
    <!-- Hero Section -->
    <section class="hero container">
      <h1>${escapeHtml(c.home.heroHeadline)}</h1>
      <p class="hero-subheadline">${escapeHtml(c.home.supportingHeadline)}</p>
      <div class="hero-actions">
        <a href="#cta" class="btn btn-primary btn-lg">${escapeHtml(c.home.primaryCTA)}</a>
        <a href="services.html" class="btn btn-secondary btn-lg">${escapeHtml(c.home.secondaryCTA || 'Learn More')}</a>
      </div>
    </section>

    <!-- Intro Banner -->
    <div class="container">
      <div class="intro-banner">
        <p>${escapeHtml(c.home.introduction)}</p>
      </div>
    </div>

    <!-- Core Benefits -->
    <section class="section-padding container">
      <div class="section-header">
        <h2>Key Advantages</h2>
        <p>Why clients trust ${escapeHtml(project.businessName)} to deliver results.</p>
      </div>
      <div class="grid-3">
        ${(c.home.benefits || [])
          .map(
            (b) => `
        <div class="feature-card">
          <div class="card-title">✨ Benefit</div>
          <p class="card-desc">${escapeHtml(b)}</p>
        </div>`
          )
          .join('\n')}
      </div>
    </section>

    <!-- Core Capabilities -->
    <section class="section-padding" style="background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
      <div class="container">
        <div class="section-header">
          <h2>Core Features</h2>
          <p>Engineered to solve your most pressing challenges.</p>
        </div>
        <div class="grid-2">
          ${(c.home.features || [])
            .map(
              (f) => `
          <div class="feature-card" style="background: var(--color-bg);">
            <div class="card-title">${escapeHtml(f)}</div>
            <p class="card-desc">Reliable, tailored execution aligned directly with client objectives.</p>
          </div>`
            )
            .join('\n')}
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <div class="container">
      <section class="cta-banner" id="cta">
        <h2>Ready to transform your outcomes?</h2>
        <p>Partner with ${escapeHtml(project.businessName)} today and experience the difference.</p>
        <a href="#cta" class="btn btn-primary btn-lg">${escapeHtml(c.home.primaryCTA)}</a>
      </section>
    </div>
  </main>

  ${renderFooter(project.businessName, c.home.primaryCTA)}
  <script src="script.js"></script>
</body>
</html>`;
}

export function generateAboutHtml(project: Project): string {
  const c = project.content!;
  const lang = project.preferredLanguage ? project.preferredLanguage.substring(0, 2).toLowerCase() : 'en';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Us | ${escapeHtml(project.businessName)}</title>
  <meta name="description" content="${escapeHtml(c.about.companyIntroduction || c.seo.metaDescription)}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${renderHeader(project.businessName, 'about', c.home.primaryCTA)}

  <main class="container">
    <section class="hero">
      <h1>About ${escapeHtml(project.businessName)}</h1>
      <p class="hero-subheadline">${escapeHtml(c.about.companyIntroduction)}</p>
    </section>

    <!-- Brand Story & Mission -->
    <section class="section-padding">
      <div class="grid-2">
        <div class="feature-card">
          <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Our Origin & Story</h2>
          <p class="card-desc" style="font-size: 1.05rem; line-height: 1.8;">${escapeHtml(c.about.brandStory)}</p>
        </div>
        <div class="feature-card">
          <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Mission & Vision</h2>
          <div style="margin-bottom: 1.5rem;">
            <strong style="color: var(--color-primary); font-size: 0.9rem; text-transform: uppercase;">Mission</strong>
            <p class="card-desc" style="margin-top: 0.25rem;">${escapeHtml(c.about.mission)}</p>
          </div>
          <div>
            <strong style="color: var(--color-primary); font-size: 0.9rem; text-transform: uppercase;">Vision</strong>
            <p class="card-desc" style="margin-top: 0.25rem;">${escapeHtml(c.about.vision)}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values -->
    <section class="section-padding">
      <div class="section-header">
        <h2>Our Core Values</h2>
        <p>The foundational principles guiding every decision we make.</p>
      </div>
      <div class="grid-2">
        ${(c.about.brandValues || [])
          .map(
            (v) => `
        <div class="value-card">
          <h3 class="card-title">💎 Principle</h3>
          <p class="card-desc">${escapeHtml(v)}</p>
        </div>`
          )
          .join('\n')}
      </div>
    </section>

    <!-- Differentiators -->
    <section class="section-padding">
      <div class="section-header">
        <h2>What Sets Us Apart</h2>
        <p>Why industry leaders choose us over the competition.</p>
      </div>
      <div class="grid-3">
        ${(c.about.differentiators || [])
          .map(
            (d) => `
        <div class="feature-card">
          <h3 class="card-title">⚡ Advantage</h3>
          <p class="card-desc">${escapeHtml(d)}</p>
        </div>`
          )
          .join('\n')}
      </div>
    </section>
  </main>

  ${renderFooter(project.businessName, c.home.primaryCTA)}
  <script src="script.js"></script>
</body>
</html>`;
}

export function generateServicesHtml(project: Project): string {
  const c = project.content!;
  const lang = project.preferredLanguage ? project.preferredLanguage.substring(0, 2).toLowerCase() : 'en';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services & Solutions | ${escapeHtml(project.businessName)}</title>
  <meta name="description" content="Explore solutions and services offered by ${escapeHtml(project.businessName)}.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${renderHeader(project.businessName, 'services', c.home.primaryCTA)}

  <main class="container">
    <section class="hero">
      <h1>Our Services & Solutions</h1>
      <p class="hero-subheadline">Tailored programs and capabilities engineered for sustainable growth.</p>
    </section>

    <section class="section-padding">
      <div class="grid-2">
        ${(c.services || [])
          .map(
            (s) => `
        <div class="service-card">
          <h2 class="card-title" style="font-size: 1.6rem;">${escapeHtml(s.name)}</h2>
          <p class="card-desc">${escapeHtml(s.description)}</p>

          ${
            s.benefits && s.benefits.length > 0
              ? `
          <div style="margin-bottom: 1.25rem;">
            <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--color-muted);">Benefits:</strong>
            <ul class="bullet-list" style="margin-top: 0.5rem;">
              ${s.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          </div>`
              : ''
          }

          ${
            s.features && s.features.length > 0
              ? `
          <div style="margin-bottom: 1.5rem;">
            <strong style="font-size: 0.85rem; text-transform: uppercase; color: var(--color-muted);">Deliverables:</strong>
            <ul class="bullet-list" style="margin-top: 0.5rem;">
              ${s.features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
          </div>`
              : ''
          }

          <a href="#cta" class="btn btn-primary" style="width: 100%;">${escapeHtml(s.callToAction || 'Get Started')}</a>
        </div>`
          )
          .join('\n')}
      </div>
    </section>

    <section class="cta-banner" id="cta">
      <h2>Have unique requirements?</h2>
      <p>We tailor bespoke engagements to match your organizational goals.</p>
      <a href="#cta" class="btn btn-primary btn-lg">${escapeHtml(c.home.primaryCTA || 'Schedule a Discussion')}</a>
    </section>
  </main>

  ${renderFooter(project.businessName, c.home.primaryCTA)}
  <script src="script.js"></script>
</body>
</html>`;
}

export function generateFAQHtml(project: Project): string {
  const c = project.content!;
  const lang = project.preferredLanguage ? project.preferredLanguage.substring(0, 2).toLowerCase() : 'en';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frequently Asked Questions | ${escapeHtml(project.businessName)}</title>
  <meta name="description" content="Common questions and answers regarding ${escapeHtml(project.businessName)}.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${renderHeader(project.businessName, 'faq', c.home.primaryCTA)}

  <main class="container">
    <section class="hero">
      <h1>Frequently Asked Questions</h1>
      <p class="hero-subheadline">Everything you need to know about partnering with ${escapeHtml(project.businessName)}.</p>
    </section>

    <section class="section-padding">
      <div class="faq-list">
        ${(c.faq || [])
          .map(
            (item, index) => `
        <div class="faq-item ${index === 0 ? 'open' : ''}">
          <button class="faq-question" type="button">
            <span>${escapeHtml(item.question)}</span>
            <span class="faq-chevron">▼</span>
          </button>
          <div class="faq-answer">
            <p>${escapeHtml(item.answer)}</p>
          </div>
        </div>`
          )
          .join('\n')}
      </div>
    </section>

    <section class="cta-banner" id="cta">
      <h2>Still have questions?</h2>
      <p>Our team is here to assist you with any questions or clarifications.</p>
      <a href="#cta" class="btn btn-primary btn-lg">${escapeHtml(c.home.primaryCTA || 'Contact Support')}</a>
    </section>
  </main>

  ${renderFooter(project.businessName, c.home.primaryCTA)}
  <script src="script.js"></script>
</body>
</html>`;
}

export function generateReadmeMD(project: Project): string {
  return `# ${project.businessName} Website Export

This package was generated by **CopyCraft AI**.
It contains a fully standalone, responsive, modern static website ready to be published or edited.

## 📁 Directory Structure
\`\`\`text
website-export/
├── index.html        # Home Page with Hero, Benefits, Features, and Call to Action
├── about.html        # About Page with Story, Mission, Vision, and Values
├── services.html     # Services Page with Packages, Deliverables, and CTAs
├── faq.html          # Interactive FAQ Accordion Page
├── styles.css        # Responsive stylesheet with custom color palette and typography
├── script.js         # Interactive navigation and FAQ accordion script
├── content.json      # Structured JSON data of all generated website copy
├── metadata.json     # Project configuration, tone, and export timestamp
└── README.md         # Deployment and usage instructions
\`\`\`

## 🚀 How to Preview Locally
1. Extract the ZIP file.
2. Double-click \`index.html\` to open it directly in any modern browser (Chrome, Safari, Firefox, Edge).
3. No local build server, Node.js, or external software is required!

## 🌐 How to Host on the Web
You can deploy this static site in under 60 seconds using free static hosting platforms:

### 1. Netlify
- Drag and drop this extracted folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- Your site is immediately live with HTTPS!

### 2. Vercel
- Run \`npx vercel\` inside this folder, or push to GitHub and import it on Vercel.

### 3. GitHub Pages
- Create a new repository on GitHub.
- Push the files to the \`main\` branch.
- In Settings > Pages, select \`main\` branch and root directory.

## ✍️ Customizing Copy
All textual copy is also saved in \`content.json\` for programmatic integration with headless CMSs or frameworks like Next.js, Astro, or Hugo.
`;
}

export async function exportToZip(project: Project): Promise<void> {
  if (!project.content) {
    throw new Error('Cannot export project: Website copy has not been generated yet.');
  }

  const zip = new JSZip();

  // 1. Generate files
  const indexHtml = generateIndexHtml(project);
  const aboutHtml = generateAboutHtml(project);
  const servicesHtml = generateServicesHtml(project);
  const faqHtml = generateFAQHtml(project);
  const stylesCss = generateCSS(project.styling);
  const scriptJs = generateScriptJS();
  const contentJson = JSON.stringify(project.content, null, 2);
  const metadataJson = JSON.stringify(
    {
      appName: 'CopyCraft AI',
      exportDate: new Date().toISOString(),
      project: {
        id: project.id,
        name: project.projectName,
        businessName: project.businessName,
        industry: project.industry,
        tone: project.tone,
        styling: project.styling,
      },
    },
    null,
    2
  );
  const readmeMd = generateReadmeMD(project);

  // 2. Validate all files exist before zipping
  const files: Record<string, string> = {
    'index.html': indexHtml,
    'about.html': aboutHtml,
    'services.html': servicesHtml,
    'faq.html': faqHtml,
    'styles.css': stylesCss,
    'script.js': scriptJs,
    'content.json': contentJson,
    'metadata.json': metadataJson,
    'README.md': readmeMd,
  };

  for (const [filename, content] of Object.entries(files)) {
    if (!content || content.trim().length === 0) {
      throw new Error(`Export verification failed: ${filename} is empty.`);
    }
    zip.file(filename, content);
  }

  // 3. Generate blob and trigger browser download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const safeName = (project.businessName || project.projectName || 'website')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_');

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${safeName}_website_export.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
