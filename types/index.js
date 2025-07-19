// Core types for the IdeaHub platform

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} fullName
 * @property {string} [avatar]
 * @property {string} [bio]
 * @property {string} [location]
 * @property {string} [website]
 * @property {string} joinedAt
 * @property {number} followers
 * @property {number} following
 * @property {number} publicRepos
 * @property {boolean} isVerified
 */

/**
 * @typedef {Object} Idea
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} content
 * @property {User} author
 * @property {string[]} tags
 * @property {string} category
 * @property {string} license
 * @property {string} version
 * @property {number} stars
 * @property {number} forks
 * @property {boolean} isStarred
 * @property {boolean} isFork
 * @property {string} [forkedFrom]
 * @property {'public'|'private'} visibility
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {User[]} collaborators
 * @property {Comment[]} comments
 * @property {Issue[]} issues
 * @property {string} [language]
 * @property {'draft'|'published'|'archived'} status
 */

/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} content
 * @property {User} author
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Comment[]} replies
 * @property {number} votes
 * @property {boolean} isVoted
 */

/**
 * @typedef {Object} Issue
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {User} author
 * @property {User} [assignee]
 * @property {string[]} labels
 * @property {'open'|'closed'|'in_progress'} status
 * @property {'low'|'medium'|'high'|'urgent'} priority
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Comment[]} comments
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {'star'|'fork'|'comment'|'mention'|'follow'|'issue'} type
 * @property {string} message
 * @property {boolean} isRead
 * @property {string} createdAt
 * @property {User} [relatedUser]
 * @property {Idea} [relatedIdea]
 * @property {string} [relatedUrl]
 */

/**
 * @typedef {Object} Activity
 * @property {string} id
 * @property {'created'|'updated'|'starred'|'forked'|'commented'} type
 * @property {User} user
 * @property {Idea} [idea]
 * @property {string} description
 * @property {string} timestamp
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} query
 * @property {string} category
 * @property {string[]} tags
 * @property {string} language
 * @property {'newest'|'oldest'|'most-stars'|'most-forks'|'recently-updated'} sort
 * @property {string} license
 */

/**
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {string} message
 * @property {boolean} success
 * @property {Object} [pagination]
 * @property {number} pagination.page
 * @property {number} pagination.limit
 * @property {number} pagination.total
 * @property {number} pagination.totalPages
 */

// Export empty object to make this a module
export default {};
