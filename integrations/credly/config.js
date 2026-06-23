/**
 * Credly API Configuration
 * 
 * NOTE: No real credentials implemented.
 * This is the architecture scaffold for future integration.
 */

export const CREDLY_CONFIG = {
  baseUrl: 'https://www.credly.com/api/v1',
  endpoints: {
    badges: '/users/{userId}/badges',
    badgeDetails: '/badges/{badgeId}',
    badgeTemplate: '/badge_templates/{templateId}',
  },
  // Future: Set via environment variable
  userId: null,
  apiKey: null,
};

/**
 * Build a Credly API URL
 * @param {string} endpoint - Endpoint template
 * @param {Record<string, string>} params - URL parameters
 * @returns {string} Full URL
 */
export function buildCredlyUrl(endpoint, params = {}) {
  let url = `${CREDLY_CONFIG.baseUrl}${endpoint}`;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{${key}}`, value);
  }
  return url;
}

/**
 * Check if Credly integration is configured
 * @returns {boolean}
 */
export function isCredlyConfigured() {
  return !!(CREDLY_CONFIG.userId && CREDLY_CONFIG.apiKey);
}
