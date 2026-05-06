const TYPE_LABELS: Record<string, string> = {
  technical_test: 'Technical Test',
  personality_test: 'Personality Test',
  skills_assessment: 'Skills Assessment',
  cognitive_test: 'Cognitive Test',
  portfolio_review: 'Portfolio Review',
};

export function formatAssessmentType(type?: string | null): string {
  if (!type) return 'Assessment';
  return TYPE_LABELS[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolveFileUrl(rawUrl?: string | null): string {
  if (!rawUrl) return '';
  if (/^(?:https?:\/\/|data:|blob:)/i.test(rawUrl)) return rawUrl;
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;
  if (!backendBaseUrl) return rawUrl;
  const trimmedBaseUrl = backendBaseUrl.replace(/\/$/, '');
  const normalizedPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
  return `${trimmedBaseUrl}${normalizedPath}`;
}

export const isImageExtension = (ext?: string | null): boolean => {
  if (!ext) return false;
  const n = ext.toLowerCase().replace('.', '');
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(n);
};

export const isPdfExtension = (ext?: string | null): boolean => {
  if (!ext) return false;
  return ext.toLowerCase().replace('.', '') === 'pdf';
};
