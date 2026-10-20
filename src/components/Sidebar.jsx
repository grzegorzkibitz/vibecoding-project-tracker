import { KanbanSquare, Anchor, ListChecks, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

// Only the board exists so far; the rest are placeholders for later milestones.
const ITEMS = [
  { id: 'board', label: 'Board', icon: KanbanSquare },
  { id: 'anchors', label: 'Anchors', icon: Anchor, soon: true },
  { id: 'lists', label: 'Manage lists', icon: ListChecks, soon: true },
];

export default function Sidebar({ teamName, collapsed, onToggle, current = 'board' }) {
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

      <nav aria-label="Main" className="flex-1 p-2">
        <ul className="space-y-1">
          {ITEMS.map(({ id, label, icon: Icon, soon }) => {
            const active = id === current;
            return (
              <li key={id}>
                <a
                  href={soon ? undefined : `#${id}`}
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
