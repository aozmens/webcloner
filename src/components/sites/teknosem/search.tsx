"use client";

import { Search as SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { NavData } from "./nav-data";
import { ProductThumb } from "./primitives";
import { DIALOG_TRANSITION_MS, useDialogPresence } from "./use-dialog";

const transition = `${DIALOG_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

const normalize = (value: string) => value.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");

/** Product search over the catalog (same category › group order as the menus). */
export function Search({ nav }: { nav: NavData }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const { mounted, visible } = useDialogPresence(open, close);

  const entries = useMemo(
    () =>
      nav.categories.flatMap((category) =>
        category.groups.flatMap((group) =>
          group.products.map((p) => ({
            ...p,
            label: group.products.length === 1 ? category.title : `${category.title} › ${group.title}`,
            haystack: normalize(`${p.name} ${p.short} ${category.title} ${group.title} ${p.summary}`),
          })),
        ),
      ),
    [nav],
  );

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter((term) => term.length >= 2);
    if (terms.length === 0) return entries;
    return entries.filter((entry) => terms.every((term) => entry.haystack.includes(term)));
  }, [entries, query]);

  return (
    <>
      <button
        aria-label="Ürün ara"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={open ? "active" : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <SearchIcon aria-hidden />
      </button>
      {mounted &&
        createPortal(
          <>
            <div id="search-overlay" style={{ opacity: visible ? 1 : 0, transition: `opacity ${transition}` }} onClick={close} />
            <div
              className="search-bar"
              role="dialog"
              aria-modal="true"
              aria-label="Ürün Ara"
              style={{ transform: `translateY(${visible ? "0%" : "-100%"})`, opacity: visible ? 1 : 0, transition: `transform ${transition}, opacity ${transition}` }}
            >
              <div className="head">
                <div className="field">
                  <input
                    id="search-field"
                    type="text"
                    className="paragraph-1 text-start"
                    placeholder="Ürün ara ..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    autoFocus
                  />
                  <button type="button" className="flex-center btn-search" aria-label="Ara" onClick={() => document.getElementById("search-field")?.focus()}>
                    <SearchIcon aria-hidden />
                  </button>
                </div>
              </div>
              <div className="results">
                {results.length > 0 ? (
                  <div className="list-results">
                    {results.map((entry) => (
                      <a key={entry.slug} href={entry.href} className="result result-link">
                        <div className="pic">
                          <ProductThumb image={entry.thumb} size={320} />
                        </div>
                        <p className="subtitle-3 color-white">{entry.name}</p>
                        <div className="info">
                          <span className="paragraph-1">{entry.label}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p className="paragraph-1 color-white">Ürün bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
