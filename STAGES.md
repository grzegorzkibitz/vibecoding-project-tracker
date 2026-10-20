# Stages

Running record of what is done and what is next. Milestone numbers and tags come from PRD §9. Last updated 2026-10-20.

Legend: ✅ done · 🟡 partly done · ⬜ not started

## Milestones

| # | Tag | Title | Status | Notes |
|---|---|---|---|---|
| 1–2 | — | Setup + PRD review | 🟡 | PRD revised (goals, managed lists). Team names, GitHub handles, team identity and milestone owners are still `<TODO>`. |
| 3 | `design-done` | Design system (DESIGN.md) | ✅ | shadcn + tweakcn Graphite, accessibility overrides, tokens in `src/index.css`. Product name is still a placeholder. |
| 4 | `data-model` | Task model + board view | ✅ | Four-column board with seed tasks. Columns come from the managed lists. |
| 5 | `crud-modal` | Add / edit / delete modal | ✅ | "+ Task" button, edit on card click, delete with confirmation. Built, but not yet clicked through in a browser. |
| 6 | `tag-style` | Feature / bug colours | 🟡 | Stripe, icon and label on cards already work. Needs a visual check and a neutral style for team-added types. |
| 7 | `task-owner` | Owner indicator + handoff | ✅ | Owner dropdown on each card: changing it hands the task off and shows a Sonner toast "Handed off to {name}." with Undo. Changing the assignee in the task dialog shows the same toast. Not yet seen in a browser. |
| 8 | `due-tint` | Due-date colour tinting | ✅ | `src/lib/due.js` + `TaskCard`. Card wash, coloured icon and label ("Overdue 2d", "Due today", "Due tomorrow", "Due in 5d"); neutral in done columns. Counts calendar days (DESIGN.md §3 updated). 8 rule checks passed in a throwaway script. Not yet seen in a browser. |
| 9 | `context` | Goals on the task (prompt, tool, outcome) | ✅ | `GoalsEditor.jsx` inside the task dialog: add, edit, remove goals; prompt, AI tool, outcome (coloured badge), notes. Saved with the task; empty prompts are blocked. Cards show a goal count. Seed task "Fix modal closing on Esc" has 2 demo goals (shows only with fresh localStorage). Not yet seen in a browser. |
| 10 | `copy-prompt` | "Copy as Prompt Context" button | ✅ | Button in the task dialog; template in `src/lib/promptContext.js` (task details, description, goals oldest first with tool, date, prompt, notes, then a "What I need" ask). Copies unsaved edits too; skips goals with no prompt. Confirms with an announced message. Output checked in a throwaway script; not yet clicked in a browser. |
| 11 | `anchors` | Deliverable Anchor Board | ✅ | `AnchorBoard.jsx` above the board; sidebar "Deliverables" jumps to it. Four fixed slots: add, open (new tab), change, remove a link. Only http(s) links accepted; "example.com" gets https:// added. Stored in `vibetracker.anchors`. Seed: Documentation → the GitHub repo. URL rules checked in a throwaway script; not yet seen in a browser. |
| 12 | `secret-sauce` | The one differentiator | ⬜ | Open. Candidate: the Manage lists dialog. |
| 13 | `pitch-ready` | Demo + pitch rehearsal | ⬜ | Includes the Vercel deploy. |

## Beyond the PRD milestones

| Item | Status | Notes |
|---|---|---|
| Sidebar navigation (collapsible, landmarks, skip link) | ✅ | Landing view is the Kanban board. |
| Managed lists logic (`src/lib/lists.js`, `useLists`) | ✅ | Add, rename, reorder, remove, reset, with the PRD §7 rules. 13 checks passed in a throwaway Node script. No test files in the repo. |
| Multiple projects | ✅ | Sidebar switcher + "New project" + project settings (rename, delete with confirm; last one can't go). Each project has its own tasks, lists and links (`vibetracker.p.<id>.*`, index in `vibetracker.projects`). Old single-board data moves into "My project"; a fresh browser gets "Demo project" with seed data. Logic in `src/lib/projects.js` (22 checks passed in a throwaway script); app renders in Node; not yet clicked in a browser. PRD §1 and DR-11 updated. |
| Drag cards between columns | ✅ | dnd-kit. Mouse: grab anywhere on the card (6 px before a drag starts, so clicks still open it). Keyboard: drag handle, Space / ← → / Space, Escape cancels; each step announced. "Moved to {column}." toast with Undo. No reordering inside a column. Status dropdown in the dialog is the no-drag alternative (WCAG 2.5.7). Logic checked (8/8) and app renders in Node; drag not yet tried in a browser. |
| Manage lists dialog (UI) | ✅ | `ManageListsDialog.jsx`, opened from the sidebar. Tabs per list; add, rename, move up/down, remove (asks where to move tasks in use), "Done" flag on columns, reset to defaults. Build passes; not yet clicked through in a browser. |
| PROMPTS.md prompt log | ✅ | Every prompt is logged with date and model. |

## Next up

1. Run the dev server and click through M4–M11 and Manage lists (add, edit, move, delete, collapse the sidebar, remove a column in use, check the due colours, add and edit goals, copy and paste into an AI chat, add a deliverable link, hand off and undo, drag a card with the mouse and with the keyboard, create / switch / rename / delete a project).
2. M12 secret sauce (decide first).
3. M13 Vercel deploy + pitch.

## Open decisions

- Team names, GitHub handles, team name, tagline and milestone owners (PRD §8, §9, §11).
- Whether to ship an extra default column (e.g. "Idea") for intent-to-ship.
- What M12 secret-sauce is.
- GitHub OAuth + teams (asked for, then parked). Needs a server and database (e.g. Supabase) and clashes with the brief's "no registration for the assessor" (Assessment.txt) and PRD NFR-04/NFR-07. If done, keep a "Try the demo" entry with no login, and update the PRD.
- PRD mismatch: DR-05 lists Gemini and Google Antigravity as default AI tools, but §7 and the code don't. Pick one.
- Whether to add a real test setup (Vitest) to the repo.

## Housekeeping

- Nothing is committed yet. Work since commit `6399624` is uncommitted.
- Keep this file updated at the end of each piece of work.
