"use client";

import { useState, type ReactNode } from "react";

export type TabPanel = { id: string; title: string; content: ReactNode };

/** Tab strip styled like the nav pill bar; panels are pre-rendered on the server and only toggled here. */
export function ProductTabs({ panels }: { panels: TabPanel[] }) {
  const [active, setActive] = useState(panels[0]?.id);

  return (
    <div className="product-tabs">
      <div className="tab-list" role="tablist">
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            role="tab"
            id={`tab-${panel.id}`}
            aria-controls={`panel-${panel.id}`}
            aria-selected={panel.id === active}
            className={panel.id === active ? "tab active" : "tab"}
            onClick={() => setActive(panel.id)}
          >
            {panel.title}
          </button>
        ))}
      </div>
      {panels.map((panel) => (
        <div key={panel.id} role="tabpanel" id={`panel-${panel.id}`} aria-labelledby={`tab-${panel.id}`} hidden={panel.id !== active} className="tab-panel">
          {panel.content}
        </div>
      ))}
    </div>
  );
}
