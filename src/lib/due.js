// Due-date state for a card (M8, PRD DR-09, DESIGN.md §3). No React in here.

const DAY_MS = 24 * 60 * 60 * 1000;

/** 'YYYY-MM-DD' as a local-midnight Date (new Date('YYYY-MM-DD') would be UTC). */
function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole calendar days from `now` to the due date. Negative = overdue. */
export function daysUntil(dueDate, now = new Date()) {
  return Math.round((parseDay(dueDate) - startOfDay(now)) / DAY_MS);
}

/**
 * @returns {null | { state: 'safe'|'warning'|'overdue'|'done', label: string, date: string }}
 *   null when the task has no due date.
 */
export function dueStatus(dueDate, isDone, now = new Date()) {
  if (!dueDate) return null;
  const date = parseDay(dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  if (isDone) return { state: 'done', label: 'Done', date };

  const days = daysUntil(dueDate, now);
  if (days < 0) return { state: 'overdue', label: `Overdue ${-days}d`, date };
  if (days === 0) return { state: 'warning', label: 'Due today', date };
  if (days === 1) return { state: 'warning', label: 'Due tomorrow', date };
  return { state: 'safe', label: `Due in ${days}d`, date };
}
