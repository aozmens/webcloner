"use client";

import { useEffect, useState } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Matches react-spring's `config.slow` enter/leave used by the source's Radix dialogs.
export const DIALOG_TRANSITION_MS = 700;

/** Keeps a dialog mounted through its leave transition and pauses page scrolling while it is open. */
export function useDialogPresence(open: boolean, onClose: () => void) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const hide = requestAnimationFrame(() => setVisible(false));
    const timer = window.setTimeout(() => setMounted(false), DIALOG_TRANSITION_MS);
    return () => {
      cancelAnimationFrame(hide);
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      smoother?.paused(false);
    };
  }, [open, onClose]);

  return { mounted, visible };
}
