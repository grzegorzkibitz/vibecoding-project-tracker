# Vibecoding Project Tracker — PRD

**Status:** Hackathon starter PRD · review and fill in the **`<TODO>`** sections before you tag `prd-done`.

---

## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A tool that tracks a vibecoding project from intent to ship. A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through the board's columns (four by default).
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries a list of **goals**. A goal records one prompt, the AI tool used, and the outcome. Any teammate can click a button and copy the task + its goal history back into an AI chat to continue work.

Every list in the app (columns, task types, AI tools, goal outcomes) ships with sensible defaults for every team, and the team can add, rename, reorder and remove entries (see §7).

## 4. Primary user flow

1. Open the Webapp. The board loads from local storage.
2. Click "+" to add a task. Fill in title, type, assignee, due date.
3. Move the task across columns as you work.
4. Add a goal to the task: the prompt you used, the AI tool, and the outcome. Update the outcome when you know how it went.
5. When stuck, click "Copy as Prompt Context" on a task and paste the task + goal history into Claude/ChatGPT/Cursor to continue.
6. Hand off a task to a teammate with one dropdown.
7. Drop final deliverable links into the Anchor Board as you produce them.
8. Open "Manage lists" to add, rename, reorder or remove columns, task types, AI tools and outcomes.

## 5. Data model

Locked. Do not change without team agreement. *(Revised: goals added, and fixed unions replaced with team-managed lists, see §7.)*

```js
// A single vibecoding task.
Task = {
  id: string,                    // uuid or timestamp string
  title: string,
  description: string,
  type: string,                  // id of an entry in lists.types (default: 'feature' | 'bug')
  status: string,                // id of an entry in lists.columns (default: 'todo' | 'in-progress' | 'review' | 'done')
  assignee: string,              // one of the three teammate names from §8
  dueDate: string | null,        // ISO date 'YYYY-MM-DD'
  createdDate: string,           // ISO date 'YYYY-MM-DD'

  // Added in later milestones:
  goals: Goal[],                 // M9 — history of prompts tried on this task, newest last
}

// One attempt at a task: the prompt, the AI tool, and how it went.
Goal = {
  id: string,
  prompt: string,                // the prompt that was (or will be) used
  tool: string,                  // id of an entry in lists.tools
  outcome: string,               // id of an entry in lists.outcomes
  notes: string,                 // what happened / what to try next
  createdAt: string,             // ISO timestamp, set automatically
  updatedAt: string,             // ISO timestamp, set automatically on save
}

// An entry in one of the team-managed lists (§7). Same shape for every list.
ListItem = {
  id: string,                    // stable; never changes when the label is renamed
  label: string,                 // shown in the UI; editable
  isDone?: boolean,              // columns only: tasks here count as complete (due-tint goes neutral)
}

// All team-managed lists, stored in one localStorage key.
lists = {
  columns:  ListItem[],          // order = left-to-right on the board
  types:    ListItem[],
  tools:    ListItem[],
  outcomes: ListItem[],
}

// One of four pinned deliverable slots.
Anchor = {
  id: 'presentation' | 'demo' | 'report' | 'documentation',
  label: string,                 // human-readable
  url: string | null,            // the link the team pastes in
}
```

## 6. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React (via Vite) | What the scaffold ships with. Don't migrate. |
| Styling | Tailwind | Already configured. Use utility classes; no separate CSS files. |
| State | React `useState` + a `useLocalStorage` hook | Simple, no library needed. |
| Persistence | **localStorage** | Zero infra. Pick this. Do not switch to a backend mid-hackathon. |
| Deploy | Vercel | One-click deploy from GitHub. |

> **Decision:** localStorage, not a shared backend. If you want a shared backend later, that's M14 — out of scope for the hackathon.

## 7. Managed lists and defaults

Columns, task types, AI tools and goal outcomes are **lists**. Every team starts with the defaults below, and can manage each list from a "Manage lists" dialog: add, rename, reorder and remove entries.

| List | Defaults (in order) | Notes |
|---|---|---|
| **Columns** | **To Do** (`todo`), **In Progress** (`in-progress`), **Review** (`review`), **Done** (`done`, `isDone`) | These are the board's four columns. A team can add more, e.g. an "Idea" column before To Do or "Shipped" after Done. At least one column must be marked `isDone`. |
| **Task types** | **Feature** (`feature`), **Bug** (`bug`) | Each type gets a stripe colour and icon (M6). New types fall back to a neutral style. |
| **AI tools** | Claude, ChatGPT, Cursor, Lovable, Replit, Other | Used by `Goal.tool`. |
| **Outcomes** | **Pending**, **Worked**, **Partial**, **Failed** | Used by `Goal.outcome`. New goals start as Pending. |

