import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label, Select, Textarea } from '@/components/ui/field';
import { cn } from '@/lib/utils';

// Outcome badge colours reuse the due-date tokens. Team-added outcomes stay neutral.
const OUTCOME_STYLES = {
  worked: 'border-due-safe text-due-safe',
  partial: 'border-due-warning text-due-warning',
  failed: 'border-due-overdue text-due-overdue',
};
const NEUTRAL = 'border-border text-muted-foreground';

export function OutcomeBadge({ id, label }) {
  return (
    <span className={cn('shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-xs', OUTCOME_STYLES[id] ?? NEUTRAL)}>
      {label}
    </span>
  );
}

const labelOf = (items, id) => items.find((i) => i.id === id)?.label ?? id;

export function newGoal(lists) {
  const now = new Date().toISOString();
  const pending = lists.outcomes.find((o) => o.id === 'pending') ?? lists.outcomes[0];
  return {
    id: crypto.randomUUID(),
    prompt: '',
    tool: lists.tools[0].id,
    outcome: pending.id,
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * The goal history of a task (M9): one prompt, tool, outcome and notes per goal,
 * newest last. Controlled: `goals` in, `onChange(goals)` out. Saved with the task.
 */
export default function GoalsEditor({ goals, lists, onChange, invalidIds = [] }) {
  // Goals with an open editor. New and invalid goals open automatically.
  const [open, setOpen] = useState(() => new Set());
  const isOpen = (id) => open.has(id) || invalidIds.includes(id);
  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const update = (id, field, value) =>
    onChange(goals.map((g) => (g.id === id ? { ...g, [field]: value, updatedAt: new Date().toISOString() } : g)));

  function add() {
    const goal = newGoal(lists);
    onChange([...goals, goal]);
    setOpen((s) => new Set(s).add(goal.id));
  }

  return (
    <section aria-labelledby="goals-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 id="goals-heading" className="text-sm font-semibold">
          Goals <span className="font-mono text-xs font-normal text-muted-foreground">({goals.length})</span>
        </h3>
        <Button type="button" variant="outline" onClick={add}>
          <Plus aria-hidden="true" className="size-4" />
          Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          No goals yet. Add the prompt you used, the AI tool and how it went.
        </p>
      ) : (
        <ol className="space-y-2">
          {goals.map((goal, index) => {
            const expanded = isOpen(goal.id);
            const invalid = invalidIds.includes(goal.id);
            const panelId = `goal-panel-${goal.id}`;
            return (
              <li key={goal.id} className={cn('rounded-md border bg-card', invalid && 'border-destructive')}>
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => toggle(goal.id)}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    className="flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-sm text-left text-sm"
                  >
                    {expanded ? (
                      <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
                    ) : (
                      <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
                    )}
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">#{index + 1}</span>
                    <span className={cn('truncate', !goal.prompt && 'italic text-muted-foreground')}>
                      {goal.prompt || 'No prompt yet'}
                    </span>
                  </button>
                  <span className="shrink-0 text-xs text-muted-foreground">{labelOf(lists.tools, goal.tool)}</span>
                  <OutcomeBadge id={goal.outcome} label={labelOf(lists.outcomes, goal.outcome)} />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0"
                    aria-label={`Remove goal ${index + 1}`}
                    onClick={() => onChange(goals.filter((g) => g.id !== goal.id))}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                  </Button>
                </div>

                {expanded && (
                  <div id={panelId} className="space-y-3 border-t p-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`goal-prompt-${goal.id}`}>Prompt</Label>
                      <Textarea
                        id={`goal-prompt-${goal.id}`}
                        className="min-h-24 font-mono text-xs"
                        value={goal.prompt}
                        onChange={(e) => update(goal.id, 'prompt', e.target.value)}
                        aria-invalid={invalid ? 'true' : undefined}
                        aria-describedby={invalid ? `goal-error-${goal.id}` : undefined}
                        placeholder="Paste the prompt you used (or plan to use)"
                      />
                      {invalid && (
                        <p id={`goal-error-${goal.id}`} className="text-sm text-destructive">
                          Add the prompt, or remove this goal.
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`goal-tool-${goal.id}`}>AI tool</Label>
                        <Select
                          id={`goal-tool-${goal.id}`}
                          value={goal.tool}
                          onChange={(e) => update(goal.id, 'tool', e.target.value)}
                        >
                          {lists.tools.map((t) => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`goal-outcome-${goal.id}`}>Outcome</Label>
                        <Select
                          id={`goal-outcome-${goal.id}`}
                          value={goal.outcome}
                          onChange={(e) => update(goal.id, 'outcome', e.target.value)}
                        >
                          {lists.outcomes.map((o) => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`goal-notes-${goal.id}`}>Notes</Label>
                      <Textarea
                        id={`goal-notes-${goal.id}`}
                        value={goal.notes}
                        onChange={(e) => update(goal.id, 'notes', e.target.value)}
                        placeholder="What happened, what to try next"
                      />
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
