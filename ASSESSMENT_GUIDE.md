# Assessment Guide: CM6312 / CM6812 Requirements and Prototyping

A step-by-step plan for turning this project (Vibe Tracker) into a top-grade submission (80%+). Built from `Assessment.txt`. Last updated 2026-10-20.

Work through the sections in order and tick boxes as you go.

---

## 0. The brief at a glance

### What you submit (3 items, via Learning Central)

| # | Item | Format | Name | Notes |
|---|---|---|---|---|
| 1 | Coversheet | PDF | `Coversheet.pdf` | Fill in the Coversheet form first. |
| 2 | Report | PDF | `Firstname Surname-2.pdf` | Max **2,000 words**. |
| 3 | Interactive prototype | Link (or APK) | — | Must open with **no login, registration or subscription**. |

Getting the files, names or count wrong can score **zero**. After submitting, download your files from the submission point and check they open and are the right ones.

### Where the marks are

The assessment is worth 50% of the module. Inside the assessment, the weights double:

| Section | Module % | Share of this assessment | Words (suggested) |
|---|---|---|---|
| Stakeholders | 3% | 6% | ~200 |
| Persona | 7% | **14%** | ~150 (+ persona figure) |
| Functional requirements | 5% | 10% | ~200 (+ table) |
| Non-functional requirements | 5% | 10% | ~200 (+ table) |
| Data requirements | 5% | 10% | ~200 (+ table) |
| Medium-fidelity prototype | 20% | **40%** | ~700 (+ screenshots, traceability table) |
| Hackathon participation | 5% | 10% | 0 (attendance) |
| Intro, elicitation, AI tools, conclusion | — | (supports every section) | ~350 |

**Priorities:** the prototype (40%) and the persona (14%) are the biggest single items. Elicitation isn't a scored heading, but the top band's first criterion is "excellent explanations of all the requirements elicitation", so it lifts every Part 1 mark.

### The two rules that decide the top band

1. **Every requirement you list must be built and clickable in the prototype, including the non-MVP ones.** ("Fully clickable and complete digital prototype with all the requirements (including the non-MVP) justified and included.") So "non-MVP" means *lower priority*, not *left out*. Don't list a requirement you won't build.
2. **Every feature in the prototype must trace back to a requirement, or be justified as an extra.** ("No excess requirements that are unjustified.") The collapsible sidebar, the Manage lists dialog and anything else you add need either a requirement ID or a written reason.

And for 80%+, in **both** parts: go beyond the lecture slides. Cite related work you found yourself, and use it in context, not as a list at the end.

---

## 1. Before you write: things to collect now

- [ ] **Confirm the topic.** The brief says you get a topic in class. Check with the module leader that Vibe Tracker is acceptable, or how it fits the given topic.
- [ ] **Elicitation evidence.** Notes from every client/stakeholder conversation (team meetings, one-to-ones, the lecturer acting as client). Date, who, what technique, what you learned. These go in an appendix and are the raw material for "excellent explanations of elicitation".
- [ ] **Hackathon evidence.** Attend the full Week 3 day (5% is for attendance and active participation). Keep `PROMPTS.md`, git commits and milestone tags as proof of what you did.
- [ ] **AI tool log.** `PROMPTS.md` already records each prompt, date and model. You must say in the report which AI tools you used and how. This file is your source.
- [ ] **Check the AI guidance for the report.** The brief says the written report "remains subject to the general AI guidance in this document", but that section isn't in `Assessment.txt`. Find it on Learning Central. Assume you must write the report yourself unless it says otherwise.
- [ ] **Ask the module leader:** do tables, figure captions, references and appendices count towards the 2,000 words? This changes how much you can put in tables.
- [ ] **Attend the opt-in one-to-ones.** The brief says engagement time correlates strongly with grade.

---

## 2. Report structure

Use these headings. They mirror the marking scheme, which makes marking easy.

1. Introduction (problem, client, scope): ~100 words
2. Requirements elicitation (techniques used and why): ~150 words
3. **Part 1: Requirements**
   1. Stakeholders
   2. Persona
   3. Functional requirements
   4. Non-functional requirements
   5. Data requirements