Rules:

- Entries are referenced by `id`, so renaming a label never breaks existing tasks or goals.
- Removing an entry that is in use asks which entry to move those tasks/goals to first. Never delete data silently.
- A list can never be empty. The last remaining entry cannot be removed.
- "Reset to defaults" restores a list. It follows the same move-on-remove rule for items in use.
- Lists live in `localStorage` (`vibetracker.lists`) next to the tasks.

## 8. Team

Fill these in before tagging `prd-done`:

| Slot | Name | GitHub handle |
|---|---|---|
| Teammate A | `<TODO>` | `<TODO>` |
| Teammate B | `<TODO>` | `<TODO>` |
| Teammate C | `<TODO>` | `<TODO>` |

These three names become the **only** allowed values for `Task.assignee`. No auth — just a dropdown.

## 9. Milestone ownership

Fill in the owner column. Recommended default in **bold**; change if your team has different strengths.

| # | Tag | Title | Suggested owner | Final owner |
|---|---|---|---|---|
| 3 | `design-done` | Design system + voice (DESIGN.md) | **B** | `<TODO>` |
| 4 | `data-model` | Task model + board view | **A** | `<TODO>` |
| 5 | `crud-modal` | Add / edit / delete modal | **A** | `<TODO>` |
| 6 | `tag-style` | Feature / bug colors | **B** | `<TODO>` |
| 7 | `task-owner` | Owner indicator + handoff | **A** | `<TODO>` |
| 8 | `due-tint` | Due-date color tinting | **B** | `<TODO>` |
| 9 | `context` | Goals on the task modal (prompt, tool, outcome) | **C** | `<TODO>` |
| 10 | `copy-prompt` | "Copy as Prompt Context" button (task + goal history) | **C** | `<TODO>` |
| 11 | `anchors` | Deliverable Anchor Board | **B** | `<TODO>` |
| 12 | `secret-sauce` | The one thing that makes it yours (candidate: the Manage lists dialog) | **C / All** | `<TODO>` |
| 13 | `pitch-ready` | Demo + pitch rehearsal | **All** | `<TODO>` |


Track A owns the state model and task ownership. Track B owns the visuals (and design — M3 runs parallel to M2 so the team starts Phase 3 with the palette already chosen). Track C owns the differentiator features (M9 + M10 — the goals and the Copy-as-Prompt button) and usually leads on M12 secret-sauce. Put your strongest prompter on Track C.

**Dependency note.** M3 (`design-done`) runs **in parallel with M2** — Person B drafts DESIGN.md and pastes the colors into `tailwind.config.js` while the rest of the team reviews the PRD. M6 / M7 / M8 / M11 all depend on M4 + M5 being done first. While Person A builds M4+M5 (first ~60 min of Phase 3), Person C should draft the Markdown template for the "Copy as Prompt Context" output (M10). M12 `secret-sauce` is open-ended — pick whatever makes the tracker uniquely yours; constraint is "must be visible in the demo and must not break anything else."

## 10. AI / vibe coding angle

Where AI will be heavily used:
- M4, M5: scaffold the board and the modal from a single prompt each.
- M9, M10: write the Markdown serialization helper for a task and its goals.
- M7: animation polish for the handoff toast.

Where AI will **not** save you time:
- M2 (this PRD review) — read it yourself.
- M3 (DESIGN.md) — design taste is yours, not the model's.
- M12 (secret-sauce) — the whole point is that AI can't predict it.
- M13 (pitch) — write the script in your own voice.

Keep the goals of each real task up to date as you work: log each prompt, the tool, and how it went. By the end of the hackathon you should have a handful of curated goal histories — those become part of your Module 5 "Vibe Coding History" deliverable.

## 11. Team identity

Fill in:

- **Team name:** `<TODO>`
- **Tagline (one sentence):** `<TODO>`
- **Tracker URL after deploy:** `<TODO>` (Vercel will give it to you)

## 12. Out of scope (do not build)

- Authentication / accounts.
- Real GitHub integration.
- A real backend / shared database.
- Mobile responsive — desktop only is fine.
- Multi-team support.
- Real-time collaboration.

## 13. Definition of done

The hackathon is "done" when all 13 milestone tags are pushed to your repo and visible on the dashboard. The pitch is "done" when:

- The board loads on Vercel without errors.
- The "Copy as Prompt Context" demo works on stage.
- 5 min pitch is rehearsed.

---

*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
