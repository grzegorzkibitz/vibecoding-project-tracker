import { useRef, useState } from 'react';
import {
  BookOpen, Bookmark, Check, ExternalLink, FileText, Pencil, Plus, Presentation, PlayCircle, Trash2, X,
} from 'lucide-react';
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
import { Input, Label, Textarea } from '@/components/ui/field';
import { DEFAULT_ANCHORS } from '@/lib/defaults';
import { cn } from '@/lib/utils';

const ICONS = { presentation: Presentation, demo: PlayCircle, report: FileText, documentation: BookOpen };

export const NOTE_MAX = 500;

const str = (v) => (typeof v === 'string' && v ? v : null);

/**
 * Stored anchors merged onto the four fixed slots (old or corrupt storage), then
 * the team's custom deliverables: { id, custom: true, label, url, text }.
 */
export function normalizeAnchors(stored) {
  const list = Array.isArray(stored) ? stored : [];
  const fixed = DEFAULT_ANCHORS.map((slot) => {
    const saved = list.find((a) => a?.id === slot.id);
    return { ...slot, url: str(saved?.url) ?? (saved ? null : slot.url) };
  });
  const custom = list
    .filter((a) => a?.custom && typeof a.id === 'string' && str(a.label))
    .map((a) => ({ id: a.id, custom: true, label: a.label, url: str(a.url), text: str(a.text) }));
  return [...fixed, ...custom];
}

/** Accepts "example.com/x" too, by adding https://. Returns null when it isn't a web link. */
export function cleanUrl(raw) {
  const text = raw.trim();
  if (!text) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.') && url.hostname !== 'localhost') return null;
    return url.href;
  } catch {
    return null;
  }
}

const shortUrl = (href) => {
  const u = new URL(href);
  return (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, '');
};

/**
 * Anchor Board (M11): the four final deliverables pinned above the Kanban board,
 * plus any custom ones the team adds (a header with an optional link and note).
 * Custom ones are added and edited in a modal.
 * `onChange(id, patch)` updates one entry, `onAdd(anchor)` appends a custom one,
 * `onRemove(id)` deletes a custom one.
 */
