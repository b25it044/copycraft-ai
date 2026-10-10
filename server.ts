import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Full Website Copy Generation Schema
const fullCopyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    home: {
      type: Type.OBJECT,
      properties: {
        heroHeadline: { type: Type.STRING, description: 'High-converting, captivating hero headline (6-12 words)' },
        supportingHeadline: { type: Type.STRING, description: 'Supporting subheadline expanding on value proposition' },
        introduction: { type: Type.STRING, description: 'Compelling 2-3 sentence overview introducing the brand and core promise' },
        benefits: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-4 core customer benefits focused on positive outcomes',
        },
        features: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-4 tangible capabilities or key offerings',
        },
        primaryCTA: { type: Type.STRING, description: 'Action-oriented primary button text' },
        secondaryCTA: { type: Type.STRING, description: 'Lower friction secondary button text' },
      },
      required: ['heroHeadline', 'supportingHeadline', 'introduction', 'benefits', 'features', 'primaryCTA', 'secondaryCTA'],
    },
    about: {
      type: Type.OBJECT,
      properties: {
        companyIntroduction: { type: Type.STRING, description: 'Clear narrative introducing who the company is and what they stand for' },
        brandStory: { type: Type.STRING, description: 'Engaging origin narrative explaining the purpose behind the business' },
        mission: { type: Type.STRING, description: 'Direct, inspiring company mission statement' },
        vision: { type: Type.STRING, description: 'Forward-looking aspirational vision statement' },
        brandValues: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-4 core organizational values with brief taglines',
        },
        differentiators: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-4 authentic reasons why customers choose this business over alternatives',
        },
      },
      required: ['companyIntroduction', 'brandStory', 'mission', 'vision', 'brandValues', 'differentiators'],
    },
    services: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING, description: 'Service or product package name' },
          description: { type: Type.STRING, description: 'Detailed description of the service' },
          benefits: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 key outcome benefits for the client',
          },
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2-3 specific deliverables or technical features included',
          },
          callToAction: { type: Type.STRING, description: 'Specific CTA button text for this service' },
        },
        required: ['id', 'name', 'description', 'benefits', 'features', 'callToAction'],
      },
      description: '3-4 distinct core services or packages based on user input',
    },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING, description: 'Realistic customer question addressing common hesitations' },
          answer: { type: Type.STRING, description: 'Thorough, helpful, reassuring answer (2-4 sentences)' },
          category: { type: Type.STRING, description: 'Category tag such as Onboarding, Pricing, Process, or Support' },
        },
        required: ['id', 'question', 'answer'],
      },
      description: '4-6 common questions and thorough answers tailored to the business',
    },
    seo: {
      type: Type.OBJECT,
      properties: {
        seoTitle: { type: Type.STRING, description: 'SEO title tag between 50-60 characters incorporating primary keyword' },
        metaDescription: { type: Type.STRING, description: 'Compelling meta description between 130-155 characters with call to action' },
        urlSlug: { type: Type.STRING, description: 'Clean, lowercase hyphenated URL slug' },
        primaryKeyword: { type: Type.STRING, description: 'Target primary search keyword' },
        secondaryKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3-5 semantic secondary search phrases',
        },
        ogTitle: { type: Type.STRING, description: 'Open Graph social sharing headline' },
        ogDescription: { type: Type.STRING, description: 'Open Graph social sharing summary' },
        suggestedImageAltText: { type: Type.STRING, description: 'Descriptive, accessible alt text for the primary hero banner' },
      },
      required: ['seoTitle', 'metaDescription', 'urlSlug', 'primaryKeyword', 'secondaryKeywords', 'ogTitle', 'ogDescription', 'suggestedImageAltText'],
    },
  },
  required: ['home', 'about', 'services', 'faq', 'seo'],
};

// API Route: Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// API Route: Generate Complete Website Copy
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const project = req.body;
    if (!project || !project.businessName) {
      return res.status(400).json({ error: 'Missing required project details.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Generate complete, professional website copy for a business with the following profile:
- Business Name: ${project.businessName}
- Industry: ${project.industry || 'Not specified'}
- Business Description: ${project.businessDescription || 'Not specified'}
- Target Audience: ${project.targetAudience || 'General audience'}
- Products / Services Offered: ${project.productsAndServices || 'Consulting & professional services'}
- Unique Selling Proposition (USP): ${project.usp || 'Quality and reliability'}
- Brand Mission: ${project.brandMission || 'To empower our clients'}
- Core Brand Values: ${project.brandValues || 'Integrity, Excellence, Innovation'}
- Preferred Writing Tone: ${project.tone || 'Professional'}
- Primary Conversion Goal: ${project.primaryConversionGoal || 'Generate inquiries/leads'}
- CTA Preference: ${project.ctaPreference || 'Get in touch / Book a consultation'}
- Primary Keyword: ${project.primaryKeyword || project.businessName}
- Secondary Keywords: ${project.secondaryKeywords || ''}
- Preferred Language: ${project.preferredLanguage || 'English'}
- Website Style: ${project.websiteStyle || 'Modern'}

CRITICAL GUIDELINES:
1. Write exclusively in ${project.preferredLanguage || 'English'}.
2. Maintain the ${project.tone || 'Professional'} tone throughout every section.
3. Align directly with the user's business description and products.
4. DO NOT invent false statistics (e.g. "99.8% satisfaction rate"), fabricated awards, fake certifications, or unverified factual claims.
5. Provide realistic IDs for list items (e.g. srv-1, srv-2, faq-1, etc.).
6. Ensure SEO Title is between 45 and 60 characters and Meta Description is between 125 and 155 characters.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are CopyCraft AI, a world-class senior copywriter and conversion strategist. Deliver polished, engaging, production-ready website copy strictly matching the provided JSON schema.',
        responseMimeType: 'application/json',
        responseSchema: fullCopyResponseSchema,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating project copy:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate website copy. Please verify your API key and connection.',
    });
  }
});

