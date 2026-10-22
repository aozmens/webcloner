"use client";

import { useState, type DragEvent } from "react";

type Result = { ok: true } | { ok: false; error: string };

/**
 * A list the editor can reorder with the ↑/↓ buttons (phones) or by dragging rows (desktop). The new order is
 * shown at once and saved through `save`; if saving fails, the previous order comes back.
 */
export function useOrderedList<T extends { id: string }>(initial: T[], save: (ids: string[]) => Promise<Result>, onError: (message: string) => void) {
  const [items, setItems] = useState(initial);
  const [source, setSource] = useState(initial);
  const [dragging, setDragging] = useState<number | null>(null);

  // Fresh data from the server (after any save) replaces the local copy.
  if (initial !== source) {
    setSource(initial);
    setItems(initial);
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const previous = items;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    save(next.map((item) => item.id)).then((result) => {
      if (!result.ok) {
        setItems(previous);
        onError(result.error);
      }
    });
  };

  const dragProps = (index: number) => ({
    draggable: true,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.effectAllowed = "move";
      setDragging(index);
    },
    onDragOver: (event: DragEvent) => event.preventDefault(),
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      if (dragging !== null) move(dragging, index);
      setDragging(null);
    },
    onDragEnd: () => setDragging(null),
    "data-dragging": dragging === index || undefined,
  });

  return { items, move, dragProps };
}
