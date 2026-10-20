// Shared shapes (PRD §5). JSDoc only — no runtime code.

/**
 * An entry in one of the team-managed lists.
 * @typedef {Object} ListItem
 * @property {string} id         Stable; never changes when the label is renamed.
 * @property {string} label
 * @property {boolean} [isDone]  Columns only: tasks here count as complete.
 */

/**
 * @typedef {Object} Lists
 * @property {ListItem[]} columns   Order = left-to-right on the board.
 * @property {ListItem[]} types
 * @property {ListItem[]} tools
 * @property {ListItem[]} outcomes
 */

/**
 * One attempt at a task: the prompt, the AI tool, and how it went.
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} prompt
 * @property {string} tool       id in lists.tools
 * @property {string} outcome    id in lists.outcomes
 * @property {string} notes
 * @property {string} createdAt  ISO timestamp
 * @property {string} updatedAt  ISO timestamp
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} type          id in lists.types
 * @property {string} status        id in lists.columns
 * @property {string|null} assignee  id of a user in the project's team; null = Unassigned
 * @property {string|null} dueDate  ISO 'YYYY-MM-DD'
 * @property {string} createdDate   ISO 'YYYY-MM-DD'
 * @property {Goal[]} goals
 */

export {};
