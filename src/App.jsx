import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_LISTS, SEED_TASKS, TEAM_NAME } from '@/lib/defaults';
import Sidebar from '@/components/Sidebar';
import Board from '@/components/Board';

/**
 * Vibecoding Project Tracker.
 *
 * Landing view is the team's Kanban board (sidebar navigation on the left).
 * Remaining hooks, by milestone:
 *   - M5  crud-modal    : "+ Task" button and edit-on-click modal.
 *   - M8  due-tint      : colour cards by due date.
 *   - M9  context       : goals (prompt, tool, outcome) on the task modal.
 *   - M10 copy-prompt   : "Copy as Prompt Context".
 *   - M11 anchors       : Anchor Board.
 *   - Manage lists      : add / rename / reorder / remove list entries.
 */
export default function App() {
  const [tasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  const [lists] = useLocalStorage('vibetracker.lists', DEFAULT_LISTS);
  const [collapsed, setCollapsed] = useLocalStorage('vibetracker.sidebarCollapsed', false);

  return (
    <div className="flex h-full">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Sidebar
        teamName={TEAM_NAME}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Board</h1>
          {/* M5: "+ Task" button goes here. */}
        </header>
        <main id="main" tabIndex={-1} className="min-h-0 flex-1 p-6">
          <Board columns={lists.columns} tasks={tasks} types={lists.types} />
        </main>
      </div>
    </div>
  );
}
