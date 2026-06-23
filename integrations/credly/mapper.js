/**
 * Credly Data Mapper
 * 
 * Transforms Credly API responses into the internal
 * certifications.json format used by the portfolio.
 */

/**
 * Known provider name mappings from Credly issuer names
 */
const ISSUER_TO_PROVIDER = {
  'Google': 'Google',
  'Google Cloud': 'Google',
  'Cisco': 'Cisco',
  'Cisco Networking Academy': 'Cisco',
  'Microsoft': 'Microsoft',
  'Anthropic': 'Anthropic',
};

/**
 * Map a Credly badge to the internal certification format
 * @param {import('./types').CredlyBadge} badge - Credly badge object
 * @returns {import('./types').NormalizedCertification}
 */
export function mapCredlyBadgeToCertification(badge) {
  const issuerName = badge.issuer?.name || 'Unknown';
  const provider = ISSUER_TO_PROVIDER[issuerName] || issuerName;
  const year = badge.issued_at ? new Date(badge.issued_at).getFullYear().toString() : '';

  return {
    id: `credly-${badge.id}`,
    name_es: badge.badge_template?.name || '',
    name_en: badge.badge_template?.name || '',
    provider,
    year,
    skills_es: badge.badge_template?.skills || [],
    skills_en: badge.badge_template?.skills || [],
    badge: badge.badge_template?.image_url || null,
    credly_badge_id: badge.id,
    pdf: null,
    source: 'credly',
  };
}

/**
 * Map an array of Credly badges, grouped by provider
 * @param {import('./types').CredlyBadge[]} badges
 * @returns {Record<string, import('./types').NormalizedCertification[]>}
 */
export function mapCredlyBadgesByProvider(badges) {
  const grouped = {};
  for (const badge of badges) {
    if (badge.state !== 'accepted') continue;
    const cert = mapCredlyBadgeToCertification(badge);
    if (!grouped[cert.provider]) {
      grouped[cert.provider] = [];
    }
    grouped[cert.provider].push(cert);
  }
  return grouped;
}

/**
 * Merge Credly badges with existing local certifications
 * Local data takes precedence (richer metadata)
 * @param {Array} localCerts - Current certifications.json data
 * @param {import('./types').CredlyBadge[]} credlyBadges - Badges from API
 * @returns {Array} Merged certifications
 */
export function mergeWithLocalCerts(localCerts, credlyBadges) {
  const localBadgeIds = new Set();
  for (const provider of localCerts) {
    for (const item of provider.items) {
      if (item.credly_badge_id) {
        localBadgeIds.add(item.credly_badge_id);
      }
    }
  }

  // Only add Credly badges that don't exist locally
  const newBadges = credlyBadges.filter(
    (b) => b.state === 'accepted' && !localBadgeIds.has(b.id)
  );

  if (newBadges.length === 0) return localCerts;

  const grouped = mapCredlyBadgesByProvider(newBadges);
  const merged = [...localCerts];

  for (const [provider, certs] of Object.entries(grouped)) {
    const existing = merged.find((p) => p.provider === provider);
    if (existing) {
      existing.items.push(...certs);
    } else {
      merged.push({
        id: `cert-credly-${provider.toLowerCase().replace(/\s+/g, '-')}`,
        provider,
        color: '#6366f1',
        icon: provider[0],
        items: certs,
      });
    }
  }

  return merged;
}