4. **Part 2: Prototyping**
   1. Prototype link and how to use it
   2. Tools and AI use
   3. Fidelity choice
   4. Requirements-to-feature traceability
   5. Screens, interaction and UX principles (with screenshots)
   6. Features beyond the requirements (justified)
   7. Evaluation and iteration (optional, but a strong 80%+ signal)
5. Conclusion and limitations: ~80 words
6. References (Harvard)
7. Appendices: elicitation notes, prompt log excerpt, full persona if needed

---

## 3. Requirements elicitation

**What the top band wants:** you explain *how* you found the requirements, and *why* those techniques suited this project.

- [ ] Name each technique you used and link it to evidence:
  - **Interviews** with the client (module leader/lecturers) and teammates.
  - **Workshops / focus group:** team meetings and the hackathon.
  - **Observation / self-ethnography:** you are the target user; observe how your team loses tasks and prompts.
  - **Document analysis:** the assessment brief, the hackathon PRD, existing tools (Trello, Linear, Jira, Notion).
  - **Competitor analysis:** what those tools lack (no prompt history).
  - **Prototyping as elicitation:** the hackathon prototype exposed new requirements (for example, the managed lists).
- [ ] Say why each was chosen, and its weakness (for example, interviews give depth but small samples; you're biased because you're also the user).
- [ ] Cite elicitation literature: Zowghi and Coulin (2005), Davis et al. (2006), Nuseibeh and Easterbrook (2000).

---

## 4. Stakeholders (6%)

**Criteria:** identify **all** stakeholders, describe each, and justify why each was chosen.

- [ ] Use a recognised model and cite it: the **onion model** (Alexander, 2005) for layers, and a **power/interest grid** (Mendelow, 1991) for priority. Sharp, Finkelstein and Galal (1999) for a structured way of finding them.
- [ ] Include a figure (onion diagram or grid). Figures save words.
- [ ] Table: Stakeholder · Type (primary / secondary / tertiary, or onion layer) · Description · Interest · Influence · Why included.

Candidates for this project:

| Stakeholder | Type | Why they matter |
|---|---|---|
| Student team members (vibecoders) | Primary user | Use the board daily; the main pains (lost tasks, lost prompts) are theirs. |
| Team lead / coordinator | Primary user | Hands off tasks, watches deadlines, owns deliverables. |
| Module leader / lecturers | Client, assessor | Set requirements; act as the client in the brief; mark the deliverables. |
| Teaching assistants / hackathon facilitators | Secondary | Support teams, may review boards to see progress. |
| Future cohorts | Secondary user | PRD names them; the tool should work without the original team. |
| Users with accessibility needs | Primary (subset) | Drives WCAG requirements; argue for them explicitly. |
| AI tool providers (Anthropic, Google, OpenAI etc.) | Wider environment | Their tools are tracked; their output format affects "Copy as Prompt Context". |
| University (IT, data protection) | Wider environment | Rules on data storage, hosting and privacy. |
| Real-world client (if one is assigned) | Client | Add if the class gives you one. |

---

## 5. Persona (14%)

**Criteria:** persona is of one of your *main* stakeholders and has "all the important sections correctly". This is worth more than all three requirement types except the prototype, so make it polished.

- [ ] Choose a primary stakeholder: a student vibecoder on a 3-person team.
- [ ] Base it on your elicitation data, not imagination, and say so (Pruitt and Adlin, 2006). Cite Cooper (1999), who introduced personas.
- [ ] Present it as a one-page figure (designed in Figma/Canva/Word), with a short paragraph in the text explaining how it was built and how it shaped requirements.

Sections it must have:

- [ ] Name, photo/illustration (royalty-free or AI-generated, and credit it)
- [ ] Demographics: age, course, year, role on the team
- [ ] A short quote that captures their attitude
- [ ] Background / short bio
- [ ] Goals (what they want to achieve)
- [ ] Frustrations / pain points (losing tasks, losing the prompt that worked)
- [ ] Behaviours and habits (which AI tools, how often, devices)
- [ ] Tech skills (for example, a scale from novice to expert)
- [ ] Motivations
- [ ] A scenario or user story: a day using the tool
- [ ] **Link to requirements:** which FR/NFR IDs come from this persona's needs. Markers like seeing the persona *used*.

---

## 6. Requirements tables (10% each)

**Criteria:** thorough, each in the right category, unique IDs, MVP marked, justified. Data requirements also need *what* data, *why*, and *where it comes from*.

