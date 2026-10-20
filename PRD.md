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

*(Added 2026-10-20: **multiple projects**.)* A user can create several projects and switch between them from the sidebar. Each project has its own tasks, deliverable links and lists; a new project starts from the defaults (§7). A fresh browser opens one "Demo project" with the seed data.

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

# Part 1: Requirements

Sections 14–18 hold the requirements for the CM6312/CM6812 assessment (Part 1). Every requirement has a unique ID so the prototype and report can trace back to it.

**Priority** uses MoSCoW (Must / Should / Could / Won't). **MVP** = every *Must*. Non-MVP requirements are still built in the prototype; they are just lower priority.

**Source key** (where each requirement came from):

| Code | Source |
|---|---|
| S1 | Assessment brief (module leader as client) |
| S2 | Hackathon PRD (this document, §1–§13) |
| S3 | Team meetings and hackathon discussion |
| S4 | Competitor review (Trello, Jira, Linear, Notion) |
| S5 | Persona (§15) |
| S6 | Standards: WCAG 2.2, ISO/IEC 25010, UK GDPR |
| S7 | Design review (`DESIGN.md`) |

> `<TODO>` Add dates and attendees of client/team sessions to an elicitation log (report appendix) so each source can be evidenced.

## 14. Stakeholders

Identified using the onion model (Alexander, 2005), working outwards from the product, then prioritised on a power/interest grid (Mendelow, 1991).

| ID | Stakeholder | Onion layer | Interest | Influence | Description | Why included |
|---|---|---|---|---|---|---|
| SH-01 | Student team members (vibecoders) | The system (normal operators) | High | Medium | MSc students on a 3-person team who build software mainly by prompting AI tools. They add, move and complete tasks and log the prompts they use. | Primary users. The two problems the product solves (lost tasks, lost prompts) are theirs. Every core requirement comes from their workflow. |
| SH-02 | Team lead / coordinator | The system (operator) | High | High | The teammate who splits the work, hands tasks off and watches deadlines and deliverables. | Needs an overview the others don't: ownership, due dates, deliverables. Drives handoff, due-date tinting and the Anchor Board. |
| SH-03 | Module leader and lecturers | Containing system (client, assessor) | High | High | Set the brief, act as the client and mark the deliverables. | They define what "done" means. Their requirements (no login, working link, four deliverables) are non-negotiable. |
| SH-04 | Teaching assistants / hackathon facilitators | Containing system | Medium | Medium | Support teams during the hackathon and drop-ins. | Benefit from seeing a team's progress at a glance; shape the need for a clear, readable board. |
| SH-05 | Future cohorts | Containing system (future users) | Medium | Low | Students taking the module in later years. | Named in §2. The tool must work for a new team with no setup, which drives managed lists and sensible defaults. |
| SH-06 | Users with accessibility needs | The system (subset of SH-01/02) | High | Low | Teammates who use a keyboard only, a screen reader, or have low vision or colour-blindness. | Easily forgotten, and a greyscale theme with colour-coded status puts them at risk. Drives the WCAG requirements. |
| SH-07 | AI tool providers (Anthropic, Google, OpenAI, Cursor etc.) | Wider environment | Low | Medium | Makers of the tools whose prompts are tracked. | Their tools and input formats decide the AI tool list and the "Copy as Prompt Context" output. |
| SH-08 | Cardiff University (IT and data protection) | Wider environment | Low | High | Sets rules on hosting, accounts and personal data. | Drives the decision to keep data in the browser and avoid accounts. |
| SH-09 | Hosting provider (Vercel) | Wider environment | Low | Medium | Hosts the deployed prototype. | The prototype link must be public and free to open. |

**Power/interest summary:** manage closely SH-02, SH-03 · keep satisfied SH-08 · keep informed SH-01, SH-04, SH-06 · monitor SH-05, SH-07, SH-09.

SH-01 and SH-06 have low formal power but are the people who use the tool every day, so their needs are weighted up in the requirements.

## 15. Persona

Based on the primary stakeholder SH-01 (student vibecoder). Built from team discussion and our own experience as the target users (S3), following Pruitt and Adlin (2006).

> `<TODO>` Add a photo or illustration and credit its source. Replace details with anything learned in client/team interviews.

### Maya Okafor, "the prompt-first builder"

| | |
|---|---|
| **Age** | 26 |
| **Course** | MSc Computing (conversion), Cardiff University |
| **Background** | Marketing graduate; three years in a digital agency before the MSc |
| **Team role** | One of three teammates on the module project; often ends up as informal coordinator |
| **Devices** | Laptop (Windows) at home and in labs; phone for messages only |
| **Tech skills** | Confident with web apps and spreadsheets; beginner at code; strong at prompting |
| **AI tools** | Claude daily, ChatGPT for quick questions, tries Gemini and Antigravity in class |

> *"The AI wrote it perfectly on Tuesday. Now none of us can remember what we asked it."*

**Bio.** Maya switched careers to move into tech product roles. She can read code but rarely writes it from scratch; she describes what she wants and iterates with AI tools. Her team works in short bursts between lectures, mostly from separate laptops, and keeps tasks in a group chat and a shared spreadsheet that nobody updates.

**Goals**
- See what every teammate is working on and what's left, in one place.
- Keep the prompts that worked, so she can reuse or improve them instead of starting again.
- Hand a task to a teammate without a long explanation.
- Hit the four module deadlines without a last-night panic.

**Frustrations**
- Tasks get lost in chat threads; two people end up doing the same thing.
- A prompt that produced working code is gone after the AI chat is closed.
- Tools like Jira feel heavy and take longer to set up than the task itself.
- Low-contrast, colour-only interfaces are tiring when she works late.

**Behaviours**
- Works in 30–60 minute sessions, switching between the AI chat and the code.
- Copies and pastes a lot between tools.
- Checks deadlines only when someone mentions them.
- Uses the keyboard heavily; dislikes fiddly drag-and-drop.

**Motivations:** learning fast, a strong module grade, a portfolio project she can show employers.

**Scenario.** On Wednesday evening Maya opens the team board. A red "Overdue 1d" label shows that the login bug is late. She opens it, sees two earlier goals marked *Failed* and *Partial*, clicks **Copy as Prompt Context** and pastes the whole history into Claude, which suggests a fix that works. She logs a new goal marked *Worked*, moves the card to Review and hands it to her teammate, who gets a "Handed off to Sam" confirmation.

**Requirements this persona drives:** FR-02, FR-05, FR-06, FR-07, FR-08, FR-10, FR-11, FR-12, NFR-02, NFR-03, NFR-09.

## 16. Functional requirements

What the system shall do. Milestone = PRD §9 milestone that builds it.

| ID | The system shall… | Priority | MVP | Source | Milestone | Justification |
|---|---|---|---|---|---|---|
| FR-01 | display tasks as cards in columns on a Kanban board, with the default columns To Do, In Progress, Review and Done. | Must | ✅ | S2, S4 | M4 | The board is the shared view that solves "losing track of tasks". Kanban makes work-in-progress visible (Anderson, 2010). |
| FR-02 | let a user create a task with a title, description, type, assignee and due date. | Must | ✅ | S2, S5 | M5 | Without creating tasks there is nothing to track. These fields answer what, who and when. |
| FR-03 | let a user edit any field of an existing task. | Must | ✅ | S2 | M5 | Tasks change as work progresses; stale tasks make the board untrustworthy. |
| FR-04 | let a user delete a task, after asking for confirmation. | Must | ✅ | S2, S7 | M5 | Removes obsolete work. Confirmation prevents accidental loss (error prevention). |
| FR-05 | let a user move a task to another column using a keyboard-accessible control. | Must | ✅ | S2, S6 | M4/M5 | Moving through columns is how progress is shown. A dropdown works for keyboard and screen-reader users, unlike drag-and-drop. |
| FR-06 | let a user add goals to a task, each recording a prompt, the AI tool used, an outcome and notes. | Must | ✅ | S2, S5 | M9 | Solves the second core problem, "losing track of prompts". This is what no competitor offers (S4). |
| FR-07 | let a user edit a goal, including changing its outcome (Pending, Worked, Partial, Failed). | Must | ✅ | S2 | M9 | Outcomes are only known after trying the prompt; a goal must be updatable to be useful. |
| FR-08 | copy a task and its full goal history to the clipboard as Markdown, with one click, and confirm with a message. | Must | ✅ | S2, S5 | M10 | Lets a user resume work in any AI tool with full context, instead of rewriting the history from memory. |
| FR-09 | show each task's type on its card with a colour stripe, an icon and a text label. | Should | | S2, S7 | M6 | Lets users scan features vs bugs quickly; icon and label mean colour isn't the only signal. |
| FR-10 | show the assignee on each card and let a user hand a task to another teammate, with a confirmation message. | Should | | S2, S5 | M7 | Makes ownership clear and handoff fast, which reduces duplicated work. |
| FR-11 | colour and label each card's due date by state: due later, due soon (under 24 h), overdue, or done. | Should | | S2, S5 | M8 | Deadlines are missed when nobody looks at them; tinting draws attention without opening the card. |
| FR-12 | provide an Anchor Board with four slots (Presentation, Demo, Report, Documentation) where users can add, open and change a link. | Should | | S1, S2 | M11 | The module has four final deliverables; keeping their links next to the board avoids hunting through chats and drives. |
| FR-13 | let the team add, rename, reorder and remove entries in the columns, task types, AI tools and outcomes lists. | Could | | S2, S3 | M12 | Every team works differently, and new AI tools appear quickly. Defaults work out of the box; editing makes the tool fit the team. |
| FR-14 | before removing a list entry that is in use, ask which entry to move the affected tasks or goals to. | Could | | S2 | M12 | Removing a column must never silently delete or orphan tasks. |
| FR-15 | let the team reset any list to its defaults. | Could | | S2 | M12 | A safe way back after experimenting (user control and freedom). |
| FR-16 | let a user reset the board to the demo data. | Could | | S1 | — | The assessor can explore and edit freely, then return to the complete example. |

**Won't (this version):** user accounts, real-time sync between devices, GitHub integration, mobile layout (see §12). These are excluded on purpose to keep the product zero-setup and to fit the hackathon timeframe.

## 17. Non-functional requirements

How well the system shall do it. Categorised by the ISO/IEC 25010 quality model.

| ID | Requirement | ISO 25010 | Priority | MVP | Source | Justification |
|---|---|---|---|---|---|---|
| NFR-01 | Text shall have a contrast ratio of at least 4.5:1, and UI boundaries (borders, inputs, focus rings) at least 3:1, against their background (WCAG 2.2 AA). | Usability (accessibility) | Must | ✅ | S6, S7 | The Graphite theme failed these checks (`DESIGN.md` §2). Readable text matters for SH-06 and for everyone working late. |
| NFR-02 | Every function shall be usable with the keyboard alone, with a visible focus indicator on every interactive element. | Usability (accessibility) | Must | ✅ | S5, S6 | Keyboard users (SH-06) and power users like Maya must not be blocked. |
| NFR-03 | A first-time user shall be able to create a task within 60 seconds without instructions. | Usability (learnability) | Must | ✅ | S1, S5 | The assessor and new teammates arrive with no training; heavy tools were a key frustration (S4). |
| NFR-04 | The prototype shall open from a public URL with no login, registration, subscription or install. | Portability / compatibility | Must | ✅ | S1 | Required by the brief. Also matches the zero-setup goal. |
| NFR-05 | The board shall load in under 2 seconds on a typical university connection, and actions shall give visible feedback within 0.1 seconds. | Performance efficiency | Must | ✅ | S3 | 0.1 s feels instant and 1 s keeps the user's flow (Nielsen, 1993). Slow tools get abandoned. |
| NFR-06 | No data shall be lost when the page is refreshed or the browser is closed, and nothing shall be deleted without confirmation. | Reliability | Must | ✅ | S2 | Users must trust the board, or they fall back to chat and spreadsheets. |
| NFR-07 | All data shall stay in the user's browser; nothing shall be sent to a server or third party. | Security (confidentiality) | Must | ✅ | S6, SH-08 | Avoids handling personal data (names) on a server under UK GDPR, and removes the need for accounts. |
| NFR-08 | The prototype shall work on current versions of Chrome, Edge and Firefox on desktop screens 1280 px wide or more. | Compatibility | Must | ✅ | S1, S3 | Covers lab machines and student laptops, and whatever browser the assessor uses. |
| NFR-09 | Colour shall never be the only way information is shown; every colour-coded state shall also have an icon or text label. | Usability (accessibility) | Should | | S6, S7 | About 1 in 12 men are colour-blind; WCAG 1.4.1 (Use of Colour). |
| NFR-10 | Animations shall be limited to short fades (≤ 200 ms) and turned off when the user's system requests reduced motion. | Usability (accessibility) | Should | | S6, S7 | Motion can cause discomfort; WCAG 2.3.3. |
| NFR-11 | The interface shall use one design system (shadcn/ui with the Graphite theme and our token overrides) for all components. | Usability (consistency) / maintainability | Should | | S7 | Consistent components are easier to learn (Nielsen heuristic 4), and tokens make later changes quick. |
| NFR-12 | Labels and messages shall be short, plain English, following the voice in `DESIGN.md` §6. | Usability (operability) | Could | | S7 | Clear microcopy reduces mistakes and suits a minimal interface. |

## 18. Data requirements

What data the system needs, why, and where it comes from. All data is stored in the browser's `localStorage` (DR-11).

| ID | Data | Details | Why needed | Where it comes from | Priority | MVP |
|---|---|---|---|---|---|---|
| DR-01 | Task | id, title, description, type, status, assignee, due date, created date (§5 `Task`) | The core record behind every card (FR-01 to FR-05). | Entered by users in the task dialog. id and created date are generated. | Must | ✅ |
| DR-02 | Goal | id, prompt, AI tool, outcome, notes, created and updated timestamps (§5 `Goal`), stored on its task | Records prompt history (FR-06 to FR-08), the product's main differentiator. | Prompts copied by users from their AI tool chats; outcome and notes typed by users; timestamps generated. | Must | ✅ |
| DR-03 | Team members | The three teammate names | The only allowed assignees (FR-02, FR-10); there are no accounts. | Provided by the team (§8). | Must | ✅ |
| DR-04 | Columns list | id, label, and which column counts as done | Defines the board's stages (FR-01, FR-05) and when due tinting turns neutral (FR-11). | Defaults from common Kanban practice (Anderson, 2010) and the client (§7); then edited by the team (FR-13). | Must | ✅ |
| DR-05 | AI tools list | id, label | Recorded on each goal so the team can see which tool worked (FR-06). | Defaults: tools named in the brief (Claude, Gemini, Google Antigravity) plus a scan of popular tools (ChatGPT, Cursor, Lovable, Replit) and "Other"; editable by the team. | Must | ✅ |
| DR-06 | Outcomes list | id, label (Pending, Worked, Partial, Failed) | Shows which prompts succeeded (FR-07). | Agreed in team discussion (S3); editable by the team. | Must | ✅ |
| DR-07 | Task types list | id, label (Feature, Bug) | Visual sorting of tasks (FR-09). | Client/team defaults (§7); editable by the team. | Should | |
| DR-08 | Deliverable anchors | id, label, URL for Presentation, Demo, Report, Documentation (§5 `Anchor`) | Powers the Anchor Board (FR-12). | Slot names from the module brief; URLs pasted by the team. | Should | |
| DR-09 | Due-date rules | Thresholds: overdue (past), due soon (< 24 h), due later (> 2 days), done (neutral) | Decides each card's tint and label (FR-11). | Agreed in team discussion; colours from `DESIGN.md` §3. | Should | |
| DR-10 | Demo seed data | Example tasks across every column, with at least one task holding several goals and mixed outcomes, and at least one anchor link | Lets the assessor and new users see every feature working on first open (FR-16). | Written by the team from the real prompt log (`PROMPTS.md`). | Must | ✅ |
| DR-11 | Storage | Browser `localStorage`, keys prefixed `vibetracker.`: a project index (`vibetracker.projects`) plus tasks, lists and anchors per project (`vibetracker.p.<id>.tasks` etc.); kept until the user clears it or resets | Persistence without a server or accounts (NFR-06, NFR-07). | Created and read by the app in the user's browser. | Must | ✅ |

**Privacy note.** The only personal data is teammate names, plus anything users type into tasks and prompts. Keeping it on the user's own device means no personal data is collected or processed by a server, in line with UK GDPR and the Data Protection Act 2018 principle of data minimisation. Users are told not to paste secrets (API keys, passwords) into prompts.

## References (Part 1)

- Alexander, I. (2005) 'A taxonomy of stakeholders: human roles in system development', *International Journal of Technology and Human Interaction*, 1(1), pp. 23–59.
- Anderson, D.J. (2010) *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
- Clegg, D. and Barker, R. (1994) *Case Method Fast-Track: A RAD Approach*. Addison-Wesley.
- ISO/IEC 25010 *Systems and software Quality Requirements and Evaluation (SQuaRE): Product quality model*.
- Mendelow, A. (1991) 'Stakeholder mapping', *Proceedings of the 2nd International Conference on Information Systems*, Cambridge, MA.
- Nielsen, J. (1993) *Usability Engineering*. Academic Press.
- Pruitt, J. and Adlin, T. (2006) *The Persona Lifecycle*. Morgan Kaufmann.
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*.

---

*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