// API Route: Regenerate Single Section
app.post('/api/regenerate-section', async (req: Request, res: Response) => {
  try {
    const { project, section, instructions } = req.body;
    if (!project || !section) {
      return res.status(400).json({ error: 'Project and section are required.' });
    }

    const ai = getGeminiClient();

    let sectionSchema: any;
    let sectionPrompt = '';

    if (section === 'home') {
      sectionSchema = fullCopyResponseSchema.properties.home;
      sectionPrompt = 'Generate the complete Home section (heroHeadline, supportingHeadline, introduction, benefits, features, primaryCTA, secondaryCTA).';
    } else if (section === 'about') {
      sectionSchema = fullCopyResponseSchema.properties.about;
      sectionPrompt = 'Generate the complete About section (companyIntroduction, brandStory, mission, vision, brandValues, differentiators).';
    } else if (section === 'services') {
      sectionSchema = fullCopyResponseSchema.properties.services;
      sectionPrompt = 'Generate an array of 3-4 comprehensive Service items (id, name, description, benefits, features, callToAction).';
    } else if (section === 'faq') {
      sectionSchema = fullCopyResponseSchema.properties.faq;
      sectionPrompt = 'Generate an array of 4-6 realistic FAQ items (id, question, answer, category).';
    } else if (section === 'seo') {
      sectionSchema = fullCopyResponseSchema.properties.seo;
      sectionPrompt = 'Generate the complete SEO metadata (seoTitle 50-60 chars, metaDescription 130-155 chars, urlSlug, primaryKeyword, secondaryKeywords, ogTitle, ogDescription, suggestedImageAltText).';
    } else {
      return res.status(400).json({ error: `Invalid section: ${section}` });
    }

    const prompt = `
Regenerate ONLY the "${section.toUpperCase()}" section for the following business:
- Business Name: ${project.businessName}
- Industry: ${project.industry}
- Business Description: ${project.businessDescription}
- Target Audience: ${project.targetAudience}
- Products / Services: ${project.productsAndServices}
- Unique Selling Proposition: ${project.usp}
- Tone: ${project.tone}
- Primary Keyword: ${project.primaryKeyword}
- Preferred Language: ${project.preferredLanguage || 'English'}
${instructions ? `Additional user guidance: ${instructions}` : ''}

${sectionPrompt}
Write strictly in ${project.preferredLanguage || 'English'}. Do NOT invent fake stats or credentials. Return valid JSON matching the schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are CopyCraft AI. Regenerate solely the ${section} section of website copy in JSON format.`,
        responseMimeType: 'application/json',
        responseSchema: sectionSchema,
        temperature: 0.75,
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    return res.json({ success: true, section, data: parsedData });
  } catch (error: any) {
    console.error('Error regenerating section:', error);
    return res.status(500).json({
      error: error.message || 'Failed to regenerate section.',
    });
  }
});

// API Route: Regenerate Single Block / Text Field
app.post('/api/regenerate-block', async (req: Request, res: Response) => {
  try {
    const { fieldName, currentValue, instructions, projectBrief } = req.body;
    if (!fieldName) {
      return res.status(400).json({ error: 'fieldName is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are CopyCraft AI. Rewrite and elevate the following specific website copy field:
- Field Name: ${fieldName}
- Current Text: "${currentValue || ''}"
- Business Name: ${projectBrief?.businessName || ''}
- Tone: ${projectBrief?.tone || 'Professional'}
- Language: ${projectBrief?.preferredLanguage || 'English'}
- Industry: ${projectBrief?.industry || ''}
- Key USP: ${projectBrief?.usp || ''}
${instructions ? `- User Rewrite Instruction: "${instructions}"` : ''}

Provide a fresh, elevated, highly effective revision for this field.
Return a JSON object with a single string property: "rewrittenText".
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are CopyCraft AI. Provide a high-quality rewritten text block.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rewrittenText: { type: Type.STRING },
          },
          required: ['rewrittenText'],
        },
        temperature: 0.8,
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    return res.json({ success: true, rewrittenText: parsedData.rewrittenText });
  } catch (error: any) {
    console.error('Error rewriting block:', error);
    return res.status(500).json({
      error: error.message || 'Failed to rewrite text block.',
    });
  }
});

// API Route: Direct ZIP download endpoint
app.get('/api/download-zip', (req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public/website_export.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="website_export.zip"');
    return fs.createReadStream(zipPath).pipe(res);
  }
  return res.status(404).json({ error: 'ZIP file not found.' });
});

// Vite or Static file serving
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CopyCraft AI server running on port ${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