Use one table per type with columns:
`ID · Requirement ("The system shall…") · Priority (MoSCoW) · MVP? · Source (stakeholder / elicitation) · Justification`

- [ ] Use **MoSCoW** (Clegg and Barker, 1994) and mark MVP = all *Must* items.
- [ ] Write each requirement so it's testable (one "shall" per row; NFRs with a number).
- [ ] Cite a requirements standard or book: ISO/IEC/IEEE 29148:2018, Wiegers and Beatty (2013), Sommerville (2016), Robertson and Robertson (2012).
- [ ] Classify NFRs against **ISO/IEC 25010** quality characteristics (usability, performance efficiency, reliability, security, compatibility, maintainability, portability).
- [ ] Don't put a functional behaviour in the NFR table or vice versa. "Correctly identified and in the right requirements type" is a criterion.

### Draft functional requirements (from the PRD and current build)

Status: ✅ built · 🟡 partly built · ⬜ not built yet

| ID | The system shall… | MoSCoW | MVP | Status |
|---|---|---|---|---|
| FR-01 | show tasks on a board in columns (default To Do, In Progress, Review, Done) | Must | ✅ | ✅ |
| FR-02 | let a user create a task with title, description, type, assignee and due date | Must | ✅ | ✅ |
| FR-03 | let a user edit a task | Must | ✅ | ✅ |
| FR-04 | let a user delete a task after confirmation | Must | ✅ | ✅ |
| FR-05 | let a user move a task to another column (keyboard-accessible, no drag needed) | Must | ✅ | ✅ check |
| FR-06 | let a user add goals to a task: prompt, AI tool, outcome, notes | Must | ✅ | ⬜ |
| FR-07 | let a user update a goal's outcome (Pending / Worked / Partial / Failed) | Must | ✅ | ⬜ |
| FR-08 | copy a task and its goal history as Markdown for pasting into an AI tool | Must | ✅ | ⬜ |
| FR-09 | show each task's type with a colour stripe, icon and label | Should | | 🟡 |
| FR-10 | show the assignee on each card and allow handoff with a confirmation toast | Should | | 🟡 |
| FR-11 | tint the due date by state (safe, due soon, overdue, done) with a text label | Should | | ⬜ |
| FR-12 | provide an Anchor Board with links to the four deliverables | Should | | ⬜ |
| FR-13 | let the team add, rename, reorder and remove columns, types, AI tools and outcomes | Could | | 🟡 logic only |
| FR-14 | ask where to move tasks/goals before removing a list entry that is in use | Could | | 🟡 logic only |
| FR-15 | let the team reset a list to its defaults | Could | | 🟡 logic only |

Mark FR-06 to FR-08 as MVP because they are the product's reason to exist (the "lost prompts" pain). Argue this in the justification column.

### Draft non-functional requirements

| ID | Requirement | ISO 25010 | MVP |
|---|---|---|---|
| NFR-01 | Meets WCAG 2.2 AA: text contrast ≥ 4.5:1, UI boundaries ≥ 3:1 | Usability (accessibility) | ✅ |
| NFR-02 | Every action can be done by keyboard alone, with a visible focus ring | Usability | ✅ |
| NFR-03 | A first-time user can create a task in under 60 seconds without help | Usability (learnability) | ✅ |
| NFR-04 | Opens from a public URL with no login or install | Compatibility / portability | ✅ (also a brief rule) |
| NFR-05 | Board loads in under 2 s; actions respond in under 0.1 s (Nielsen, 1993) | Performance efficiency | ✅ |
| NFR-06 | No data is lost on page refresh; nothing is ever deleted without confirmation | Reliability | ✅ |
| NFR-07 | Data stays in the user's browser; nothing is sent to a server | Security / privacy | ✅ |
| NFR-08 | Works on current Chrome, Edge and Firefox on desktop (≥ 1280 px) | Compatibility | ✅ |
| NFR-09 | Colour is never the only signal (icons and labels too) | Usability | |
| NFR-10 | Respects `prefers-reduced-motion` | Usability | |
| NFR-11 | One design system (shadcn + Graphite tokens) for a consistent look | Maintainability / aesthetics | |

`DESIGN.md` already has the contrast measurements. Use them as evidence for NFR-01.

