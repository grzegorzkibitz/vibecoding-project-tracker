import {
  KanbanSquare, Anchor, ListChecks, PanelLeftClose, PanelLeftOpen, FolderKanban, Plus, Settings, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// `soon` items are placeholders for later milestones. `action` items open a dialog.
// Anchors sit above the board on the same page, so that link jumps to them.
const ITEMS = [
  { id: 'board', label: 'Board', icon: KanbanSquare },
  { id: 'anchors', label: 'Deliverables', icon: Anchor },
  { id: 'lists', label: 'Manage lists', icon: ListChecks, action: true },
  { id: 'teams', label: 'Teams', icon: Users, action: true },
];

/**
 * Jump to a section on the page: scroll it into view, move focus there (so Tab
 * carries on from it) and outline it briefly, so the jump is visible even when
 * the section is already on screen.
 */
function jumpTo(e, id) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  el.focus({ preventScroll: true });
  el.classList.remove('jump-highlight');
  void el.offsetWidth; // restart the highlight if clicked again
  el.classList.add('jump-highlight');
  setTimeout(() => el.classList.remove('jump-highlight'), 1500);
}

export default function Sidebar({
  teamName,
  collapsed,
  onToggle,
  onAction,
  projects,
  currentProject,
  onOpenProject,
  onNewProject,
  onProjectSettings,
  current = 'board',
}) {
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r bg-card transition-[width] duration-200',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        <span
          className={cn('truncate text-base font-semibold', collapsed && 'sr-only')}
        >
          Vibe Tracker
        </span>
        {collapsed && (
          <span aria-hidden="true" className="mx-auto text-base font-semibold">
            V
          </span>
        )}
      </div>

      {/* Project switcher. Collapsed: one button that shows the project and expands the sidebar. */}
      <div className="border-b p-2">
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            title={`Project: ${currentProject.name}`}
            className="flex min-h-10 w-full items-center justify-center rounded-md hover:bg-secondary"
          >
            <FolderKanban aria-hidden="true" className="size-4" />
            <span className="sr-only">Project: {currentProject.name}. Expand the sidebar to switch project.</span>
          </button>
        ) : (
          <div className="space-y-1.5 px-1">
            <label htmlFor="project-switcher" className="block text-xs font-medium text-muted-foreground">
              Project
            </label>
            <select
              id="project-switcher"
              value={currentProject.id}
              onChange={(e) => onOpenProject(e.target.value)}
              className="h-10 w-full truncate rounded-md border border-input bg-card px-2 text-sm font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={onNewProject}
                aria-haspopup="dialog"
                className="flex min-h-8 flex-1 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Plus aria-hidden="true" className="size-3.5" />
                New project
              </button>
              <button
                type="button"
                onClick={onProjectSettings}
                aria-haspopup="dialog"
                aria-label={`Settings for ${currentProject.name}`}
                title="Project settings"
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Settings aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 p-2">
        <ul className="space-y-1">
          {ITEMS.map(({ id, label, icon: Icon, soon, action }) => {
            const active = id === current;
            if (action) {
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onAction(id)}
                    aria-haspopup="dialog"
                    title={collapsed ? label : undefined}
                    className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                    <span className={cn('truncate', collapsed && 'sr-only')}>{label}</span>
                  </button>
                </li>
              );
            }
            return (
              <li key={id}>
                <a
                  href={soon ? undefined : `#${id}`}
                  onClick={soon ? undefined : (e) => jumpTo(e, id)}
                  aria-current={active ? 'page' : undefined}
                  aria-disabled={soon ? 'true' : undefined}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'relative flex min-h-10 items-center gap-3 rounded-md px-3 text-sm',
                    active
                      ? 'bg-secondary font-semibold text-foreground before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-full before:bg-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    soon && 'cursor-not-allowed opacity-70 hover:bg-transparent hover:text-muted-foreground',
                  )}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className={cn('truncate', collapsed && 'sr-only')}>{label}</span>
                  {soon && !collapsed && (
                    <span className="ml-auto font-mono text-xs">soon</span>
                  )}
                  {soon && collapsed && <span className="sr-only">(coming soon)</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-2">
        <p className={cn('truncate px-3 pb-2 text-xs text-muted-foreground', collapsed && 'sr-only')}>
          <span className="sr-only">Team: </span>
          {teamName}
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" className="size-4 shrink-0" />
          ) : (
            <PanelLeftClose aria-hidden="true" className="size-4 shrink-0" />
          )}
          <span className={cn(collapsed && 'sr-only')}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
