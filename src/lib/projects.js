// Multiple projects. Pure logic over a small storage interface, so it can be tested
// without a browser. Each project owns its tasks, lists and anchors (stored under
// its own keys); the index key holds the project list and the open project.
import { DEFAULT_ANCHORS } from './defaults.js';

export const INDEX_KEY = 'vibetracker.projects';
const DATA = ['tasks', 'lists', 'anchors'];
// Before multi-project support, data lived under these keys.
const LEGACY_KEYS = { tasks: 'vibetracker.tasks', lists: 'vibetracker.lists', anchors: 'vibetracker.anchors' };

/** Storage key for one project's data, e.g. vibetracker.p.abc.tasks */
export const projectKey = (id, part) => `vibetracker.p.${id}.${part}`;

/** localStorage wrapped as JSON get/set/remove that never throws. */
export const browserStorage = {
  get(key) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or private mode */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

const newId = () => globalThis.crypto?.randomUUID?.() ?? `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function cleanName(projects, name, exceptId) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Give the project a name.');
  if (projects.some((p) => p.id !== exceptId && p.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error(`A project called "${trimmed}" already exists.`);
  }
  return trimmed;
}

/**
 * Read the project index, creating it on first run:
 * - old single-board data in this browser moves into "My project";
 * - a fresh browser gets "Demo project" (no stored data, so it shows the seed tasks).
 * Writes the result back, so this is safe to call on every load.
 */
export function loadIndex(storage) {
  const stored = storage.get(INDEX_KEY);
  const projects = Array.isArray(stored?.projects)
    ? stored.projects.filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
    : [];

  if (projects.length > 0) {
    const currentId = projects.some((p) => p.id === stored.currentId) ? stored.currentId : projects[0].id;
    const index = { projects, currentId };
    if (currentId !== stored.currentId) storage.set(INDEX_KEY, index);
    return index;
  }

  const id = newId();
  const hasLegacy = DATA.some((part) => storage.get(LEGACY_KEYS[part]) != null);
  if (hasLegacy) {
    for (const part of DATA) {
      const value = storage.get(LEGACY_KEYS[part]);
      if (value != null) storage.set(projectKey(id, part), value);
      storage.remove(LEGACY_KEYS[part]);
    }
  }
  const index = {
    projects: [{ id, name: hasLegacy ? 'My project' : 'Demo project', createdAt: new Date().toISOString() }],
    currentId: id,
  };
  storage.set(INDEX_KEY, index);
  return index;
}

/** New empty project (default lists, no tasks, no links). It becomes the open project. */
export function createProject(storage, index, name, teamId) {
  const project = {
    id: newId(),
    name: cleanName(index.projects, name),
    teamId,
    createdAt: new Date().toISOString(),
  };
  storage.set(projectKey(project.id, 'tasks'), []);
  storage.set(projectKey(project.id, 'anchors'), DEFAULT_ANCHORS.map((a) => ({ ...a, url: null })));
  const next = { projects: [...index.projects, project], currentId: project.id };
  storage.set(INDEX_KEY, next);
  return next;
}

export function renameProject(storage, index, id, name) {
  const clean = cleanName(index.projects, name, id);
  const next = { ...index, projects: index.projects.map((p) => (p.id === id ? { ...p, name: clean } : p)) };
  storage.set(INDEX_KEY, next);
  return next;
}

/** Change which team a project uses (whose users can be assigned its tasks). */
export function setProjectTeam(storage, index, id, teamId) {
  const next = { ...index, projects: index.projects.map((p) => (p.id === id ? { ...p, teamId } : p)) };
  storage.set(INDEX_KEY, next);
  return next;
}

/** Delete a project and its data. The last project can't be deleted. */
export function deleteProject(storage, index, id) {
  if (index.projects.length <= 1) throw new Error('You need at least one project.');
  const projects = index.projects.filter((p) => p.id !== id);
  for (const part of DATA) storage.remove(projectKey(id, part));
  const next = { projects, currentId: index.currentId === id ? projects[0].id : index.currentId };
  storage.set(INDEX_KEY, next);
  return next;
}

export function openProject(storage, index, id) {
  if (!index.projects.some((p) => p.id === id)) return index;
  const next = { ...index, currentId: id };
  storage.set(INDEX_KEY, next);
  return next;
}

/** Task count for a project, read straight from storage (for the delete warning). */
export function taskCount(storage, id) {
  const tasks = storage.get(projectKey(id, 'tasks'));
  return Array.isArray(tasks) ? tasks.length : 0;
}
