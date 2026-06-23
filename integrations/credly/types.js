/**
 * Credly API Integration Types (JSDoc)
 * 
 * Architecture prepared for future Credly API sync.
 * Currently using local data from certifications.json.
 * 
 * Flow: Credly API → Sync Job → Data Normalization → Portfolio
 */

/**
 * @typedef {Object} CredlyBadge
 * @property {string} id - Credly badge UUID
 * @property {string} badge_template_id - Template ID
 * @property {string} issued_at - ISO date string
 * @property {string} expires_at - ISO date string or null
 * @property {string} state - "accepted" | "pending" | "revoked"
 * @property {CredlyBadgeTemplate} badge_template - Badge template details
 * @property {CredlyIssuer} issuer - Issuing organization
 */

/**
 * @typedef {Object} CredlyBadgeTemplate
 * @property {string} id - Template UUID
 * @property {string} name - Badge name
 * @property {string} description - Badge description
 * @property {string} image_url - Badge image URL
 * @property {string[]} skills - Associated skills
 * @property {string} url - Public badge URL
 */

/**
 * @typedef {Object} CredlyIssuer
 * @property {string} id - Issuer UUID
 * @property {string} name - Organization name (e.g., "Google", "Cisco")
 * @property {string} vanity_url - Credly profile slug
 */

/**
 * @typedef {Object} CredlySyncResult
 * @property {boolean} success
 * @property {number} badgesFound
 * @property {number} badgesMapped
 * @property {string} syncedAt - ISO timestamp
 * @property {NormalizedCertification[]} certifications
 */

/**
 * @typedef {Object} NormalizedCertification
 * @property {string} id - Internal ID
 * @property {string} name_es - Spanish name
 * @property {string} name_en - English name
 * @property {string} provider - Provider name
 * @property {string} year - Year obtained
 * @property {string[]} skills_es - Skills in Spanish
 * @property {string[]} skills_en - Skills in English
 * @property {string|null} badge - Badge image path/URL
 * @property {string|null} credly_badge_id - Credly badge UUID
 * @property {string|null} pdf - Certificate PDF path/URL
 * @property {string} source - "local" | "credly"
 */

export const CREDLY_BADGE_STATES = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  REVOKED: 'revoked',
};