### Draft data requirements

For each: what data, why it's needed, where it comes from, and how it's stored.

| ID | Data | Why | Source | MVP |
|---|---|---|---|---|
| DR-01 | Task record (id, title, description, type, status, assignee, due, created) | Core of the board | Entered by users | ✅ |
| DR-02 | Goal record (prompt, tool, outcome, notes, timestamps) | Solves the "lost prompts" problem | Users paste prompts from their AI tools | ✅ |
| DR-03 | Team member names | Only allowed assignees; no accounts | The team (PRD §8) | ✅ |
| DR-04 | Default columns | Kanban stages from intent to ship | Kanban practice (Anderson, 2010) and client | ✅ |
| DR-05 | AI tool list | Recorded on each goal | Tools named in the brief (Antigravity, Gemini, Claude) and a market scan | ✅ |
| DR-06 | Outcome list | Track what worked | Team workshop | ✅ |
| DR-07 | Task types | Visual sorting | Client / team | |
| DR-08 | Deliverable links (Presentation, Demo, Report, Documentation) | Anchor Board | Module brief | |
| DR-09 | Storage: browser localStorage keys (`vibetracker.*`) | Zero setup, no personal data on a server | Browser | ✅ |
| DR-10 | Demo seed data, including one fully worked task with goals | So the assessor sees every feature on first open | Written from the real `PROMPTS.md` log | ✅ |

Add a short note on **UK GDPR / Data Protection Act 2018**: names are personal data, so localStorage-only storage keeps them on the user's device. This shows wider awareness.

> Note: the defaults in `src/lib/defaults.js` list Claude, ChatGPT, Cursor, Lovable, Replit, Other. The brief names Google Antigravity and Gemini. Adding them gives you a requirement traced straight to a document source.

---

## 7. Prototype (40%)

**Criteria for 80%+:** excellent medium-fidelity prototype with effective interaction; thorough justification of design principles and interaction behaviours; fully clickable and complete with **all** requirements (including non-MVP); no unjustified extras; strong references.

### 7a. Build checklist (what the app still needs)

From `STAGES.md`, as of 2026-10-20:

- [ ] FR-05: click through moving tasks in a browser
- [ ] FR-06 / FR-07: goals in the task dialog (M9)
- [ ] FR-08: Copy as Prompt Context (M10)
- [ ] FR-09: finish type styling, including a neutral style for team-added types (M6)
- [ ] FR-10: handoff dropdown and toast (M7)
- [ ] FR-11: due-date tinting (M8)
- [ ] FR-12: Anchor Board (M11)
- [ ] FR-13 to FR-15: Manage lists dialog UI
- [ ] Replace placeholder team names and team name (`src/lib/defaults.js`)
- [ ] **Seed data:** at least one task with 2–3 goals (mixed outcomes) and at least one Anchor link filled in. The marker opens a fresh browser, so whatever is in the seed is all they see first. ("A profile for one of them needs to be clearly shown to work with all the features.")
- [ ] Add a **"Reset demo data"** option so the marker can recover after experimenting (justify as an extra: error recovery, Nielsen heuristic 3).
- [ ] Deploy to Vercel. Open the link in a private window, on another computer, logged out of everything. Confirm no login prompt appears.
- [ ] Remove every "soon" placeholder from the sidebar, or build it. A dead link looks incomplete.
- [ ] Every requirement from §6 is clickable. Go down the table and test each one.

### 7a-ii. Screen reader checks (to do later)

The code is built for screen readers (see `ACCESSIBILITY.md` §1), but it **hasn't been tested with one yet**. Do this before you submit, and keep the results as evidence for NFR-01, NFR-02 and the persona SH-06.

**Setup**

- [ ] Install **NVDA** (free, Windows): https://www.nvaccess.org. Start it with Ctrl+Alt+N, stop it with Insert+Q.
- [ ] Use Chrome or Firefox, open the deployed link, and **put the mouse away**. Keyboard only.
- [ ] Tip: Insert+F7 opens NVDA's list of headings, links and landmarks, a quick way to check the page structure.

**Page structure**

- [ ] First Tab lands on "Skip to main content", and pressing Enter jumps to the board.
- [ ] Headings list shows the project name and one heading per column (To Do, In Progress, …).
- [ ] Landmarks list shows "Main" navigation and the main region.
- [ ] Column counts read as "Tasks: 3", not just "3".
- [ ] Icons are silent. You should never hear "image" or "graphic".

