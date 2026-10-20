// Teams and their (made-up) users. Pure logic over the same storage interface as
// projects.js, so it can be tested without a browser. Teams are shared by all
// projects; each project points at one team, whose users can be assigned tasks.
import { DEFAULT_TEAM } from './defaults.js';

export const TEAMS_KEY = 'vibetracker.teams';

const newId = (prefix) =>
  globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function cleanName(existing, name, what, exceptId) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error(`Give the ${what} a name.`);
  if (existing.some((x) => x.id !== exceptId && x.name.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error(`A ${what} called "${trimmed}" already exists.`);
  }
  return trimmed;
}

const isTeam = (t) => t && typeof t.id === 'string' && typeof t.name === 'string';
const isMember = (m) => m && typeof m.id === 'string' && typeof m.name === 'string';

/** Read the teams, creating the default team on first run. Always returns at least one team. */
export function loadTeams(storage) {
  const stored = storage.get(TEAMS_KEY);
  const teams = Array.isArray(stored)
    ? stored.filter(isTeam).map((t) => ({ ...t, members: (t.members ?? []).filter(isMember) }))
    : [];
  if (teams.length > 0) return teams;
  const fresh = [structuredClone(DEFAULT_TEAM)];
  storage.set(TEAMS_KEY, fresh);
  return fresh;
}

function save(storage, teams) {
  storage.set(TEAMS_KEY, teams);
  return teams;
}

const update = (storage, teams, teamId, fn) =>
  save(storage, teams.map((t) => (t.id === teamId ? fn(t) : t)));

const findTeam = (teams, teamId) => {
  const team = teams.find((t) => t.id === teamId);
  if (!team) throw new Error('That team no longer exists.');
  return team;
};

/** New team with no users. Returns { teams, team }. */
export function createTeam(storage, teams, name) {
  const team = { id: newId('t'), name: cleanName(teams, name, 'team'), members: [] };
  return { teams: save(storage, [...teams, team]), team };
}

export function renameTeam(storage, teams, teamId, name) {
  const clean = cleanName(teams, name, 'team', teamId);
  return update(storage, teams, teamId, (t) => ({ ...t, name: clean }));
}

/** Delete a team. Not allowed for the last team, or while a project still uses it. */
export function deleteTeam(storage, teams, teamId, projectsUsing = 0) {
  if (teams.length <= 1) throw new Error('You need at least one team.');
  if (projectsUsing > 0) throw new Error('Move its projects to another team first.');
  return save(storage, teams.filter((t) => t.id !== teamId));
}

export function addMember(storage, teams, teamId, name) {
  const team = findTeam(teams, teamId);
  const member = { id: newId('u'), name: cleanName(team.members, name, 'user') };
  return update(storage, teams, teamId, (t) => ({ ...t, members: [...t.members, member] }));
}

export function renameMember(storage, teams, teamId, memberId, name) {
  const team = findTeam(teams, teamId);
  const clean = cleanName(team.members, name, 'user', memberId);
  return update(storage, teams, teamId, (t) => ({
    ...t,
    members: t.members.map((m) => (m.id === memberId ? { ...m, name: clean } : m)),
  }));
}

/** Remove a user. Tasks still pointing at them show as Unassigned. */
export function removeMember(storage, teams, teamId, memberId) {
  return update(storage, teams, teamId, (t) => ({ ...t, members: t.members.filter((m) => m.id !== memberId) }));
}

/** The team a project uses. Projects from before teams existed use the first team. */
export const teamFor = (teams, project) => teams.find((t) => t.id === project?.teamId) ?? teams[0];

/**
 * The member a task's `assignee` points at, or null (Unassigned).
 * Matches by id, then by name for tasks saved before users had ids.
 */
export function memberFor(team, assignee) {
  if (!assignee || !team) return null;
  return team.members.find((m) => m.id === assignee) ?? team.members.find((m) => m.name === assignee) ?? null;
}

export const assigneeName = (team, assignee) => memberFor(team, assignee)?.name ?? 'Unassigned';
