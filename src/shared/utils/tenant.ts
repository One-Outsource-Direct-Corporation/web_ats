/**
 * Extract tenant slug from the current hostname.
 * Subdomain patterns:
 *   - oodc.ats.example.com (3+ parts) → 'oodc'
 *   - testcompany.localhost (2 parts, localhost) → 'testcompany'
 *   - localhost (1 part) → 'oodc'
 * Bare domain defaults to 'oodc'.
 */
export function getTenantSlug(): string {
  const host = window.location.hostname.toLowerCase();
  const parts = host.split('.');

  if (parts.length >= 3) {
    // e.g., oodc.ats.example.com → 'oodc'
    return parts[0];
  }

  if (parts.length === 2 && parts[1] === 'localhost') {
    // e.g., testcompany.localhost → 'testcompany'
    return parts[0];
  }

  // Bare domain or plain localhost → default to oodc
  return 'oodc';
}
