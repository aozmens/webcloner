"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "./data";
import { DIALOG_TRANSITION_MS, useDialogPresence } from "./use-dialog";

// The source queries its own /api/products and /api/predictive-search endpoints. Both return 404 on the
// published preview, so the live page always settles on "No products found"; the clone reproduces that state.
const LOAD_DELAY_MS = 350;

const transition = `${DIALOG_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { mounted, visible } = useDialogPresence(open, close);

  useEffect(() => {
    if (!open) return;
    const start = requestAnimationFrame(() => setLoading(true));
    const timer = window.setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => {
      cancelAnimationFrame(start);
      window.clearTimeout(timer);
    };
  }, [open, query]);

  const toggle = () => {
    if (open) setQuery("");
    setOpen(!open);
  };

  return (
    <>
      <button
        aria-label="Click to search"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        className={open ? "active" : undefined}
        onClick={toggle}
      >
        <img src={asset("/icons/magnifier.svg")} alt="Search" width={20} height={20} />
      </button>
      {mounted &&
        createPortal(
          <>
            <div
              id="search-overlay"
              style={{ opacity: visible ? 1 : 0, transition: `opacity ${transition}` }}
              onClick={() => {
                setQuery("");
                close();
              }}
            />
            <div
              className="search-bar"
              role="dialog"
              aria-modal="true"
              aria-label="Search Products"
              style={{ transform: `translateY(${visible ? "0%" : "-100%"})`, opacity: visible ? 1 : 0, transition: `transform ${transition}, opacity ${transition}` }}
            >
              <div className="head">
                <div className="field">
                  <input
                    id="search-field"
                    type="text"
                    className="paragraph-1 text-start"
                    placeholder="Search ..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    autoFocus
                  />
                  <button aria-label="Click to search" type="button" className="flex-center btn-search">
                    <img src={asset("/icons/magnifier.svg")} alt="" loading="lazy" width={20} height={20} />
                  </button>
                </div>
              </div>
              <div className="results" style={{ position: "relative" }}>
                {loading && (
                  <div className="loading-overlay">
                    <span className="ai-robots-spinner" />
                  </div>
                )}
                <div style={{ pointerEvents: loading ? "none" : "auto" }}>
                  {!loading && (
                    <div className="no-results">
                      <p className="paragraph-1 color-white">No products found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
