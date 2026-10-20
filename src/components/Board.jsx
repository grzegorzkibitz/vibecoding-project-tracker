import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from '@/components/TaskCard';
import { columnKeyboardCoordinates } from '@/lib/dragColumns';
import { cn } from '@/lib/utils';

// Pointer drags start anywhere on the card except form controls (the owner dropdown).
class CardPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({ nativeEvent }) =>
        nativeEvent.isPrimary && nativeEvent.button === 0 && !nativeEvent.target.closest('select, input, textarea'),
    },
  ];
}

// Keyboard drags start only from the drag handle, so Space/Enter on the card still opens it.
class HandleKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: 'onKeyDown',
      handler: (event, options, context) =>
        Boolean(event.nativeEvent.target.closest('[data-drag-handle]')) &&
        KeyboardSensor.activators[0].handler(event, options, context),
    },
  ];
}

// Pointer: the column under the pointer. Keyboard (no pointer): the column the card overlaps.
const collision = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
};

const columnOf = (overId) => overId?.toString().replace(/^column:/, '');

export default function Board({ columns, tasks, types, team, onOpen, onHandoff, onMove }) {
  const typeLabel = (id) => types.find((t) => t.id === id)?.label ?? id;
  const columnLabel = (id) => columns.find((c) => c.id === id)?.label ?? id;
  const [activeTask, setActiveTask] = useState(null);

  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const sensors = useSensors(
    // A 6 px move before dragging, so a click still opens the card.
    useSensor(CardPointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(HandleKeyboardSensor, { coordinateGetter: columnKeyboardCoordinates(columnIds) }),
  );

  const titleOf = (id) => tasks.find((t) => t.id === id)?.title ?? 'task';
  // Screen-reader messages for each step of a drag (WCAG 4.1.3).
  const accessibility = {
    screenReaderInstructions: {
      draggable:
        'To move this task to another column, press Space to pick it up. Use the left and right arrow keys to choose a column, Space to drop, or Escape to cancel.',
    },
    announcements: {
      onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
      onDragOver: ({ active, over }) =>
        over ? `${titleOf(active.id)} is over ${columnLabel(columnOf(over.id))}.` : `${titleOf(active.id)} is not over a column.`,
      onDragEnd: ({ active, over }) =>
        over ? `Dropped ${titleOf(active.id)} in ${columnLabel(columnOf(over.id))}.` : `${titleOf(active.id)} was dropped. It did not move.`,
      onDragCancel: ({ active }) => `Cancelled. ${titleOf(active.id)} did not move.`,
    },
  };

  function handleDragEnd({ active, over }) {
    setActiveTask(null);
    const task = tasks.find((t) => t.id === active.id);
    const to = columnOf(over?.id);
    if (task && to && to !== task.status) onMove(task, to);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      accessibility={accessibility}
      onDragStart={({ active }) => setActiveTask(tasks.find((t) => t.id === active.id) ?? null)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-2">
        {columns.map((col) => {
          // Tasks pointing at a missing column (stale data) fall into the first column.
          const colTasks = tasks.filter(
            (t) => t.status === col.id || (col === columns[0] && !columns.some((c) => c.id === t.status)),
          );
          return (
            <Column key={col.id} column={col} count={colTasks.length}>
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  typeLabel={typeLabel(task.type)}
                  isDone={Boolean(col.isDone)}
                  team={team}
                  onHandoff={onHandoff}
                  onOpen={onOpen}
                />
              ))}
            </Column>
          );
        })}
      </div>

      {/* The card that follows the pointer; it floats above the scroll container so it isn't clipped. */}
      <DragOverlay>
        {activeTask && (
          <ul className="rotate-1 shadow-lg">
            <TaskCard
              task={activeTask}
              typeLabel={typeLabel(activeTask.type)}
              isDone={Boolean(columns.find((c) => c.id === activeTask.status)?.isDone)}
              team={team}
              overlay
            />
          </ul>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function Column({ column, count, children }) {
  const { setNodeRef, isOver } = useDroppable({ id: `column:${column.id}` });
  const headingId = `col-${column.id}`;
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-lg bg-secondary p-3 outline-2 outline-offset-2 transition-[outline-color]',
        isOver ? 'outline outline-primary' : 'outline-transparent',
      )}
    >
      <h2
        id={headingId}
        className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide"
      >
        {column.label}
        <span className="rounded-sm bg-card px-1.5 py-0.5 font-mono text-muted-foreground">
          <span className="sr-only">Tasks: </span>
          {count}
        </span>
      </h2>
      {count === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
          {isOver ? 'Drop here.' : 'Nothing here yet.'}
        </p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </section>
  );
}
