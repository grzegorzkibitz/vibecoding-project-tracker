import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Create a project (`mode` 'new') or rename / delete the open one ('settings').
 * `manager` is the object returned by useProjects.
 */
export default function ProjectDialog({ mode, project, manager, teams, currentTeamId, onClose, onDone }) {
  const creating = mode === 'new';
  const [name, setName] = useState(creating ? '' : project.name);
  const [teamId, setTeamId] = useState(currentTeamId);
  const [error, setError] = useState('');
  const isLast = manager.projects.length <= 1;
  const tasks = creating ? 0 : manager.taskCount(project.id);

  function submit(e) {
    e.preventDefault();
    try {
      if (creating) {
        manager.create(name, teamId);
      } else {
        manager.rename(project.id, name);
        if (teamId !== currentTeamId) manager.setTeam(project.id, teamId);
      }
    } catch (err) {
      setError(err.message);
      return;
    }
    if (creating) onDone();
    onClose();
  }

  function remove() {
    manager.remove(project.id);
    onDone();
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogTitle>{creating ? 'New project' : 'Project settings'}</DialogTitle>
        <DialogDescription>
          {creating
            ? 'A new project gets its own board, deliverable links and lists, starting from the defaults.'
            : 'Rename this project, change its team, or delete it.'}
        </DialogDescription>

        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'project-name-error' : undefined}
              autoFocus
            />
            {error && (
              <p id="project-name-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-team">Team</Label>
            <Select
              id="project-team"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              aria-describedby="project-team-hint"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Select>
            <p id="project-team-hint" className="text-xs text-muted-foreground">
              Tasks can be assigned to this team's users. Add teams and users from Teams in the sidebar.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {creating ? (
              <span />
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" disabled={isLast}>
                    <Trash2 aria-hidden="true" className="size-4" />
                    Delete project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete "{project.name}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This deletes {plural(tasks, 'task')}, their goals, the deliverable links and the lists. You
                    can't undo.
                  </AlertDialogDescription>
                  <div className="mt-4 flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{creating ? 'Create project' : 'Save'}</Button>
            </div>
          </div>
          {!creating && isLast && (
            <p className="text-xs text-muted-foreground">This is your only project, so it can't be deleted.</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