**Task cards**

- [ ] Tabbing onto a card reads its title, type, goal count and due state, e.g. "Overdue 2d".
- [ ] The owner dropdown reads "Owner of *task*. Change to hand it off."
- [ ] The drag handle reads "Move *task* to another column", then the instructions.

**Drag and drop by keyboard** (the most important check)

- [ ] On the drag handle, Space → hear "Picked up *task*."
- [ ] Right arrow → hear "*task* is over In Progress." (and so on for each column).
- [ ] Space → hear "Dropped *task* in In Progress." The toast "Moved to In Progress." is also read.
- [ ] Repeat, then press Esc → hear "Cancelled. *task* did not move."
- [ ] Move a card into Done → hear the drop and "Moved to Done." The confetti is visual only, so this speech is how screen-reader users get the same moment.

**Dialogs and forms**

- [ ] "+ Task" opens the dialog, NVDA reads "New task", and focus is in the Title field.
- [ ] Every field reads its label (Title, Description, Type, Status, Assignee, Due date).
- [ ] Save with an empty title → hear "Give the task a title." and focus goes back to Title.
- [ ] Esc closes the dialog, and focus returns to the button that opened it.
- [ ] Tab can't escape the open dialog to the board behind it (focus trap).
- [ ] "Copy as Prompt Context" → hear "Copied to clipboard. Paste it into your AI tool."
- [ ] Delete → confirm dialog reads "Delete this task? You can't undo."

**Other screens**

- [ ] Handoff via the owner dropdown → hear "Handed off to *name*." Tab reaches the toast's Undo button.
- [ ] Manage Lists: tabs read as "tab, 1 of 2", and the arrow keys switch tabs.
- [ ] Goals accordion reads "expanded" / "collapsed".
- [ ] Sidebar collapse button reads "Collapse sidebar" / "Expand sidebar", and the nav items still read their names when collapsed.
- [ ] Anchor Board links read "(opens in a new tab)".

**Automated scan**

- [ ] Run **axe DevTools** (free browser extension) on the board, the open task dialog and the Manage Lists dialog. Aim for 0 issues, and screenshot the result.
- [ ] Optional: Chrome Lighthouse → Accessibility score, and screenshot it.

**Record the evidence**

- [ ] Make a short table: check · expected · what NVDA said · pass/fail. Put it in an appendix.
- [ ] Fix anything that fails, and note it as a design iteration (good for marks).
- [ ] Optional: a short screen recording with NVDA's speech viewer on (NVDA menu → Tools → Speech viewer) shows what was read.
- [ ] Update `ACCESSIBILITY.md` §1.5 to remove "No formal screen-reader audit yet".
- [ ] Update the line in §7b below ("Why a status dropdown instead of drag-and-drop"). The app now has **both**: keyboard drag and drop *and* the status dropdown. Justify both.

### 7b. Write-up checklist

- [ ] **Link** near the top of Part 2, plus one line on how to use it ("opens on the team board; click a card to see its goals").
- [ ] **Tools and AI use:** name each tool (Claude Code with Sonnet 5.5 and Opus 5.5, shadcn/ui, tweakcn, Vite, React, Tailwind, Vercel). Explain *how* you used AI: PRD review, design critique, scaffolding components, writing the list logic. Quote one or two prompts from `PROMPTS.md`. Say what you checked or changed by hand (for example, the contrast fixes in `DESIGN.md`). Put a log excerpt in an appendix.
- [ ] **Fidelity:** the brief asks for medium fidelity. Yours is a coded prototype, closer to high fidelity. Say why that's a fair choice (AI tools make it cheap; it lets you test real interaction) and cite the fidelity debate: Rudd, Stern and Isensee (1996), Walker, Takayama and Landay (2002).
- [ ] **Traceability table**, every requirement to its feature and screenshot:

  | Req ID | Feature / screen | Figure | UX principle applied |
  |---|---|---|---|
  | FR-02 | "+ Task" button → task dialog | Fig. 4 | Visibility of system status; recognition over recall |
  | NFR-02 | Focus ring on all controls | Fig. 7 | WCAG 2.4.7 Focus Visible |
  | … | | | |

