# Accessibility and UX Specification: Vibe Tracker

**Status:** Describes the app as built (M1–M10, drag and drop, multi-project, done confetti).
**Standard:** WCAG 2.2 Level AA (W3C, 2023).
**Related:** `PRD.md` (NFR-01, NFR-02, NFR-09, NFR-10), `DESIGN.md` §2–§6.

This document covers four things:

1. How the app is accessible.
2. The UX/UI patterns it uses.
3. How it hooks the user: triggers and actions.
4. How it rewards the user with visual feedback.

---

## 1. How the app is accessible

The main users this section protects are stakeholder **SH-06** (teammates who use a keyboard only, a screen reader, or have low vision or colour-blindness). Every rule below has a WCAG reference and the place in the code where it is met.

### 1.1 Perceivable

| What | How the app does it | WCAG | Where |
|---|---|---|---|
| Text contrast | All text is at least 4.5:1. The Graphite theme's muted text failed on grey fills (4.1:1), so `muted-foreground` was darkened to `oklch(0.45 0 0)`. | 1.4.3 | `src/index.css`, `DESIGN.md` §2 |
| UI boundaries | Borders and input edges were 1.35:1 in Graphite (almost invisible). They are now `oklch(0.70 0 0)`, at least 3:1 against page and card. | 1.4.11 | `src/index.css` |
| Status colours | Task type and due-date colours all reach 5.3–6.3:1 on the card. | 1.4.3 | `DESIGN.md` §3 |
| Colour is never the only signal | Every coloured state also has an **icon and a text label**: Feature uses Sparkles plus "Feature", Bug uses a Bug icon plus "Bug", and due dates show "Due in 3d", "Due today", "Overdue 2d" or "Done" with their own icon (calendar, clock, warning triangle, calendar-check). The board still makes sense in greyscale. | 1.4.1 | `TaskCard.jsx` `TYPE_STYLES`, `DUE_STYLES` |
| Decorative icons hidden | Every Lucide icon has `aria-hidden="true"`, so screen readers read the label, not "image". | 1.1.1 | All components |
| Icon-only buttons named | Buttons with only an icon have an `aria-label` that names the action and the target, e.g. "Move *Fix login bug* to another column", "Rename Feature", "Settings for *Demo project*". | 1.1.1, 4.1.2 | `TaskCard.jsx`, `ManageListsDialog.jsx`, `Sidebar.jsx` |
| Hidden context for screen readers | `sr-only` text adds what sighted users get from layout, e.g. "Tasks: 3" on column counts, "(opens in a new tab)" on external links, "(coming soon)" on disabled nav items. | 1.3.1 | `Board.jsx`, `AnchorBoard.jsx`, `Sidebar.jsx` |
| Dates are machine-readable | Due dates use `<time dateTime="YYYY-MM-DD">`. | 1.3.1 | `TaskCard.jsx` |
| Legible type | Inter at 14 px body and 12 px minimum for captions. Captions are never lighter than `muted-foreground`. | 1.4.4 | `DESIGN.md` §4 |

### 1.2 Operable

| What | How the app does it | WCAG | Where |
|---|---|---|---|
| Everything works with a keyboard | Every action (create, edit, move, hand off, delete, manage lists, switch project) uses a native button, select, input or link. | 2.1.1 | All components |
| Keyboard drag and drop | Each card has a **drag handle** button. Tab to it, press **Space** to pick up, **← / →** to choose a column, **Space** to drop, **Esc** to cancel. A custom coordinate getter jumps column to column instead of pixel by pixel. | 2.1.1 | `Board.jsx` `HandleKeyboardSensor`, `src/lib/dragColumns.js` |
| Two ways to move a card | Drag and drop is not the only option. The **Status** dropdown in the task dialog does the same job. Mouse drags have a 6 px threshold so a click still opens the card. | 2.5.7 (Dragging Movements) | `TaskDialog.jsx`, `Board.jsx` |
| Visible focus | Every focusable element shows a 2 px ring with a 2 px offset. Outlines are never removed. | 2.4.7, 2.4.11 | `src/index.css` `:focus-visible` |
| Skip link | "Skip to main content" is the first tab stop and jumps past the sidebar to the board. | 2.4.1 | `App.jsx` |
| Focus trapped in dialogs | Radix Dialog and AlertDialog trap focus, close on **Esc**, and return focus to the button that opened them. | 2.4.3 | `components/ui/dialog.jsx`, `alert-dialog.jsx` |
| Focus goes to the right place | Dialogs autofocus their first field. When saving fails, focus moves to the field with the error (title, or the first goal with no prompt). Inline edits (rename, link edit) autofocus and close on **Esc**. | 2.4.3, 3.3.1 | `TaskDialog.jsx`, `AnchorBoard.jsx`, `ManageListsDialog.jsx` |
| Tabs use arrow keys | The Manage Lists dialog is a proper ARIA tablist with arrow-key movement between tabs. | 2.1.1, 4.1.2 | `ManageListsDialog.jsx` |
| Target size | Interactive targets are at least 24×24 px (drag handle 28 px, buttons 40 px tall). | 2.5.8 | `DESIGN.md` §5 |
| Reduced motion | When the system asks for reduced motion, all CSS animations and transitions drop to 0.01 ms, and the done confetti does not fire at all. | 2.3.3 | `src/index.css`, `src/lib/celebrate.js` |
| No flashing | Nothing flashes. Confetti is a single short burst, well under 3 flashes per second. | 2.3.1 | `src/lib/celebrate.js` |

