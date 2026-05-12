export function getTenantSlug(): string {
  const host = window.location.hostname.toLowerCase();

  if (host === 'oodc-ats.oneapp.ph') return 'oodc';

  if (host.endsWith('.oodc-ats.oneapp.ph')) {
    return host.split('.')[0];
  }

  const parts = host.split('.');
  if (parts.length >= 3) return parts[0];
  if (parts.length === 2 && parts[1] === 'localhost') return parts[0];

  return 'oodc';
}
