import { ProjectContent, SEOAnalysisResult, SEOIssue } from '../types';

export function analyzeSEO(content: ProjectContent | null, primaryKeywordFallback?: string): SEOAnalysisResult {
  if (!content) {
    return {
      score: 0,
      issues: [
        {
          id: 'no-content',
          type: 'error',
          title: 'No Content Generated Yet',
          message: 'Generate your website copy to perform SEO and metadata analysis.',
        },
      ],
      passedChecks: 0,
      totalChecks: 8,
    };
  }

  const issues: SEOIssue[] = [];
  let score = 100;
  let passedChecks = 0;
  const totalChecks = 8;

  const seo = content.seo || {
    seoTitle: '',
    metaDescription: '',
    urlSlug: '',
    primaryKeyword: '',
    secondaryKeywords: [],
    ogTitle: '',
    ogDescription: '',
    suggestedImageAltText: '',
  };

  const primaryKeyword = (seo.primaryKeyword || primaryKeywordFallback || '').trim().toLowerCase();
  const title = (seo.seoTitle || '').trim();
  const desc = (seo.metaDescription || '').trim();
  const heroHeadline = (content.home?.heroHeadline || '').toLowerCase();

  // 1. Title Presence & Length (Ideal: 40-60 chars)
  if (!title) {
    score -= 20;
    issues.push({
      id: 'title-missing',
      type: 'error',
      title: 'Missing SEO Title Tag',
      message: 'A concise, keyword-rich title is crucial for search ranking and browser tabs.',
      field: 'seoTitle',
    });
  } else if (title.length < 30) {
    score -= 10;
    issues.push({
      id: 'title-short',
      type: 'warning',
      title: `SEO Title is Too Short (${title.length} chars)`,
      message: 'Aim for 40–60 characters to maximize search engine snippet real estate.',
      field: 'seoTitle',
    });
  } else if (title.length > 65) {
    score -= 8;
    issues.push({
      id: 'title-long',
      type: 'warning',
      title: `SEO Title May Truncate (${title.length} chars)`,
      message: 'Titles above 60–65 characters risk getting cut off by Google on mobile screens.',
      field: 'seoTitle',
    });
  } else {
    passedChecks++;
    issues.push({
      id: 'title-optimal',
      type: 'success',
      title: `Optimal Title Length (${title.length} chars)`,
      message: 'Title fits comfortably within standard search result pixel containers.',
      field: 'seoTitle',
    });
  }

  // 2. Meta Description Presence & Length (Ideal: 120-160 chars)
  if (!desc) {
    score -= 20;
    issues.push({
      id: 'desc-missing',
      type: 'error',
      title: 'Missing Meta Description',
      message: 'Search engines display this snippet under your link. Without it, click-through rates suffer.',
      field: 'metaDescription',
    });
  } else if (desc.length < 70) {
    score -= 12;
    issues.push({
      id: 'desc-short',
      type: 'warning',
      title: `Meta Description Too Short (${desc.length} chars)`,
      message: 'Expand to 125–155 characters to give searchers a clear reason to click.',
      field: 'metaDescription',
    });
  } else if (desc.length > 165) {
    score -= 8;
    issues.push({
      id: 'desc-long',
      type: 'warning',
      title: `Meta Description Exceeds Recommended Limit (${desc.length} chars)`,
      message: 'Descriptions over 160 characters will be truncated on most devices.',
      field: 'metaDescription',
    });
  } else {
    passedChecks++;
    issues.push({
      id: 'desc-optimal',
      type: 'success',
      title: `Optimal Meta Description Length (${desc.length} chars)`,
      message: 'Snippet will render cleanly without premature truncation.',
      field: 'metaDescription',
    });
  }

  // 3. Primary Keyword in Title
  if (primaryKeyword) {
    if (title.toLowerCase().includes(primaryKeyword)) {
      passedChecks++;
      issues.push({
        id: 'kw-in-title',
        type: 'success',
        title: 'Primary Keyword Included in Title',
        message: `"${primaryKeyword}" is strategically located in your title tag.`,
        field: 'seoTitle',
      });
    } else {
      score -= 12;
      issues.push({
        id: 'kw-missing-title',
        type: 'warning',
        title: 'Primary Keyword Missing from Title Tag',
        message: `Include "${primaryKeyword}" towards the beginning of your SEO title for better relevance.`,
        field: 'seoTitle',
      });
    }
  } else {
    score -= 10;
    issues.push({
      id: 'kw-missing',
      type: 'error',
      title: 'No Primary Keyword Specified',
      message: 'Specify your core focus search phrase to guide crawl intent.',
      field: 'primaryKeyword',
    });
  }

  // 4. Primary Keyword in Meta Description
  if (primaryKeyword && desc) {
    if (desc.toLowerCase().includes(primaryKeyword)) {
      passedChecks++;
      issues.push({
        id: 'kw-in-desc',
        type: 'success',
        title: 'Primary Keyword in Meta Description',
        message: `Search engines bold matched terms like "${primaryKeyword}" in snippets.`,
        field: 'metaDescription',
      });
    } else {
      score -= 8;
      issues.push({
        id: 'kw-missing-desc',
        type: 'warning',
        title: 'Primary Keyword Absent from Meta Description',
        message: `Integrate "${primaryKeyword}" naturally into the description snippet.`,
        field: 'metaDescription',
      });
    }
  }

  // 5. Primary Keyword in Hero Headline
  if (primaryKeyword && heroHeadline) {
    if (heroHeadline.includes(primaryKeyword)) {
      passedChecks++;
      issues.push({
        id: 'kw-in-h1',
        type: 'success',
        title: 'Keyword Found in Hero Headline (H1)',
        message: 'On-page heading signals match your metadata signals.',
        field: 'heroHeadline',
      });
    } else {
      score -= 6;
      issues.push({
        id: 'kw-missing-h1',
        type: 'warning',
        title: 'Hero Headline Does Not Match Primary Keyword',
        message: `Consider aligning your Hero Headline with "${primaryKeyword}" to strengthen user topic confirmation.`,
        field: 'heroHeadline',
      });
    }
  }

  // 6. Open Graph Tags
  const ogTitle = (seo.ogTitle || '').trim();
  const ogDesc = (seo.ogDescription || '').trim();
  if (ogTitle && ogDesc) {
    passedChecks++;
    issues.push({
      id: 'og-complete',
      type: 'success',
      title: 'Open Graph Social Sharing Configured',
      message: 'Rich link previews will render properly on LinkedIn, X, and messaging platforms.',
      field: 'ogTitle',
    });
  } else {
    score -= 10;
    issues.push({
      id: 'og-incomplete',
      type: 'warning',
      title: 'Incomplete Social Share (Open Graph) Tags',
      message: 'Fill both OG Title and OG Description to control how links look when shared on social apps.',
      field: 'ogTitle',
    });
  }

  // 7. Image Alt Text
  const altText = (seo.suggestedImageAltText || '').trim();
  if (altText && altText.length >= 10) {
    passedChecks++;
    issues.push({
      id: 'alt-complete',
      type: 'success',
      title: 'Descriptive Hero Image Alt Text Provided',
      message: 'Improves accessibility screen-reader compliance and image search indexing.',
      field: 'suggestedImageAltText',
    });
  } else {
    score -= 6;
    issues.push({
      id: 'alt-short',
      type: 'warning',
      title: 'Missing or Generic Image Alt Text',
      message: 'Provide descriptive alt text for accessibility and Google Image results.',
      field: 'suggestedImageAltText',
    });
  }

  // 8. Content Depth & Structure
  const servicesCount = content.services?.length || 0;
  const faqCount = content.faq?.length || 0;
  if (servicesCount >= 2 && faqCount >= 3) {
    passedChecks++;
    issues.push({
      id: 'depth-good',
      type: 'success',
      title: `Substantial Site Breadth (${servicesCount} Services, ${faqCount} FAQs)`,
      message: 'Ample structured content allows search engines to understand topical authority.',
    });
  } else {
    score -= 8;
    issues.push({
      id: 'depth-thin',
      type: 'warning',
      title: 'Sparse Site Content Depth',
      message: 'Aim for at least 3 distinct services and 4 FAQs to provide robust on-page answers.',
    });
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    issues,
    passedChecks,
    totalChecks,
  };
}
