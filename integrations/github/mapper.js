/**
 * GitHub Data Mapper
 * 
 * Transforms GitHub API responses into the internal
 * github.json format used by the portfolio.
 */

import { GITHUB_CONFIG } from './config';

/**
 * Map a GitHub API repo response to internal format
 * @param {import('./types').GitHubRepo} repo
 * @returns {import('./types').NormalizedRepo}
 */
export function mapGitHubRepo(repo) {
  return {
    id: `repo-${repo.name.toLowerCase()}`,
    name: repo.name,
    description_es: repo.description || '',
    description_en: repo.description || '',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    url: repo.html_url,
    topics: repo.topics || [],
    relatedProjectId: null, // Manual mapping needed
  };
}

/**
 * Calculate language percentages from bytes
 * @param {Record<string, number>} languageBytes - { "JavaScript": 12345, ... }
 * @returns {import('./types').GitHubLanguageStats[]}
 */
export function calculateLanguagePercentages(languageBytes) {
  const total = Object.values(languageBytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Go: '#00ADD8',
    Rust: '#dea584',
    Hugo: '#ff4088',
  };

  return Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / total) * 100),
      color: LANGUAGE_COLORS[name] || '#8b8b8b',
      bytes,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Map full GitHub profile data to internal format
 * @param {object} userData - GitHub user API response
 * @param {import('./types').GitHubRepo[]} repos - Repos API response
 * @param {Record<string, number>} aggregatedLanguages - Combined language bytes
 * @returns {import('./types').NormalizedGitHubProfile}
 */
export function mapGitHubProfile(userData, repos, aggregatedLanguages) {
  return {
    username: userData.login || GITHUB_CONFIG.username,
    profileUrl: userData.html_url || `https://github.com/${GITHUB_CONFIG.username}`,
    avatarUrl: userData.avatar_url || '',
    stats: {
      publicRepos: userData.public_repos || repos.length,
      followers: userData.followers || 0,
    },
    topLanguages: calculateLanguagePercentages(aggregatedLanguages),
    repositories: repos.map(mapGitHubRepo),
    source: 'api',
  };
}
