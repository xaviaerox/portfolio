/**
 * GitHub API Configuration
 * 
 * NOTE: No real tokens implemented.
 * Architecture scaffold for future GitHub API integration.
 */

export const GITHUB_CONFIG = {
  apiUrl: 'https://api.github.com',
  graphqlUrl: 'https://api.github.com/graphql',
  username: 'xaviaerox',
  endpoints: {
    user: '/users/{username}',
    repos: '/users/{username}/repos',
    languages: '/repos/{owner}/{repo}/languages',
    events: '/users/{username}/events',
  },
  // Future: Set via environment variable
  token: null,
};

/**
 * Build a GitHub API URL
 * @param {string} endpoint
 * @param {Record<string, string>} params
 * @returns {string}
 */
export function buildGitHubUrl(endpoint, params = {}) {
  let url = `${GITHUB_CONFIG.apiUrl}${endpoint}`;
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`{${key}}`, value);
  }
  return url;
}

/**
 * Check if GitHub API integration is configured
 * @returns {boolean}
 */
export function isGitHubConfigured() {
  return !!GITHUB_CONFIG.token;
}
