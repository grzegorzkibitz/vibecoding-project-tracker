import { useState } from 'react';
import * as ops from '@/lib/projects';

/**
 * The project list and the open project. Actions throw an Error with a readable
 * message when a rule would be broken (empty or duplicate name, deleting the last one).
 */
export function useProjects(storage = ops.browserStorage) {
  const [index, setIndex] = useState(() => ops.loadIndex(storage));
  const current = index.projects.find((p) => p.id === index.currentId) ?? index.projects[0];

  return {
    projects: index.projects,
    current,
    open: (id) => setIndex(ops.openProject(storage, index, id)),
    create: (name, teamId) => setIndex(ops.createProject(storage, index, name, teamId)),
    rename: (id, name) => setIndex(ops.renameProject(storage, index, id, name)),
    setTeam: (id, teamId) => setIndex(ops.setProjectTeam(storage, index, id, teamId)),
    remove: (id) => setIndex(ops.deleteProject(storage, index, id)),
    taskCount: (id) => ops.taskCount(storage, id),
  };
}
