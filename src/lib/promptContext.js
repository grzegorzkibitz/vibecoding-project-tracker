// M10: turn a task and its goal history into Markdown to paste into an AI chat.
// Pure: no React, no clipboard. See copyText below for the clipboard part.
import { dueStatus } from './due.js';

const labelOf = (items, id) => items.find((i) => i.id === id)?.label ?? id;

/** A code fence longer than any run of backticks inside the text, so it can't break out. */
function fence(text) {
  const longest = Math.max(2, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  const ticks = '`'.repeat(longest + 1);
  return `${ticks}text\n${text}\n${ticks}`;
}

const shortDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/**
 * @param {import('./types.js').Task} task
 * @param {import('./types.js').Lists} lists
 * @param {Date} [now]
 * @returns {string} Markdown
 */
export function taskToPromptContext(task, lists, now = new Date()) {
  const column = lists.columns.find((c) => c.id === task.status);
  const due = dueStatus(task.dueDate, Boolean(column?.isDone), now);
  const goals = task.goals ?? [];

  const lines = [
    `# Task: ${task.title}`,
    '',
    `- **Type:** ${labelOf(lists.types, task.type)}`,
    `- **Status:** ${column?.label ?? task.status}`,
    `- **Assignee:** ${task.assignee}`,
    `- **Due:** ${task.dueDate ? `${task.dueDate} (${due.label})` : 'No due date'}`,
  ];

  if (task.description?.trim()) {
    lines.push('', '## Description', '', task.description.trim());
  }

  lines.push('', `## Goal history (${goals.length}, oldest first)`);
  if (goals.length === 0) {
    lines.push('', 'No prompts tried yet.');
  }
  goals.forEach((g, i) => {
    lines.push(
      '',
      `### Goal ${i + 1}: ${labelOf(lists.outcomes, g.outcome)}`,
      '',
      `- **AI tool:** ${labelOf(lists.tools, g.tool)}`,
      `- **Date:** ${shortDate(g.updatedAt ?? g.createdAt)}`,
      '',
      '**Prompt:**',
      '',
      fence(g.prompt),
    );
    if (g.notes?.trim()) lines.push('', `**Notes:** ${g.notes.trim()}`);
  });

  lines.push(
    '',
    '## What I need',
    '',
    'Help me continue this task. Use the goal history above: build on what worked, and do not repeat approaches that failed.',
  );
  return lines.join('\n') + '\n';
}

/** Copy text to the clipboard. Falls back to execCommand where the Clipboard API is blocked. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fall through to the older method (e.g. non-secure context).
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  if (!ok) throw new Error('Copy failed');
}
