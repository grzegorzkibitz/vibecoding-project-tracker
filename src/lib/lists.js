// Pure logic for the team-managed lists (PRD §7). No React in here.
import { DEFAULT_LISTS } from './defaults.js';

/** @typedef {import('./types.js').Lists} Lists */
/** @typedef {import('./types.js').ListItem} ListItem */
/** @typedef {import('./types.js').Task} Task */

export const LIST_KEYS = ['columns', 'types', 'tools', 'outcomes'];

// Where each list is referenced from tasks (and their goals).
const TASK_FIELD = { columns: 'status', types: 'type' };
const GOAL_FIELD = { tools: 'tool', outcomes: 'outcome' };

/** Fill in any missing or empty list from the defaults (old or corrupt storage). */
export function normalizeLists(stored) {
  const out = {};
  for (const key of LIST_KEYS) {
    const items = stored?.[key];
    out[key] = Array.isArray(items) && items.length > 0 ? items : DEFAULT_LISTS[key];
  }
  if (!out.columns.some((c) => c.isDone)) {
    out.columns = out.columns.map((c, i) => (i === out.columns.length - 1 ? { ...c, isDone: true } : c));
  }
  return out;
}

/** How many tasks (columns, types) or goals (tools, outcomes) use this entry. */
export function usageCount(tasks, key, id) {
  if (TASK_FIELD[key]) return tasks.filter((t) => t[TASK_FIELD[key]] === id).length;
  const field = GOAL_FIELD[key];
  return tasks.reduce((n, t) => n + (t.goals ?? []).filter((g) => g[field] === id).length, 0);
}

function slug(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

function uniqueId(items, label) {
  const base = slug(label);
  let id = base;
  for (let n = 2; items.some((i) => i.id === id); n++) id = `${base}-${n}`;
  return id;
}

function cleanLabel(items, label, exceptId) {
  const trimmed = label.trim();
  if (!trimmed) throw new Error('Name cannot be empty.');
  const clash = items.some((i) => i.id !== exceptId && i.label.toLowerCase() === trimmed.toLowerCase());
  if (clash) throw new Error(`"${trimmed}" already exists.`);
  return trimmed;
}

const withList = (lists, key, items) => ({ ...lists, [key]: items });

export function addItem(lists, key, label) {
  const items = lists[key];
  const clean = cleanLabel(items, label);
  return withList(lists, key, [...items, { id: uniqueId(items, clean), label: clean }]);
}

export function renameItem(lists, key, id, label) {
  const items = lists[key];
  const clean = cleanLabel(items, label, id);
  return withList(lists, key, items.map((i) => (i.id === id ? { ...i, label: clean } : i)));
}

/** Move an entry from one position to another (clamped). */
export function moveItem(lists, key, id, toIndex) {
  const items = [...lists[key]];
  const from = items.findIndex((i) => i.id === id);
  if (from === -1) return lists;
  const [item] = items.splice(from, 1);
  items.splice(Math.max(0, Math.min(items.length, toIndex)), 0, item);
  return withList(lists, key, items);
}

/** Columns only. At least one column must stay marked done. */
export function setColumnDone(lists, id, isDone) {
  const columns = lists.columns.map((c) => (c.id === id ? { ...c, isDone } : c));
  if (!columns.some((c) => c.isDone)) throw new Error('At least one column must be marked done.');
  return withList(lists, 'columns', columns);
}

/** Re-point every task / goal using `fromId` at `toId`. */
function reassign(tasks, key, fromId, toId) {
  if (TASK_FIELD[key]) {
    const f = TASK_FIELD[key];
    return tasks.map((t) => (t[f] === fromId ? { ...t, [f]: toId } : t));
  }
  const f = GOAL_FIELD[key];
  return tasks.map((t) =>
    (t.goals ?? []).some((g) => g[f] === fromId)
      ? { ...t, goals: t.goals.map((g) => (g[f] === fromId ? { ...g, [f]: toId } : g)) }
      : t,
  );
}

/**
 * Remove an entry. If tasks/goals use it, `moveToId` says where they go; without it
 * this throws instead of deleting data silently.
 * @returns {{lists: Lists, tasks: Task[]}}
 */
export function removeItem(lists, tasks, key, id, moveToId) {
  const items = lists[key];
  if (items.length <= 1) throw new Error('A list cannot be empty.');
  const target = items.find((i) => i.id === id);
  if (!target) return { lists, tasks };

  let nextTasks = tasks;
  if (usageCount(tasks, key, id) > 0) {
    if (!moveToId || moveToId === id || !items.some((i) => i.id === moveToId)) {
      throw new Error('Choose where to move the items that use this entry.');
    }
    nextTasks = reassign(tasks, key, id, moveToId);
  }

  let nextItems = items.filter((i) => i.id !== id);
  // Removing the only done column hands the flag to the entry the work moved to.
  if (key === 'columns' && !nextItems.some((c) => c.isDone)) {
    const heir = moveToId && nextItems.some((c) => c.id === moveToId) ? moveToId : nextItems[nextItems.length - 1].id;
    nextItems = nextItems.map((c) => (c.id === heir ? { ...c, isDone: true } : c));
  }
  return { lists: withList(lists, key, nextItems), tasks: nextTasks };
}

/**
 * Restore a list to its defaults. Entries in use that the defaults don't have are
 * moved to `moveToId` (a default entry's id) first.
 * @returns {{lists: Lists, tasks: Task[]}}
 */
export function resetList(lists, tasks, key, moveToId) {
  const defaults = DEFAULT_LISTS[key];
  const defaultIds = new Set(defaults.map((d) => d.id));
  const inUse = lists[key].filter((i) => !defaultIds.has(i.id) && usageCount(tasks, key, i.id) > 0);
  if (inUse.length > 0 && !defaultIds.has(moveToId)) {
    throw new Error('Choose a default entry to move the items that use removed entries.');
  }
  let nextTasks = tasks;
  for (const item of inUse) nextTasks = reassign(nextTasks, key, item.id, moveToId);
  return { lists: withList(lists, key, defaults), tasks: nextTasks };
}
