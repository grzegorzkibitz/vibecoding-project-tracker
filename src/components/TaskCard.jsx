import { useDraggable } from '@dnd-kit/core';
import {
  Sparkles, Bug, CalendarDays, CalendarCheck, Clock, AlertTriangle, User, MessageSquareText, GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { dueStatus } from '@/lib/due';
import { assigneeName, memberFor } from '@/lib/teams';

const TYPE_STYLES = {
  feature: { icon: Sparkles, stripe: 'before:bg-type-feature', text: 'text-type-feature' },
  bug: { icon: Bug, stripe: 'before:bg-type-bug', text: 'text-type-bug' },
};
// New (team-added) types fall back to this neutral style.
const NEUTRAL = { icon: Sparkles, stripe: 'before:bg-muted-foreground', text: 'text-muted-foreground' };

// M8: card wash + date colour per due state. The label text carries the meaning too.
const DUE_STYLES = {
  safe: { icon: CalendarDays, card: 'bg-due-safe-wash', text: 'text-due-safe' },
  warning: { icon: Clock, card: 'bg-due-warning-wash', text: 'text-due-warning' },
  overdue: { icon: AlertTriangle, card: 'bg-due-overdue-wash', text: 'text-due-overdue' },
  done: { icon: CalendarCheck, card: 'bg-card', text: 'text-due-neutral' },
};

/**
 * A card on the board. `overlay` renders the copy that follows the pointer while
 * dragging: same look, no drag hooks, no controls.
 */
export default function TaskCard(props) {
  return props.overlay ? <CardView {...props} /> : <DraggableCard {...props} />;
}

function DraggableCard(props) {
  const { task } = props;
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });
  return (
    <CardView
      {...props}
      nodeRef={setNodeRef}
      listeners={listeners}
      handleProps={attributes}
      dragging={isDragging}
    />
  );
}

function CardView({ task, typeLabel, isDone, team, onOpen, onHandoff, overlay, nodeRef, listeners, handleProps, dragging }) {
  const style = TYPE_STYLES[task.type] ?? NEUTRAL;
  const TypeIcon = style.icon;
  const due = dueStatus(task.dueDate, isDone);
  const dueStyle = due && DUE_STYLES[due.state];
  const DueIcon = dueStyle?.icon;

  return (
    <li
      ref={nodeRef}
      {...listeners}
      className={cn(
        'relative overflow-hidden rounded-lg border transition-shadow hover:shadow-md',
        'before:absolute before:inset-y-0 before:left-0 before:w-1',
        style.stripe,
        dueStyle?.card ?? 'bg-card',
        dragging && 'opacity-40',
        overlay && 'cursor-grabbing shadow-lg',
      )}
    >
      <button
        type="button"
        tabIndex={overlay ? -1 : undefined}
        onClick={() => onOpen?.(task)}
        className="block w-full p-3 pb-1 pl-4 text-left"
      >
        <p className="text-sm font-medium">{task.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className={cn('inline-flex items-center gap-1 font-mono', style.text)}>
            <TypeIcon aria-hidden="true" className="size-3" />
            {typeLabel}
          </span>
          {task.goals?.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquareText aria-hidden="true" className="size-3" />
              {task.goals.length} {task.goals.length === 1 ? 'goal' : 'goals'}
            </span>
          )}
          {due && (
            <span className="inline-flex items-center gap-1">
              <DueIcon aria-hidden="true" className={cn('size-3', dueStyle.text)} />
              <span className={cn('font-medium', dueStyle.text)}>{due.label}</span>
              <time dateTime={task.dueDate}>· {due.date}</time>
            </span>
          )}
        </div>
      </button>

      <div className="flex items-center gap-1.5 px-4 pb-3">
        <User aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
        {overlay ? (
          <span className="text-xs text-muted-foreground">{assigneeName(team, task.assignee)}</span>
        ) : (
          <>
            {/* M7: owner + one-step handoff. Outside the card button so it isn't a nested control. */}
            <label htmlFor={`owner-${task.id}`} className="sr-only">
              Owner of {task.title}. Change to hand it off.
            </label>
            <select
              id={`owner-${task.id}`}
              value={memberFor(team, task.assignee)?.id ?? ''}
              onChange={(e) => onHandoff(task, e.target.value || null)}
              className="h-7 max-w-full rounded-md border border-transparent bg-transparent pr-1 text-xs text-muted-foreground hover:border-input hover:bg-card hover:text-foreground focus-visible:border-input"
            >
              <option value="">Unassigned</option>
              {team.members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </>
        )}

        {/* Drag handle: the keyboard way to move a card (WCAG 2.1.1). Mouse users can grab anywhere. */}
        <button
          type="button"
          data-drag-handle
          {...handleProps}
          tabIndex={overlay ? -1 : 0}
          aria-label={`Move ${task.title} to another column`}
          className="ml-auto inline-flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <GripVertical aria-hidden="true" className="size-4" />
        </button>
      </div>
    </li>
  );
}
