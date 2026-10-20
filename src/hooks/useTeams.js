import { useState } from 'react';
import { browserStorage } from '@/lib/projects';
import * as ops from '@/lib/teams';

/**
 * Teams and their users. Actions throw an Error with a readable message when a
 * rule would be broken (empty or duplicate name, deleting the last or a used team).
 */
export function useTeams(storage = browserStorage) {
  const [teams, setTeams] = useState(() => ops.loadTeams(storage));

  return {
    teams,
    /** Returns the new team, so the caller can select it. */
    create: (name) => {
      const { teams: next, team } = ops.createTeam(storage, teams, name);
      setTeams(next);
      return team;
    },
    rename: (id, name) => setTeams(ops.renameTeam(storage, teams, id, name)),
    remove: (id, projectsUsing) => setTeams(ops.deleteTeam(storage, teams, id, projectsUsing)),
    addMember: (teamId, name) => setTeams(ops.addMember(storage, teams, teamId, name)),
    renameMember: (teamId, memberId, name) => setTeams(ops.renameMember(storage, teams, teamId, memberId, name)),
    removeMember: (teamId, memberId) => setTeams(ops.removeMember(storage, teams, teamId, memberId)),
  };
}
