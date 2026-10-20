# Vibecoding Project Tracker — Design

**Status:** Draft for sign-off · design system settled on shadcn/ui + the tweakcn **Graphite** theme, with the accessibility fixes below.

---

## 1. Mood / vibe

Minimal, quiet and modern: a graphite-grey workspace where the tasks are the only things competing for attention.

Anti-references — what we are explicitly **not** trying to look like:

- Default Tailwind blue dashboards.
- Busy Jira-style boards with badges and colour everywhere.

## 2. Design system

- **Library:** shadcn/ui components (Button, Dialog, Input, Textarea, Select, Badge, Card, Label, Sonner toast, AlertDialog for delete confirm).
- **Theme:** tweakcn **Graphite** (`https://tweakcn.com/r/themes/graphite.json`), radius `0.35rem`, light mode only (see §7).
- **Tailwind:** stay on Tailwind 3 (already configured). Theme variables are mapped in `tailwind.config.js` as `var(--token)` directly, so opacity modifiers like `bg-primary/50` are not available. Use a separate token instead.

### Accessibility review of Graphite (light mode, WCAG 2.2 AA)

Ratios computed from the theme's OKLCH values.

| Pair | Ratio | Verdict |
|---|---|---|
| foreground on background | 11.1 | Pass |
| muted-foreground on background / card | 5.0 / 5.3 | Pass (barely) |
| muted-foreground on `muted` fill | **4.1** | **Fail** for 14 px text |
| primary-foreground on primary | 6.3 | Pass |
| primary button vs page (3:1 UI) | 5.5 | Pass |
| destructive on background | 4.5 | Borderline |
| **border vs background / card** | **1.35 / 1.41** | **Fail** (needs 3:1 for UI boundaries) |
| **input fill vs background** | **1.16** | **Fail** (field is almost invisible) |
| dark: muted-foreground on card | **4.1** | **Fail** |
| dark: white on destructive | **3.4** | **Fail** |

**Main criticisms for this app**

1. **It has no colour, but this app needs it.** Graphite is almost pure greyscale; the only tint is a barely-there teal. Our features (feature vs bug, due safe/warning/overdue) are *status colours*. We must add our own semantic colours, or the board turns into grey cards that can't be told apart.
2. **Low-contrast borders and inputs.** Cards sit on the page with a 1.4:1 edge. Form fields in the task modal are close to invisible. Fixed below.
3. **Muted text is the weakest link.** Dates, counts and captions use `muted-foreground`, which passes only on card/page, and fails on muted fills.
4. **`accent` (0.81) is heavy** for a hover colour and swallows borders. We use `secondary` for hover instead.
5. **Inconsistent font:** the light block specifies Montserrat while the theme block and dark mode say Inter. We pick Inter.
6. **Greys carry hierarchy; users with low vision lose it.** Never rely on colour alone (see rules).

### Overrides to the Graphite values

| Token | Graphite | Ours | Why |
|---|---|---|---|
| `border` | `oklch(0.8576 0 0)` | `oklch(0.70 0 0)` | ≥3:1 against page and card |
| `input` | `oklch(0.9067 0 0)` | `oklch(0.70 0 0)` | Visible field boundaries |
| `muted-foreground` | `oklch(0.5103 0 0)` | `oklch(0.45 0 0)` | Passes on muted fills too |
| `destructive` | `oklch(0.5594 0.19 25.86)` | `oklch(0.50 0.19 26)` | 6:1 on card |

Everything else stays exactly as in Graphite.

## 3. Colours

### Brand (all from Graphite)

| Token | Value | Where it shows up |
|---|---|---|
| `primary` | `oklch(0.4891 0 0)` | "+ Task" button, focus ring |
| `background` | `oklch(0.9551 0 0)` | Page |
| `card` | `oklch(0.9702 0 0)` | Cards, columns, modal |
| `foreground` | `oklch(0.3211 0 0)` | Body text |
| `muted-foreground` | `oklch(0.45 0 0)` | Captions, dates, counts |
| `secondary` | `oklch(0.9067 0 0)` | Column headers, hover |

### Task type (M6 `tag-style`)

| Token | Value | Contrast on card | Used for |
|---|---|---|---|
| `type-feature` | `oklch(0.46 0.06 196)` | 6.3 | Feature stripe + icon (Sparkles) |
| `type-bug` | `oklch(0.50 0.19 26)` | 6.1 | Bug stripe + icon (Bug) |

### Due-date states (M8 `due-tint`)

| Token | Value | Contrast on card | When used |
|---|---|---|---|
| `due-safe` | `oklch(0.46 0.11 150)` | 6.2 | More than 2 days out |
| `due-warning` | `oklch(0.50 0.11 70)` | 5.6 | Less than 24 hours |
| `due-overdue` | `oklch(0.50 0.19 26)` | 6.1 | Past due |
| `due-neutral` | `oklch(0.45 0 0)` | 5.3 | Done (overrides date) |

Colour is used for the text, stripe and icon of a state, never as the only signal. The tint is a pale background wash. Each state also carries a label ("Due today", "Overdue 2d") so it works in greyscale.

## 4. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Inter (semibold) | One family keeps it minimal; weight carries hierarchy. |
| Body | Inter | Highly legible at 14 px. |
| Monospace (tags, badges, code) | Fira Code | Graphite's mono; fits the vibecoding/prompt theme. |

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular, `muted-foreground` (never lighter)

## 5. Component principles

- **Cards:** Flat, 1 px `border`, no shadow except a soft one on hover; 4 px left stripe for task type.
- **Buttons:** Solid `primary` fill, no gradient, `rounded-md`, 40 px min height; secondary buttons are outlined.
- **Modal:** shadcn Dialog, centered, max-width-md, backdrop at 50% black, focus trapped, Esc closes.
- **Empty states:** Dashed border, muted text, never sad.
- **Drag affordance:** None. Status changes with a dropdown (keyboard accessible).
- **Focus:** 2 px `ring` offset 2 px on every interactive element. Never remove outlines.
- **Targets:** at least 24×24 px.

## 6. Voice / microcopy

| Where | Text |
|---|---|
| "+" button label | + Task |
| Empty column placeholder | Nothing here yet. |
| Toast after "Copy as Prompt Context" | Copied. Now paste it into the AI. |
| Confirm-delete message | Delete this task? You can't undo. |
| Handoff toast (M7 `task-owner`) | Handed off to {name}. |

## 7. Product name

- **Product name:** Vibe Tracker (placeholder until PRD §11 is filled)
- **Wordmark style:** The name in Inter semibold, `foreground` colour, no icon.

## 8. Out of scope (this hackathon)

- Dark mode toggle. Graphite's dark palette is not used and its issues above are not our problem; we ship light only.
- Multiple themes.
- Animations beyond a 200 ms fade on toasts (respect `prefers-reduced-motion`).
- Custom icon set. Use [Lucide](https://lucide.dev) (ships with shadcn).

---

*DESIGN.md version: hackathon-starter v1 · filled in for the Graphite theme*