### 1.3 Understandable

| What | How the app does it | WCAG | Where |
|---|---|---|---|
| Every field has a label | Every input and select has a `<label htmlFor>`, visible in forms and `sr-only` where the layout shows it already (card owner select, inline rename). | 3.3.2, 1.3.1 | All forms |
| Clear error messages | Errors are plain sentences ("Give the task a title."), shown next to the field, linked with `aria-describedby`, flagged with `aria-invalid`, and announced with `role="alert"`. | 3.3.1, 3.3.3 | `TaskDialog.jsx`, `ProjectDialog.jsx`, `AnchorBoard.jsx`, `GoalsEditor.jsx` |
| Prevent mistakes | Deleting a task or project needs a confirmation dialog ("Delete this task? You can't undo."). Moves and handoffs can be undone from a toast. Removing a list item asks where its tasks should go first. Controls that would break the board are disabled with a reason ("A list cannot be empty"). | 3.3.4 | `TaskDialog.jsx`, `ProjectWorkspace.jsx`, `ManageListsDialog.jsx` |
| Consistent layout | One design system (shadcn/ui with Graphite tokens). Sidebar, header and board stay in the same place on every project. | 3.2.3, 3.2.4 | `DESIGN.md` |
| Plain English | Short labels and messages in one voice ("+ Task", "Nothing here yet.", "Handed off to Sam."). | 3.1.5 (AAA, best effort) | `DESIGN.md` §6 |

### 1.4 Robust

| What | How the app does it | WCAG | Where |
|---|---|---|---|
| Semantic HTML | Columns are `<section>`s labelled by their `<h2>`. Cards are `<li>`s in a `<ul>`. Navigation is `<nav aria-label="Main">`. The current page has `aria-current="page"`. | 1.3.1, 4.1.2 | `Board.jsx`, `Sidebar.jsx` |
| States exposed | `aria-expanded` on the sidebar toggle and goal accordions, `aria-selected` on tabs, `aria-haspopup="dialog"` on buttons that open dialogs, `aria-disabled` on "coming soon" items. | 4.1.2 | `Sidebar.jsx`, `GoalsEditor.jsx`, `ManageListsDialog.jsx` |
| Status messages announced | Drag and drop speaks every step: "Picked up *X*.", "*X* is over In Progress.", "Dropped *X* in Done.", "Cancelled. *X* did not move." Toasts (Sonner) use a polite live region. "Copied to clipboard" uses `aria-live="polite"`. | 4.1.3 | `Board.jsx` `accessibility`, `components/ui/sonner.jsx`, `TaskDialog.jsx` |
| No nested controls | The owner dropdown sits outside the card's main button, so there is never a control inside a control. | 4.1.2 | `TaskCard.jsx` |

### 1.5 Known gaps

These gaps are stated openly for the assessment:

- **Light mode only.** There is no dark theme. Graphite's dark palette failed contrast (`DESIGN.md` §2), so it was left out.
- **Confetti is visual only.** Screen-reader users get the same moment through the "Moved to Done." toast and the drop announcement, not through an extra sound or message.
- **Card order within a column is fixed.** Drag and drop changes the column, not the position within it.
- **Desktop first.** The app is tested at 1280 px and wider (NFR-08). Narrow screens scroll the board sideways.
- **No formal screen-reader audit yet.** Checks so far are code review and keyboard testing. A pass with NVDA (Windows) and an axe DevTools scan should be recorded as evidence.
- `DESIGN.md` §5 still says "Drag affordance: None". That predates drag and drop and should be updated.

---

## 2. UX/UI patterns

| Pattern | Where it's used | Why |
|---|---|---|
| **Kanban board** | Columns from the project's list settings; cards move left to right | A familiar mental model: progress is shown by position (recognition over recall, Nielsen heuristic 6). |
| **Card** | One task: type stripe, title, type, goal count, due state, owner, drag handle | Shows the key facts at a glance; details live in the dialog (progressive disclosure). |
| **Colour stripe + icon + label** | Task type (left stripe) and due state (wash, icon, text) | Scannable by colour, readable without it. |
| **Modal dialog** | New/edit task, project settings, manage lists | Keeps the user on the board; focus trap and Esc to close. |
| **Confirm dialog** | Delete task, delete project | Friction only where an action can't be undone. |
| **Toast with Undo** | Move, handoff | Lets actions happen instantly and safely, with no "are you sure?" for actions that can be reversed (Nielsen heuristic 3, user control and freedom). |
| **Inline edit** | Deliverable links, list item rename | Edit in place without a dialog; Enter saves, Esc cancels. |
| **Inline select** | Card owner ("hand off") | A one-step handoff straight from the board. |
| **Accordion** | Goals in the task dialog | Long prompt history stays tidy until needed. |
| **Tabs** | Manage Lists (columns / types) | Groups related settings in one dialog. |
| **Collapsible sidebar** | Navigation and project switcher | Gives the board more room; labels stay available to screen readers when collapsed. |
| **Friendly empty state** | Empty column: dashed box, "Nothing here yet." / "Drop here." | Shows where work can go, and changes during a drag to invite the drop. |
| **Drop-target highlight** | Column gets a `primary` outline while a card is over it | Clear feedback on where the card will land. |
| **Drag overlay** | A tilted copy of the card follows the pointer; the original fades to 40% | Shows what you're holding and where it came from. |
| **Copy as Prompt Context** | Task dialog | Turns a task into Markdown for an AI chat in one click, which is the app's main differentiator. |

