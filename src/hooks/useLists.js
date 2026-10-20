import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_LISTS } from '@/lib/defaults';
import * as ops from '@/lib/lists';

/**
 * The team-managed lists (columns, types, tools, outcomes) plus the actions to manage them.
 * Removing or resetting entries in use re-points tasks, so it needs the task state too.
 * Actions throw an Error with a user-readable message when a PRD §7 rule would be broken.
 */
export function useLists(tasks, setTasks, storageKey) {
  const [stored, setStored] = useLocalStorage(storageKey, DEFAULT_LISTS);
  const lists = useMemo(() => ops.normalizeLists(stored), [stored]);

  return {
    lists,
    usageCount: (key, id) => ops.usageCount(tasks, key, id),
    add: (key, label) => setStored(ops.addItem(lists, key, label)),
    rename: (key, id, label) => setStored(ops.renameItem(lists, key, id, label)),
    move: (key, id, toIndex) => setStored(ops.moveItem(lists, key, id, toIndex)),
    setColumnDone: (id, isDone) => setStored(ops.setColumnDone(lists, id, isDone)),
    remove: (key, id, moveToId) => {
      const next = ops.removeItem(lists, tasks, key, id, moveToId);
      setTasks(next.tasks);
      setStored(next.lists);
    },
    reset: (key, moveToId) => {
      const next = ops.resetList(lists, tasks, key, moveToId);
      setTasks(next.tasks);
      setStored(next.lists);
    },
  };
}
