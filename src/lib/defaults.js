// Default managed lists (PRD §7). Every team starts with these.
export const DEFAULT_LISTS = {
  columns: [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done', isDone: true },
  ],
  types: [
    { id: 'feature', label: 'Feature' },
    { id: 'bug', label: 'Bug' },
  ],
  tools: ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'].map((label) => ({
    id: label.toLowerCase(),
    label,
  })),
  outcomes: [
    { id: 'pending', label: 'Pending' },
    { id: 'worked', label: 'Worked' },
    { id: 'partial', label: 'Partial' },
    { id: 'failed', label: 'Failed' },
  ],
};

// Placeholders until PRD §8 / §11 are filled in.
export const TEAM_NAME = 'Your team';
export const TEAM = ['Teammate A', 'Teammate B', 'Teammate C'];

const today = new Date();
const iso = (offsetDays) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Scaffold the Kanban board',
    description: 'Render the columns and task cards.',
    type: 'feature',
    status: 'in-progress',
    assignee: TEAM[0],
    dueDate: iso(2),
    createdDate: iso(-1),
    goals: [],
  },
  {
    id: 'seed-2',
    title: 'Fix modal closing on Esc',
    description: 'Dialog ignores the Escape key.',
    type: 'bug',
    status: 'todo',
    assignee: TEAM[1],
    dueDate: iso(-1),
    createdDate: iso(-3),
    goals: [],
  },
  {
    id: 'seed-3',
    title: 'Write the Copy as Prompt Context template',
    description: 'Markdown output for a task and its goals.',
    type: 'feature',
    status: 'review',
    assignee: TEAM[2],
    dueDate: null,
    createdDate: iso(-2),
    goals: [],
  },
  {
    id: 'seed-4',
    title: 'Choose the design theme',
    description: 'Graphite via tweakcn.',
    type: 'feature',
    status: 'done',
    assignee: TEAM[1],
    dueDate: iso(-2),
    createdDate: iso(-5),
    goals: [],
  },
];
