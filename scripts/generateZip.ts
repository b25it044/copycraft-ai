import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sampleProjects } from '../src/services/storage.ts';
import {
  generateIndexHtml,
  generateAboutHtml,
  generateServicesHtml,
  generateFAQHtml,
  generateCSS,
  generateScriptJS,
  generateReadmeMD,
} from '../src/services/exporter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildZip() {
  const project = sampleProjects[0];
  const zip = new JSZip();

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

  zip.file('index.html', indexHtml);
  zip.file('about.html', aboutHtml);
  zip.file('services.html', servicesHtml);
  zip.file('faq.html', faqHtml);
  zip.file('styles.css', stylesCss);
  zip.file('script.js', scriptJs);
  zip.file('content.json', contentJson);
  zip.file('metadata.json', metadataJson);
  zip.file('README.md', readmeMd);

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const distDir = path.resolve(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(publicDir, 'website_export.zip'), buffer);
  fs.writeFileSync(path.join(publicDir, 'novaflow_website_export.zip'), buffer);
  fs.writeFileSync(path.join(distDir, 'website_export.zip'), buffer);
  fs.writeFileSync(path.join(distDir, 'novaflow_website_export.zip'), buffer);

  console.log('Successfully generated website_export.zip in public/ and dist/ ! Size:', buffer.length, 'bytes');
}

buildZip().catch((err) => {
  console.error(err);
  process.exit(1);
});
