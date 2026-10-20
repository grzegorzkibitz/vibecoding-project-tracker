import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input, Label, Select } from '@/components/ui/field';

/** Runs a team action and turns a thrown rule error into a message. */
function attempt(fn, setError) {
  try {
    fn();
    setError('');
    return true;
  } catch (err) {
    setError(err.message);
    return false;
  }
}

/**
 * Create and manage teams and their made-up users. Users can then be assigned
 * tasks on any project that uses the team. `manager` is the object from useTeams.
 */
export default function TeamsDialog({ manager, projects, initialTeamId, onClose }) {
  const { teams } = manager;
  const [selectedId, setSelectedId] = useState(initialTeamId);
  const team = teams.find((t) => t.id === selectedId) ?? teams[0];
  const [creating, setCreating] = useState(null); // new team name, or null
  const [error, setError] = useState('');

  function createTeam(e) {
    e.preventDefault();
    let made;
    if (attempt(() => (made = manager.create(creating)), setError)) {
      setSelectedId(made.id);
      setCreating(null);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogTitle>Teams</DialogTitle>
        <DialogDescription>
          Teams hold the users you can assign tasks to. Each project uses one team. Changes save straight away.
        </DialogDescription>

        <div className="mt-4 space-y-1.5">
          {creating === null ? (
            <>
              <Label htmlFor="team-picker">Team</Label>
              <div className="flex gap-2">
                <Select
                  id="team-picker"
                  className="flex-1"
                  value={team.id}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    setError('');
                  }}
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Select>
                <Button type="button" variant="outline" onClick={() => setCreating('')}>
                  <Plus aria-hidden="true" className="size-4" />
                  New team
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={createTeam} className="space-y-1.5">
              <Label htmlFor="new-team-name">New team name</Label>
              <div className="flex gap-2">
                <Input
                  id="new-team-name"
                  value={creating}
                  onChange={(e) => {
                    setCreating(e.target.value);
                    setError('');
                  }}
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'teams-error' : undefined}
                  autoFocus
                />
                <Button type="submit">Create team</Button>
                <Button type="button" variant="outline" onClick={() => (setCreating(null), setError(''))}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
          {error && (
            <p id="teams-error" role="alert" className="text-sm text-destructive">{error}</p>
          )}
        </div>

        {/* key resets the panel's local state when switching team */}
        <TeamPanel
          key={team.id}
          team={team}
          manager={manager}
          isLast={teams.length <= 1}
          usedBy={projects.filter((p) => (p.teamId ?? teams[0].id) === team.id)}
          onDeleted={() => setSelectedId(teams.find((t) => t.id !== team.id)?.id)}
        />
      </DialogContent>
    </Dialog>
  );
}

