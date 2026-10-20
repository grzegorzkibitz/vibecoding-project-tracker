import { Sparkles, Bug, CalendarDays, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_STYLES = {
  feature: { icon: Sparkles, stripe: 'before:bg-type-feature', text: 'text-type-feature' },
  bug: { icon: Bug, stripe: 'before:bg-type-bug', text: 'text-type-bug' },
};
// New (team-added) types fall back to this neutral style.
const NEUTRAL = { icon: Sparkles, stripe: 'before:bg-muted-foreground', text: 'text-muted-foreground' };

export default function TaskCard({ task, typeLabel }) {
  const style = TYPE_STYLES[task.type] ?? NEUTRAL;
  const TypeIcon = style.icon;

  return (
    <li
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card p-3 pl-4 transition-shadow hover:shadow-md',
        'before:absolute before:inset-y-0 before:left-0 before:w-1',
        style.stripe,
      )}
    >
      <p className="text-sm font-medium">{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className={cn('inline-flex items-center gap-1 font-mono', style.text)}>
          <TypeIcon aria-hidden="true" className="size-3" />
          {typeLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <User aria-hidden="true" className="size-3" />
          {task.assignee}
        </span>
        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <CalendarDays aria-hidden="true" className="size-3" />
            {task.dueDate}
          </span>
        )}
      </div>
    </li>
  );
}
