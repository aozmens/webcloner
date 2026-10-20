"use client";

/** The page is prerendered, so the year is re-read in the browser to stay current between builds. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