export default function AnchorBoard({ anchors, onChange, onAdd, onRemove }) {
  const [editing, setEditing] = useState(null); // null = closed, 'new', or the custom anchor
  const addRef = useRef(null);
  const deleted = useRef(false);

  return (
    <section id="anchors" tabIndex={-1} aria-labelledby="anchors-heading" className="shrink-0">
      <h2 id="anchors-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide">
        Deliverables
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {anchors.map((anchor) =>
          anchor.custom ? (
            <CustomCard key={anchor.id} anchor={anchor} onEdit={() => setEditing(anchor)} />
          ) : (
            <AnchorSlot key={anchor.id} anchor={anchor} onChange={(url) => onChange(anchor.id, { url })} />
          ),
        )}
        <li className="flex rounded-lg border border-dashed">
          <button
            ref={addRef}
            type="button"
            onClick={() => setEditing('new')}
            aria-haspopup="dialog"
            className="flex min-h-16 w-full items-center justify-center gap-1 rounded-lg p-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add deliverable
          </button>
        </li>
      </ul>

      {editing && (
        <DeliverableDialog
          key={editing === 'new' ? 'new' : editing.id}
          anchor={editing === 'new' ? null : editing}
          onSave={(fields) => {
            if (editing === 'new') onAdd({ id: crypto.randomUUID(), custom: true, ...fields });
            else onChange(editing.id, fields);
            setEditing(null);
          }}
          onDelete={() => {
            deleted.current = true;
            onRemove(editing.id);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
          // After a delete the card that opened the modal is gone, so focus the Add tile instead.
          onCloseAutoFocus={(e) => {
            if (!deleted.current) return;
            deleted.current = false;
            e.preventDefault();
            addRef.current?.focus();
          }}
        />
      )}
    </section>
  );
}

/** A custom deliverable on the board: header, note, link, and an Edit button that opens the modal. */
function CustomCard({ anchor, onEdit }) {
  return (
    <li className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <Bookmark aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{anchor.label}</h3>
        <Button
          size="icon" variant="ghost" className="size-8"
          aria-label={`Edit ${anchor.label}`}
          aria-haspopup="dialog"
          onClick={onEdit}
        >
          <Pencil aria-hidden="true" className="size-4" />
        </Button>
      </div>
      {anchor.text && <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">{anchor.text}</p>}
      {anchor.url && (
        <a
          href={anchor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 rounded-sm text-sm underline underline-offset-2 hover:text-primary"
        >
          <span className="truncate">{shortUrl(anchor.url)}</span>
          <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </li>
  );
}

/** Add (`anchor` null) or edit / delete a custom deliverable. */
function DeliverableDialog({ anchor, onSave, onDelete, onClose, onCloseAutoFocus }) {
  const isNew = !anchor;
  const [form, setForm] = useState({ label: anchor?.label ?? '', url: anchor?.url ?? '', text: anchor?.text ?? '' });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  function save(e) {
    e.preventDefault();
    const label = form.label.trim();
    const url = form.url.trim() ? cleanUrl(form.url) : null;
    const next = {
      label: label ? undefined : 'Give it a header.',
      url: form.url.trim() && !url ? 'Enter a web link, e.g. https://docs.google.com/...' : undefined,
    };
    if (next.label || next.url) {
      setErrors(next);
      document.getElementById(next.label ? 'deliverable-label' : 'deliverable-url')?.focus();
      return;
    }
    onSave({ label, url, text: form.text.trim() || null });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <DialogTitle>{isNew ? 'New deliverable' : 'Edit deliverable'}</DialogTitle>
        <DialogDescription>
          A header, with a link, a note, or both. It shows with the other deliverables above the board.
        </DialogDescription>

        <form onSubmit={save} noValidate className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="deliverable-label">Header</Label>
            <Input
              id="deliverable-label"
              value={form.label}
              onChange={set('label')}
              maxLength={60}
              placeholder="e.g. Poster"
              aria-invalid={errors.label ? 'true' : undefined}
              aria-describedby={errors.label ? 'deliverable-label-error' : undefined}
              autoFocus
            />
            {errors.label && (
              <p id="deliverable-label-error" role="alert" className="text-sm text-destructive">{errors.label}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliverable-url">
              Link <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="deliverable-url"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={form.url}
              onChange={set('url')}
              aria-invalid={errors.url ? 'true' : undefined}
              aria-describedby={errors.url ? 'deliverable-url-error' : undefined}
            />
            {errors.url && (
              <p id="deliverable-url-error" role="alert" className="text-sm text-destructive">{errors.url}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliverable-text">
              Note <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="deliverable-text"
              rows={3}
              value={form.text}
              onChange={set('text')}
              maxLength={NOTE_MAX}
              aria-describedby="deliverable-text-count"
            />
            <p id="deliverable-text-count" className="text-right text-xs text-muted-foreground">
              {form.text.length}/{NOTE_MAX}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isNew ? (
              <span />
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline">
                    <Trash2 aria-hidden="true" className="size-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete "{anchor.label}"?</AlertDialogTitle>
                  <AlertDialogDescription>You can't undo.</AlertDialogDescription>
                  <div className="mt-4 flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{isNew ? 'Add deliverable' : 'Save'}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AnchorSlot({ anchor, onChange }) {
  const Icon = ICONS[anchor.id] ?? FileText;
  const [draft, setDraft] = useState(null); // null = not editing
  const [error, setError] = useState('');
  const inputId = `anchor-${anchor.id}`;

  function save(e) {
    e.preventDefault();
    if (!draft.trim()) {
      onChange(null);
      setDraft(null);
      return;
    }
    const url = cleanUrl(draft);
    if (!url) {
      setError('Enter a web link, e.g. https://docs.google.com/...');
      return;
    }
    onChange(url);
    setDraft(null);
  }

  const cancel = () => {
    setDraft(null);
    setError('');
  };

  return (
    <li className={cn('rounded-lg border bg-card p-3', !anchor.url && draft === null && 'border-dashed')}>
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <h3 className="flex-1 text-sm font-semibold">{anchor.label}</h3>
        {anchor.url && draft === null && (
          <Button
            size="icon" variant="ghost" className="size-8"
            aria-label={`Change ${anchor.label} link`}
            onClick={() => setDraft(anchor.url)}
          >
            <Pencil aria-hidden="true" className="size-4" />
          </Button>
        )}
      </div>

      {draft !== null ? (
        <form onSubmit={save} noValidate className="mt-2 space-y-1.5">
          <Label htmlFor={inputId} className="sr-only">{anchor.label} link</Label>
          <div className="flex gap-1">
            <Input
              id={inputId}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Escape' && cancel()}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
              autoFocus
            />
            <Button type="submit" size="icon" variant="ghost" aria-label={`Save ${anchor.label} link`}>
              <Check aria-hidden="true" className="size-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" aria-label="Cancel" onClick={cancel}>
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>
          {error ? (
            <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive">{error}</p>
          ) : (
            <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">Leave empty and save to remove the link.</p>
          )}
        </form>
      ) : anchor.url ? (
        <a
          href={anchor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 rounded-sm text-sm underline underline-offset-2 hover:text-primary"
        >
          <span className="truncate">{shortUrl(anchor.url)}</span>
          <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setDraft('')}
          className="mt-1 flex min-h-8 items-center gap-1 rounded-sm text-sm text-muted-foreground hover:text-foreground"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add link<span className="sr-only"> for {anchor.label}</span>
        </button>
      )}
    </li>
  );
}
