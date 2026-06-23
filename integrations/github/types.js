/**
 * GitHub API Integration Types (JSDoc)
 * 
 * Architecture prepared for future GitHub API sync.
 * Currently using mock data from github.json.
 */

/**
 * @typedef {Object} GitHubRepo
 * @property {string} id
 * @property {string} name
 * @property {string} full_name
 * @property {string} description
 * @property {string} html_url
 * @property {string} language - Primary language
 * @property {number} stargazers_count
 * @property {number} forks_count
 * @property {string[]} topics
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} pushed_at
 */

/**
 * @typedef {Object} GitHubContributions
 * @property {number} totalCommits
 * @property {number} totalPRs
 * @property {number} totalIssues
 * @property {number} totalReviews
 * @property {ContributionDay[]} contributionCalendar
 */

/**
 * @typedef {Object} ContributionDay
 * @property {string} date - ISO date string
 * @property {number} count - Number of contributions
 * @property {number} level - 0-4 intensity level
 */

/**
 * @typedef {Object} GitHubLanguageStats
 * @property {string} name
 * @property {number} percentage
 * @property {string} color - Hex color
 * @property {number} bytes
 */

/**
 * @typedef {Object} NormalizedGitHubProfile
 * @property {string} username
 * @property {string} profileUrl
 * @property {string} avatarUrl
 * @property {Object} stats
 * @property {GitHubLanguageStats[]} topLanguages
 * @property {NormalizedRepo[]} repositories
 * @property {string} source - "mock" | "api"
 */

/**
 * @typedef {Object} NormalizedRepo
 * @property {string} id
 * @property {string} name
 * @property {string} description_es
 * @property {string} description_en
 * @property {string} language
 * @property {number} stars
 * @property {number} forks
 * @property {string} url
 * @property {string[]} topics
 * @property {string|null} relatedProjectId
 */

export const GITHUB_SOURCES = {
  MOCK: 'mock',
  API: 'api',
};
