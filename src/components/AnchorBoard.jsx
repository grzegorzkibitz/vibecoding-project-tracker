import { useState } from 'react';
import { BookOpen, Check, ExternalLink, FileText, Pencil, Plus, Presentation, PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/field';
import { DEFAULT_ANCHORS } from '@/lib/defaults';
import { cn } from '@/lib/utils';

const ICONS = { presentation: Presentation, demo: PlayCircle, report: FileText, documentation: BookOpen };

/** Stored anchors merged onto the four fixed slots (old or corrupt storage). */
export function normalizeAnchors(stored) {
  const list = Array.isArray(stored) ? stored : [];
  return DEFAULT_ANCHORS.map((slot) => {
    const saved = list.find((a) => a?.id === slot.id);
    return { ...slot, url: typeof saved?.url === 'string' && saved.url ? saved.url : saved ? null : slot.url };
  });
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
 * Anchor Board (M11): the four final deliverables pinned above the Kanban board.
 * `onChange(id, url)` sets or clears (url null) one slot's link.
 */
export default function AnchorBoard({ anchors, onChange }) {
  return (
    <section id="anchors" tabIndex={-1} aria-labelledby="anchors-heading" className="shrink-0">
      <h2 id="anchors-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide">
        Deliverables
      </h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {anchors.map((anchor) => (
          <AnchorSlot key={anchor.id} anchor={anchor} onChange={(url) => onChange(anchor.id, url)} />
        ))}
      </ul>
    </section>
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
