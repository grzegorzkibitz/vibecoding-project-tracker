// Keyboard dragging between board columns (dnd-kit). No React in here.

/** The column one step left (-1) or right (+1) of `currentId`, clamped to the ends. */
export function stepColumn(columnIds, currentId, direction) {
  const i = columnIds.indexOf(currentId);
  if (i === -1) return columnIds[0];
  return columnIds[Math.max(0, Math.min(columnIds.length - 1, i + direction))];
}

/**
 * dnd-kit keyboard coordinate getter: ←/→ jump the card to the middle of the
 * previous / next column instead of nudging it a few pixels.
 * Column droppables have ids `column:<id>`.
 */
export function columnKeyboardCoordinates(columnIds) {
  return (event, { currentCoordinates, context }) => {
    const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.code];
    if (!direction) return undefined;
    event.preventDefault();

    const { over, active, collisionRect, droppableRects } = context;
    const current = over?.id?.toString().replace(/^column:/, '') ?? active?.data.current?.status;
    const target = droppableRects.get(`column:${stepColumn(columnIds, current, direction)}`);
    if (!target || !collisionRect) return currentCoordinates;

    return {
      x: target.left + (target.width - collisionRect.width) / 2,
      y: currentCoordinates.y,
    };
  };
}
