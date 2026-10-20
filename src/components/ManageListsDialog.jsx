import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input, Label, Select } from '@/components/ui/field';
import { DEFAULT_LISTS } from '@/lib/defaults';
import { LIST_KEYS } from '@/lib/lists';
import { cn } from '@/lib/utils';

const LIST_INFO = {
  columns: { label: 'Columns', noun: 'task', help: 'The columns on the board, left to right.' },
  types: { label: 'Task types', noun: 'task', help: 'Feature, bug and any types your team adds.' },
  tools: { label: 'AI tools', noun: 'goal', help: 'The AI tools a goal can record.' },
  outcomes: { label: 'Outcomes', noun: 'goal', help: 'How a goal turned out.' },
};

const plural = (n, noun) => `${n} ${noun}${n === 1 ? '' : 's'}`;

/** Runs a list action and turns a thrown rule error into a message. */
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
 * Manage the team lists (PRD §7): add, rename, reorder, remove, reset.
 * `manager` is the object returned by useLists.
 */
export default function ManageListsDialog({ manager, onClose }) {
  const [active, setActive] = useState('columns');
  const tabRefs = useRef({});

  function onTabKey(e) {
    const i = LIST_KEYS.indexOf(active);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: LIST_KEYS.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const key = LIST_KEYS[(next + LIST_KEYS.length) % LIST_KEYS.length];
    setActive(key);
    tabRefs.current[key]?.focus();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogTitle>Manage lists</DialogTitle>
        <DialogDescription>
          Changes save straight away. Renaming never breaks existing tasks.
        </DialogDescription>

        <div role="tablist" aria-label="Lists" className="mt-4 flex flex-wrap gap-1 border-b" onKeyDown={onTabKey}>
          {LIST_KEYS.map((key) => (
            <button
              key={key}
              ref={(el) => (tabRefs.current[key] = el)}
              type="button"
              role="tab"
              id={`tab-${key}`}
              aria-selected={active === key}
              aria-controls={`panel-${key}`}
              tabIndex={active === key ? 0 : -1}
              onClick={() => setActive(key)}
              className={cn(
                '-mb-px min-h-10 border-b-2 px-3 text-sm',
                active === key
                  ? 'border-primary font-semibold text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {LIST_INFO[key].label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} className="pt-4">
          {/* key resets the panel's local state when switching lists */}
          <ListPanel key={active} listKey={active} manager={manager} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ListPanel({ listKey, manager }) {
  const items = manager.lists[listKey];
  const info = LIST_INFO[listKey];
  const [error, setError] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [renaming, setRenaming] = useState(null); // { id, label }
  const [removing, setRemoving] = useState(null); // { id, moveTo }
  const [resetting, setResetting] = useState(null); // { moveTo } or null

  const run = (fn) => attempt(fn, setError);

  function add(e) {
    e.preventDefault();
    if (run(() => manager.add(listKey, newLabel))) setNewLabel('');
  }

  function saveRename(e) {
    e.preventDefault();
    if (run(() => manager.rename(listKey, renaming.id, renaming.label))) setRenaming(null);
  }

  function startRemove(item) {
    setRenaming(null);
    if (manager.usageCount(listKey, item.id) === 0) {
      run(() => manager.remove(listKey, item.id));
      return;
    }
    const firstOther = items.find((i) => i.id !== item.id);
    setRemoving({ id: item.id, moveTo: firstOther?.id ?? '' });
  }

  // Non-default entries in use need somewhere to go before a reset.
  const defaults = DEFAULT_LISTS[listKey];
  const defaultIds = new Set(defaults.map((d) => d.id));
  const resetNeedsMove = items.some((i) => !defaultIds.has(i.id) && manager.usageCount(listKey, i.id) > 0);

  function confirmReset() {
    if (run(() => manager.reset(listKey, resetting.moveTo))) setResetting(null);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{info.help}</p>

      <ul className="divide-y rounded-md border" aria-label={info.label}>
        {items.map((item, index) => {
          const uses = manager.usageCount(listKey, item.id);
          const isRenaming = renaming?.id === item.id;
          const isRemoving = removing?.id === item.id;
          return (
            <li key={item.id} className="px-3 py-2">
              {isRenaming ? (
                <form onSubmit={saveRename} className="flex items-center gap-2">
                  <Label htmlFor={`rename-${item.id}`} className="sr-only">
                    New name for {item.label}
                  </Label>
                  <Input
                    id={`rename-${item.id}`}
                    value={renaming.label}
                    onChange={(e) => setRenaming({ ...renaming, label: e.target.value })}
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
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.label}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{plural(uses, info.noun)}</span>
                  {listKey === 'columns' && (
                    <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={Boolean(item.isDone)}
                        onChange={(e) => run(() => manager.setColumnDone(item.id, e.target.checked))}
                        className="size-4 accent-primary"
                      />
                      Done
                    </label>
                  )}
                  <div className="flex shrink-0">
                    <Button
                      size="icon" variant="ghost" className="size-8"
                      aria-label={`Move ${item.label} up`} disabled={index === 0}
                      onClick={() => run(() => manager.move(listKey, item.id, index - 1))}
                    >
                      <ArrowUp aria-hidden="true" className="size-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost" className="size-8"
                      aria-label={`Move ${item.label} down`} disabled={index === items.length - 1}
                      onClick={() => run(() => manager.move(listKey, item.id, index + 1))}
                    >
                      <ArrowDown aria-hidden="true" className="size-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost" className="size-8"
                      aria-label={`Rename ${item.label}`}
                      onClick={() => {
                        setRemoving(null);
                        setRenaming({ id: item.id, label: item.label });
                      }}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </Button>
                    <Button
                      size="icon" variant="ghost" className="size-8"
                      aria-label={`Remove ${item.label}`} disabled={items.length <= 1}
                      title={items.length <= 1 ? 'A list cannot be empty' : undefined}
                      onClick={() => startRemove(item)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {isRemoving && (
                <div className="mt-2 space-y-2 rounded-md bg-secondary p-3" role="group" aria-label={`Remove ${item.label}`}>
                  <p className="text-sm">
                    {plural(uses, info.noun)} {uses === 1 ? 'uses' : 'use'} "{item.label}". Move {uses === 1 ? 'it' : 'them'} to:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Label htmlFor={`move-${item.id}`} className="sr-only">Move to</Label>
                    <Select
                      id={`move-${item.id}`}
                      className="w-auto flex-1"
                      value={removing.moveTo}
                      onChange={(e) => setRemoving({ ...removing, moveTo: e.target.value })}
                      autoFocus
                    >
                      {items.filter((i) => i.id !== item.id).map((i) => (
                        <option key={i.id} value={i.id}>{i.label}</option>
                      ))}
                    </Select>
                    <Button variant="outline" onClick={() => setRemoving(null)}>Cancel</Button>
                    <Button
                      variant="destructive"
                      onClick={() => run(() => manager.remove(listKey, item.id, removing.moveTo)) && setRemoving(null)}
                    >
                      Move and remove
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}

      <form onSubmit={add} className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor={`add-${listKey}`}>Add to {info.label.toLowerCase()}</Label>
          <Input
            id={`add-${listKey}`}
            value={newLabel}
            onChange={(e) => {
              setNewLabel(e.target.value);
              setError('');
            }}
            placeholder="Name"
          />
        </div>
        <Button type="submit">
          <Plus aria-hidden="true" className="size-4" />
          Add
        </Button>
      </form>

      <div className="border-t pt-4">
        {resetting ? (
          <div className="space-y-2 rounded-md bg-secondary p-3" role="group" aria-label="Reset to defaults">
            <p className="text-sm">
              Reset {info.label.toLowerCase()} to: {defaults.map((d) => d.label).join(', ')}.
              {resetNeedsMove && ` Some ${info.noun}s use entries that will go. Move them to:`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {resetNeedsMove && (
                <>
                  <Label htmlFor={`reset-move-${listKey}`} className="sr-only">Move to</Label>
                  <Select
                    id={`reset-move-${listKey}`}
                    className="w-auto flex-1"
                    value={resetting.moveTo}
                    onChange={(e) => setResetting({ moveTo: e.target.value })}
                  >
                    {defaults.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </Select>
                </>
              )}
              <Button variant="outline" onClick={() => setResetting(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmReset}>Reset</Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setResetting({ moveTo: defaults[0].id })}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Reset to defaults
          </Button>
        )}
      </div>
    </div>
  );
}