**Design principles:** flat and minimal (greyscale base with colour kept for meaning), one font family (Inter, plus Fira Code for tags), 4 px radius, soft shadow only on hover, and short plain-English copy.

---

## 3. How the app hooks the user

The app follows the **Hook model** (Eyal, 2014): *trigger → action → reward → investment*. Each loop makes the next one more likely.

### 3.1 Triggers

**External triggers** (the app prompts the user):

| Trigger | What the user sees |
|---|---|
| Due-date wash | Cards turn pale green, amber or red as the due date nears, with "Due tomorrow" or "Overdue 2d". The board itself nags. |
| Handoff | A card shows up with *your* name on it after a teammate hands it off. |
| Empty column | "Nothing here yet." invites the first task. |
| "+ Task" button | Always in the header, the one solid primary button on the page. |
| Seed data | The demo project opens already filled, so a new user sees what a working board looks like. |

**Internal triggers** (the user's own need):

- "What should I work on next?" → open the board.
- "I need to give the AI context about this task" → Copy as Prompt Context.
- "I finished something" → drag it to Done (and get rewarded, see §4).

### 3.2 Actions

The Hook model says the action must be the **simplest thing that gets the reward**. The app keeps every main action to one or two steps:

| Action | Steps | Feedback time |
|---|---|---|
| Create a task | "+ Task" → type a title → Enter | Under 60 s for a first-time user (NFR-03) |
| Move a task | Drag card to a column (or Space, arrow, Space) | Instant (< 0.1 s, NFR-05) |
| Hand off a task | Pick a name in the card's owner dropdown | Instant, with toast |
| Copy context for AI | Open card → "Copy as Prompt Context" | Instant, with "Copied" message and check icon |
| Undo a mistake | "Undo" on the toast | Instant |

No login, no install, no loading spinners: data lives in `localStorage`, so every action is local and immediate (NFR-04, NFR-05, NFR-07).

### 3.3 Investment

Each use leaves something behind that makes the app more valuable next time, and harder to leave:

- Tasks, goals and **prompt history** build up per task, which becomes a record of how the work was done with AI.
- Custom columns and task types shape the board to the team's own workflow.
- Deliverable links (repo, design, docs) make the board the team's home page.
- Multiple projects keep everything in one place.

---

## 4. Rewarding the user with visual feedback

Rewards are small, fast and tied to real progress. None of them rely on sound, and none of them block the user.

| Moment | Visual reward | Accessible equivalent |
|---|---|---|
| **Card moved to Done** | A **confetti burst** (120 pieces, about 1 s) from the lower middle of the screen. Fires from drag and drop or from changing status in the dialog, only when moving *into* a done column from an open one. | Toast "Moved to Done." plus the screen-reader announcement "Dropped *X* in Done." Skipped for reduced-motion users. |
| **Card is done** | The due-date wash clears to plain card, and the date turns neutral with a calendar-check icon and the label "Done". Overdue stress goes away. | Label text "Done". |
| **Any move** | Column outlines on hover-over, the card snaps into its new column, and the count badge updates. | Live announcements at each step. |
| **Handoff** | Toast "Handed off to *name*." with Undo. | Polite live region. |
| **Copy as Prompt Context** | The clipboard icon turns into a check, and "Copied to clipboard. Paste it into your AI tool." appears. | `aria-live="polite"` message. |
| **Board progress** | Done column fills up and counts rise, a visible record of the team's progress. | Column counts read as "Tasks: *n*". |

**Why the confetti is limited:**

- **Earned, not random.** It marks finishing work, so the reward reinforces the behaviour the team wants: closing tasks.
- **Only on a real change.** It doesn't fire for done → done moves or for a task created straight into Done, so it stays meaningful.
- **Safe.** It is short, does not flash, and respects `prefers-reduced-motion` (WCAG 2.3.3).
- **Never the only feedback.** The toast and live announcement carry the same message for everyone.

---

## References

- Eyal, N. (2014) *Hooked: How to Build Habit-Forming Products*. London: Penguin.
- Nielsen, J. (1993) *Usability Engineering*. San Francisco: Morgan Kaufmann.
- Nielsen, J. (1994) *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*. Available at: https://www.w3.org/TR/WCAG22/
- W3C (2024) *ARIA Authoring Practices Guide*. Available at: https://www.w3.org/WAI/ARIA/apg/
