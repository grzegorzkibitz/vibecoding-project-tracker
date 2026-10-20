import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLists } from '@/hooks/useLists';
import { DEFAULT_ANCHORS, SEED_TASKS, TEAM } from '@/lib/defaults';
import { projectKey } from '@/lib/projects';
import { toast } from '@/components/ui/sonner';
import AnchorBoard, { normalizeAnchors } from '@/components/AnchorBoard';
import Board from '@/components/Board';
import TaskDialog from '@/components/TaskDialog';
import ManageListsDialog from '@/components/ManageListsDialog';
import { Button } from '@/components/ui/button';

/**
 * One project's page: deliverable links above its Kanban board, plus its dialogs.
 * Mount with `key={project.id}` so switching project reloads all of its state.
 * A project with nothing stored yet (the demo project) starts from the seed data.
 */
export default function ProjectWorkspace({ project, managingLists, onCloseLists }) {
  const [tasks, setTasks] = useLocalStorage(projectKey(project.id, 'tasks'), SEED_TASKS);
  const listManager = useLists(tasks, setTasks, projectKey(project.id, 'lists'));
  const { lists } = listManager;
  const [storedAnchors, setStoredAnchors] = useLocalStorage(projectKey(project.id, 'anchors'), DEFAULT_ANCHORS);
  const anchors = useMemo(() => normalizeAnchors(storedAnchors), [storedAnchors]);
  const setAnchor = (id, url) => setStoredAnchors(anchors.map((a) => (a.id === id ? { ...a, url } : a)));
  // null = closed, 'new' = add mode, otherwise the task being edited.
  const [editing, setEditing] = useState(null);

  const setAssignee = (id, name) =>
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, assignee: name } : t)));

  // M7: confirm a handoff with a toast that can undo it.
  const announceHandoff = (task, from, to) =>
    toast(`Handed off to ${to}.`, {
      description: task.title,
      action: { label: 'Undo', onClick: () => setAssignee(task.id, from) },
    });

  const handoff = (task, name) => {
    if (name === task.assignee) return;
    setAssignee(task.id, name);
    announceHandoff(task, task.assignee, name);
  };

  const setStatus = (id, status) =>
    setTasks((all) => all.map((t) => (t.id === id ? { ...t, status } : t)));

  // Drag and drop: move a card to another column, with undo.
  const move = (task, status) => {
    const from = task.status;
    setStatus(task.id, status);
    const label = lists.columns.find((c) => c.id === status)?.label ?? status;
    toast(`Moved to ${label}.`, {
      description: task.title,
      action: { label: 'Undo', onClick: () => setStatus(task.id, from) },
    });
  };

  const save = (task) => {
    const before = tasks.find((t) => t.id === task.id);
    setTasks((all) =>
      all.some((t) => t.id === task.id) ? all.map((t) => (t.id === task.id ? task : t)) : [...all, task],
    );
    if (before && before.assignee !== task.assignee) announceHandoff(task, before.assignee, task.assignee);
    setEditing(null);
  };
  const remove = (id) => {
    setTasks((all) => all.filter((t) => t.id !== id));
    setEditing(null);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-6">
        <h1 className="min-w-0 truncate text-2xl font-semibold">
          {project.name}
          <span className="font-normal text-muted-foreground"> · Board</span>
        </h1>
        <Button onClick={() => setEditing('new')}>
          <Plus aria-hidden="true" className="size-4" />
          Task
        </Button>
      </header>
      <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
        <AnchorBoard anchors={anchors} onChange={setAnchor} />
        <div className="min-h-96 flex-1">
          <Board
            columns={lists.columns}
            tasks={tasks}
            types={lists.types}
            team={TEAM}
            onOpen={setEditing}
            onHandoff={handoff}
            onMove={move}
          />
        </div>
      </main>

      {editing && (
        <TaskDialog
          key={editing === 'new' ? 'new' : editing.id}
          task={editing === 'new' ? null : editing}
          lists={lists}
          onSave={save}
          onDelete={remove}
          onClose={() => setEditing(null)}
        />
      )}

      {managingLists && <ManageListsDialog manager={listManager} onClose={onCloseLists} />}
    </div>
  );
}
