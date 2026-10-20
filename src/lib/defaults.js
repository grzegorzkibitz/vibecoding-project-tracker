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

// The four deliverable slots on the Anchor Board (M11, PRD §5 `Anchor`). Fixed set.
// One link is filled in so the feature shows on first open (PRD DR-10).
export const DEFAULT_ANCHORS = [
  { id: 'presentation', label: 'Presentation', url: null },
  { id: 'demo', label: 'Demo', url: null },
  { id: 'report', label: 'Report', url: null },
  {
    id: 'documentation',
    label: 'Documentation',
    url: 'https://github.com/grzegorzkibitz/vibecoding-project-tracker',
  },
];

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
    // Demo goal history (PRD DR-10): several goals, mixed outcomes.
    goals: [
      {
        id: 'seed-2-g1',
        prompt: 'The modal in TaskDialog.jsx does not close when I press Escape. Fix it.',
        tool: 'chatgpt',
        outcome: 'failed',
        notes: 'Added a keydown listener on window. Two listeners fought each other and the modal still stayed open.',
        createdAt: `${iso(-3)}T10:00:00.000Z`,
        updatedAt: `${iso(-3)}T10:20:00.000Z`,
      },
      {
        id: 'seed-2-g2',
        prompt:
          'We use Radix Dialog with shadcn. Escape works on the first open but not after editing a field. Here is TaskDialog.jsx: ... Why?',
        tool: 'claude',
        outcome: 'partial',
        notes: 'Found that a field stops the key event. Works for text inputs, still broken in the date picker.',
        createdAt: `${iso(-2)}T14:00:00.000Z`,
        updatedAt: `${iso(-2)}T14:45:00.000Z`,
      },
    ],
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
