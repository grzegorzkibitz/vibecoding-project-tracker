import TaskCard from '@/components/TaskCard';

export default function Board({ columns, tasks, types }) {
  const typeLabel = (id) => types.find((t) => t.id === id)?.label ?? id;

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const headingId = `col-${col.id}`;
        return (
          <section
            key={col.id}
            aria-labelledby={headingId}
            className="flex w-72 shrink-0 flex-col rounded-lg bg-secondary p-3"
          >
            <h2
              id={headingId}
              className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide"
            >
              {col.label}
              <span className="rounded-sm bg-card px-1.5 py-0.5 font-mono text-muted-foreground">
                <span className="sr-only">Tasks: </span>
                {colTasks.length}
              </span>
            </h2>
            {colTasks.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
                Nothing here yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} typeLabel={typeLabel(task.type)} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
