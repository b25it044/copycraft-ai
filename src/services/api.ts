import { Project, ProjectContent } from '../types';

export async function checkHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'error', hasApiKey: false };
  }
}

export async function generateFullCopy(project: Project): Promise<ProjectContent> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  const result = await response.json();
  if (!result.data) {
    throw new Error('Received malformed response from generation engine.');
  }
  return result.data;
}

export async function regenerateSection(
  project: Project,
  section: keyof ProjectContent,
  instructions?: string
): Promise<any> {
  const response = await fetch('/api/regenerate-section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project, section, instructions }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to regenerate ${section} section.`);
  }

  const result = await response.json();
  return result.data;
}

export async function rewriteBlock(
  fieldName: string,
  currentValue: string,
  instructions: string,
  projectBrief: Partial<Project>
): Promise<string> {
  const response = await fetch('/api/regenerate-block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fieldName, currentValue, instructions, projectBrief }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to rewrite block.');
  }

  const result = await response.json();
  return result.rewrittenText;
}