- [ ] **Screenshots** (annotated with arrows/callouts, captioned "Fig. n: …"). For each: what it shows, which requirement, why it's designed that way.
  - [ ] Board overview
  - [ ] Task card close-up (type stripe, assignee, due tint)
  - [ ] Create/edit task dialog
  - [ ] Delete confirmation
  - [ ] Goals list inside a task
  - [ ] Copy as Prompt Context toast + the pasted Markdown in an AI chat
  - [ ] Handoff toast
  - [ ] Anchor Board
  - [ ] Manage lists dialog, including the "move tasks before removing" step
  - [ ] Keyboard focus visible
  - [ ] Collapsed sidebar
  - [ ] Before/after of a design change (if you iterated)
- [ ] **UX principles in detail.** The brief says "describe the UX principles in detail". Don't just list them; tie each to a specific screen:
  - Nielsen's 10 heuristics (Nielsen, 1994): system status (toasts), error prevention (delete confirm, move-on-remove), consistency (one design system), recognition over recall (dropdowns not typing), user control (Esc closes, undo/reset), minimalist design (greyscale with colour only for status).
  - Norman (2013): affordances, signifiers, feedback, mapping.
  - Shneiderman's eight golden rules (Shneiderman et al., 2016).
  - Fitts's law (1954): 40 px buttons, ≥ 24 px targets.
  - Hick's law (1952): four default columns, short menus.
  - Gestalt proximity and similarity: columns, card grouping.
  - WCAG 2.2 AA: contrast overrides from `DESIGN.md`, focus, not relying on colour.
- [ ] **Interaction behaviours justified** (a separate criterion from design principles):
  - Why a status dropdown instead of drag-and-drop (keyboard and screen-reader access; DESIGN.md §5).
  - Why a modal dialog for editing (focus, context kept).
  - Why toasts for confirmation and handoff (non-blocking feedback).
  - Why a sidebar (prompt 7–8 in `PROMPTS.md`; scales to more sections).
  - Why one-click copy (reduces steps back to the AI tool).
- [ ] **Extras justified.** List anything not in the requirements (sidebar collapse, skip link, reset demo data, design tokens) and justify each in a sentence.
- [ ] **Evaluation (strongly recommended for 80%+).** Run a quick test with 3–5 classmates: think-aloud on 3 tasks, plus the System Usability Scale (Brooke, 1996). Report the score, the issues found, and what you changed. This is "beyond the slides" and shows iteration.

---

## 8. References: aim for 15–25, mostly ones not given in class

Use Harvard style, cite them *in the text* where they support a decision, and check each one against the library before you use it. These are real and relevant:

**Requirements and stakeholders**
- Alexander, I. (2005) 'A taxonomy of stakeholders: human roles in system development', *International Journal of Technology and Human Interaction*, 1(1), pp. 23–59.
- Clegg, D. and Barker, R. (1994) *Case Method Fast-Track: A RAD Approach*. Addison-Wesley. (MoSCoW)
- Davis, A. et al. (2006) 'Effectiveness of requirements elicitation techniques: empirical results derived from a systematic review', *14th IEEE International Requirements Engineering Conference*.
- ISO/IEC/IEEE 29148:2018 *Systems and software engineering — Life cycle processes — Requirements engineering*.
- ISO/IEC 25010 *Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*.
- Mendelow, A. (1991) 'Stakeholder mapping', *Proceedings of the 2nd International Conference on Information Systems*, Cambridge, MA.
- Nuseibeh, B. and Easterbrook, S. (2000) 'Requirements engineering: a roadmap', *Proceedings of the Conference on the Future of Software Engineering*, pp. 35–46.
- Robertson, S. and Robertson, J. (2012) *Mastering the Requirements Process*. 3rd edn. Addison-Wesley.
- Sharp, H., Finkelstein, A. and Galal, G. (1999) 'Stakeholder identification in the requirements engineering process', *Proceedings of the 10th International Workshop on Database and Expert Systems Applications*, pp. 387–391.
- Sommerville, I. (2016) *Software Engineering*. 10th edn. Pearson.
- Wiegers, K. and Beatty, J. (2013) *Software Requirements*. 3rd edn. Microsoft Press.
- Zowghi, D. and Coulin, C. (2005) 'Requirements elicitation: a survey of techniques, approaches, and tools', in Aurum, A. and Wohlin, C. (eds) *Engineering and Managing Software Requirements*. Springer, pp. 19–46.