function TeamPanel({ team, manager, isLast, usedBy, onDeleted }) {
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState(null); // string while renaming the team
  const [newUser, setNewUser] = useState('');
  const [renaming, setRenaming] = useState(null); // { id, name }
  const [removing, setRemoving] = useState(null); // member id awaiting confirmation

  const run = (fn) => attempt(fn, setError);

  function saveTeamName(e) {
    e.preventDefault();
    if (run(() => manager.rename(team.id, teamName))) setTeamName(null);
  }

  function addUser(e) {
    e.preventDefault();
    if (run(() => manager.addMember(team.id, newUser))) setNewUser('');
  }

  function saveRename(e) {
    e.preventDefault();
    if (run(() => manager.renameMember(team.id, renaming.id, renaming.name))) setRenaming(null);
  }

  function deleteTeam() {
    if (run(() => manager.remove(team.id, usedBy.length))) onDeleted();
  }

  const cantDelete = isLast
    ? 'This is your only team, so it can\'t be deleted.'
    : usedBy.length > 0
      ? 'Move its projects to another team (in project settings) before deleting it.'
      : null;

  return (
    <section aria-labelledby="team-panel-heading" className="mt-4 space-y-4 border-t pt-4">
      {teamName === null ? (
        <div className="flex items-center gap-2">
          <h3 id="team-panel-heading" className="min-w-0 flex-1 truncate text-base font-semibold">{team.name}</h3>
          <Button
            size="icon" variant="ghost" className="size-8"
            aria-label={`Rename team ${team.name}`}
            onClick={() => setTeamName(team.name)}
          >
            <Pencil aria-hidden="true" className="size-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={saveTeamName} className="flex items-center gap-2">
          <h3 id="team-panel-heading" className="sr-only">{team.name}</h3>
          <Label htmlFor="rename-team" className="sr-only">New name for {team.name}</Label>
          <Input
            id="rename-team"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            autoFocus
          />
          <Button type="submit" size="icon" variant="ghost" aria-label="Save team name">
            <Check aria-hidden="true" className="size-4" />
          </Button>
          <Button type="button" size="icon" variant="ghost" aria-label="Cancel rename" onClick={() => setTeamName(null)}>
            <X aria-hidden="true" className="size-4" />
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground">
        {usedBy.length === 0
          ? 'Not used by any project yet.'
          : `Used by ${usedBy.map((p) => p.name).join(', ')}.`}
      </p>

      {team.members.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No users yet. Add one below.
        </p>
      ) : (
        <ul className="divide-y rounded-md border" aria-label={`Users in ${team.name}`}>
          {team.members.map((m) => (
            <li key={m.id} className="px-3 py-2">
              {renaming?.id === m.id ? (
                <form onSubmit={saveRename} className="flex items-center gap-2">
                  <Label htmlFor={`rename-user-${m.id}`} className="sr-only">New name for {m.name}</Label>
                  <Input
                    id={`rename-user-${m.id}`}
                    value={renaming.name}
                    onChange={(e) => setRenaming({ ...renaming, name: e.target.value })}
                    autoFocus
                  />
                  <Button type="submit" size="icon" variant="ghost" aria-label="Save name">
                    <Check aria-hidden="true" className="size-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Cancel rename" onClick={() => setRenaming(null)}>
                    <X aria-hidden="true" className="size-4" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <UserRound aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{m.name}</span>
                  <Button
                    size="icon" variant="ghost" className="size-8"
                    aria-label={`Rename ${m.name}`}
                    onClick={() => {
                      setRemoving(null);
                      setRenaming({ id: m.id, name: m.name });
                    }}
                  >
                    <Pencil aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    size="icon" variant="ghost" className="size-8"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => {
                      setRenaming(null);
                      setRemoving(m.id);
                    }}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              )}

              {removing === m.id && (
                <div className="mt-2 space-y-2 rounded-md bg-secondary p-3" role="group" aria-label={`Remove ${m.name}`}>
                  <p className="text-sm">Tasks assigned to {m.name} will show as Unassigned.</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setRemoving(null)}>Cancel</Button>
                    <Button
                      variant="destructive"
                      autoFocus
                      onClick={() => run(() => manager.removeMember(team.id, m.id)) && setRemoving(null)}
                    >
                      Remove user
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <form onSubmit={addUser} className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="add-user">Add a user to {team.name}</Label>
          <Input
            id="add-user"
            value={newUser}
            onChange={(e) => {
              setNewUser(e.target.value);
              setError('');
            }}
            placeholder="Name"
          />
        </div>
        <Button type="submit">
          <Plus aria-hidden="true" className="size-4" />
          Add user
        </Button>
      </form>

      <div className="space-y-2 border-t pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button" variant="outline" disabled={Boolean(cantDelete)}
              aria-describedby={cantDelete ? 'team-delete-reason' : undefined}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Delete team
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete "{team.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes the team and its {team.members.length} {team.members.length === 1 ? 'user' : 'users'}. You can't undo.
            </AlertDialogDescription>
            <div className="mt-4 flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteTeam}>Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        {cantDelete && (
          <p id="team-delete-reason" className="text-xs text-muted-foreground">{cantDelete}</p>
        )}
      </div>
    </section>
  );
}
