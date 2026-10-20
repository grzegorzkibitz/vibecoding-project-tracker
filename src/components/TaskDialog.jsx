import { useState } from 'react';
import { Check, ClipboardCopy, Trash2 } from 'lucide-react';
import { copyText, taskToPromptContext } from '@/lib/promptContext';
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
import { Input, Label, Select, Textarea } from '@/components/ui/field';
import { TEAM } from '@/lib/defaults';
import GoalsEditor from '@/components/GoalsEditor';

const today = () => new Date().toISOString().slice(0, 10);

function blankTask(lists) {
  return {
    title: '',
    description: '',
    type: lists.types[0].id,
    status: lists.columns[0].id,
    assignee: TEAM[0],
    dueDate: null,
    goals: [],
  };
}

/**
 * Add / edit / delete a task (M5) and its goals (M9). `task` null = add mode.
 * Mount with a changing `key` so the form state resets for each task.
 */
export default function TaskDialog({ task, lists, onSave, onDelete, onClose }) {
  const editing = Boolean(task);
  const [form, setForm] = useState(() => ({ ...blankTask(lists), ...task, goals: task?.goals ?? [] }));
  const [error, setError] = useState('');
  const [invalidGoals, setInvalidGoals] = useState([]);

  const [copyState, setCopyState] = useState(null); // null | 'copied' | 'failed'

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // M10: copies what is on screen, including unsaved edits. Goals without a prompt are skipped.
  async function copyContext() {
    const snapshot = {
      ...form,
      title: form.title.trim() || 'Untitled task',
      goals: form.goals.filter((g) => g.prompt.trim()),
    };
    try {
      await copyText(taskToPromptContext(snapshot, lists));
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  function submit(e) {
    e.preventDefault();
    const emptyGoals = form.goals.filter((g) => !g.prompt.trim()).map((g) => g.id);
    setInvalidGoals(emptyGoals);
    if (!form.title.trim()) {
      setError('Give the task a title.');
      document.getElementById('task-title')?.focus();
      return;
    }
    if (emptyGoals.length > 0) {
      // Wait a frame: the invalid goal's editor opens on the next render.
      requestAnimationFrame(() => document.getElementById(`goal-prompt-${emptyGoals[0]}`)?.focus());
      return;
    }
    onSave({
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null,
      id: task?.id ?? crypto.randomUUID(),
      createdDate: task?.createdDate ?? today(),
      goals: form.goals.map((g) => ({ ...g, prompt: g.prompt.trim(), notes: g.notes.trim() })),
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogTitle>{editing ? 'Edit task' : 'New task'}</DialogTitle>
        <DialogDescription className="sr-only">
          {editing ? 'Change the details of this task.' : 'Fill in the details of the new task.'}
        </DialogDescription>

        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => {
                set('title')(e);
                setError('');
              }}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'task-title-error' : undefined}
              autoFocus
            />
            {error && (
              <p id="task-title-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-description">Description</Label>
            <Textarea id="task-description" value={form.description} onChange={set('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-type">Type</Label>
              <Select id="task-type" value={form.type} onChange={set('type')}>
                {lists.types.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-status">Status</Label>
              <Select id="task-status" value={form.status} onChange={set('status')}>
                {lists.columns.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Select id="task-assignee" value={form.assignee} onChange={set('assignee')}>
                {TEAM.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" value={form.dueDate ?? ''} onChange={set('dueDate')} />
            </div>
          </div>

          <div className="border-t pt-4">
            <GoalsEditor
              goals={form.goals}
              lists={lists}
              invalidIds={invalidGoals}
              onChange={(goals) => {
                setForm((f) => ({ ...f, goals }));
                setInvalidGoals((ids) => ids.filter((id) => goals.some((g) => g.id === id && !g.prompt.trim())));
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-md bg-secondary p-3">
            <Button type="button" variant="outline" onClick={copyContext}>
              {copyState === 'copied' ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <ClipboardCopy aria-hidden="true" className="size-4" />
              )}
              Copy as Prompt Context
            </Button>
            <p className="flex-1 text-xs text-muted-foreground">
              Copies the task and its goal history as Markdown, ready to paste into an AI chat.
            </p>
            <p aria-live="polite" className="w-full text-sm">
              {copyState === 'copied' && 'Copied to clipboard. Paste it into your AI tool.'}
              {copyState === 'failed' && (
                <span className="text-destructive">Couldn't copy. Your browser blocked clipboard access.</span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {editing ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <Trash2 aria-hidden="true" className="size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete this task?</AlertDialogTitle>
                  <AlertDialogDescription>You can't undo.</AlertDialogDescription>
                  <div className="mt-4 flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(task.id)}>Delete</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{editing ? 'Save' : 'Add task'}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