**Personas**
- Cooper, A. (1999) *The Inmates Are Running the Asylum*. Sams.
- Nielsen, L. (2019) *Personas: User Focused Design*. 2nd edn. Springer.
- Pruitt, J. and Adlin, T. (2006) *The Persona Lifecycle*. Morgan Kaufmann.

**Prototyping, UX and accessibility**
- Brooke, J. (1996) 'SUS: a quick and dirty usability scale', in Jordan, P.W. et al. (eds) *Usability Evaluation in Industry*. Taylor & Francis, pp. 189–194.
- Fitts, P.M. (1954) 'The information capacity of the human motor system in controlling the amplitude of movement', *Journal of Experimental Psychology*, 47(6), pp. 381–391.
- Hick, W.E. (1952) 'On the rate of gain of information', *Quarterly Journal of Experimental Psychology*, 4(1), pp. 11–26.
- Krug, S. (2014) *Don't Make Me Think, Revisited*. 3rd edn. New Riders.
- Nielsen, J. (1993) *Usability Engineering*. Academic Press. (response-time limits)
- Nielsen, J. (1994) '10 usability heuristics for user interface design', Nielsen Norman Group.
- Norman, D. (2013) *The Design of Everyday Things*. Revised edn. Basic Books.
- Rudd, J., Stern, K. and Isensee, S. (1996) 'Low vs. high-fidelity prototyping debate', *interactions*, 3(1), pp. 76–85.
- Shneiderman, B. et al. (2016) *Designing the User Interface*. 6th edn. Pearson.
- Walker, M., Takayama, L. and Landay, J.A. (2002) 'High-fidelity or low-fidelity, paper or computer?', *Proceedings of the Human Factors and Ergonomics Society Annual Meeting*, 46(5), pp. 661–665.
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2*.

**Domain**
- Anderson, D.J. (2010) *Kanban: Successful Evolutionary Change for Your Technology Business*. Blue Hole Press.
- A recent paper or article on AI-assisted programming / "vibe coding" (search Google Scholar or the ACM Digital Library for 2025–26 work) to show the problem is current.

---

## 9. Top-band checklist (do this before submitting)

**Part 1**
- [ ] Elicitation techniques explained, justified and evidenced
- [ ] All stakeholders identified, described and justified, with a model and a figure
- [ ] Persona has every section, is based on data, and is linked to requirement IDs
- [ ] FR, NFR and DR each in its own table, unique IDs, MoSCoW, MVP marked, source and justification
- [ ] No requirement in the wrong category
- [ ] DRs say what, why and where from
- [ ] Literature cited throughout Part 1, not only in the reference list

**Part 2**
- [ ] Link works in a private window with no login
- [ ] Every requirement (MVP and non-MVP) is built and clickable
- [ ] Seed data shows one complete example of every feature
- [ ] Traceability table covers every requirement
- [ ] Annotated screenshots for every main screen
- [ ] UX principles explained per screen, with citations
- [ ] Interaction behaviours justified
- [ ] Every extra feature justified
- [ ] AI tools named and their use explained, with prompt examples
- [ ] Fidelity choice justified
- [ ] (Bonus) usability test results and the changes they led to

**Submission**
- [ ] ≤ 2,000 words (state the count on the title page)
- [ ] Report saved as PDF, named `Firstname Surname-2.pdf`
- [ ] `Coversheet.pdf` completed and submitted
- [ ] Prototype link in the report *and* in the submission box
- [ ] Downloaded the submitted files and checked they open and match the receipt size
- [ ] Submitted well before the deadline

---

## 10. Suggested order of work

1. **Now:** confirm the topic, collect elicitation notes, ask about word-count rules, find the AI guidance.
2. **Write Part 1 drafts** (stakeholders, persona, requirement tables). Fix the requirement list *before* building more, so the build matches it.
3. **Finish the build** (§7a), working down the FR table.
4. **Seed data, deploy, test the link** logged out.
5. **Usability test** with classmates; fix what they find.
6. **Screenshots, traceability table, Part 2 write-up.**
7. **Edit to 2,000 words**, check references, run the §9 checklist, submit early.
