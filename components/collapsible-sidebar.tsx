"use client";

import { ReactNode, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export function CollapsibleSidebar({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-sidebar-wrap${collapsed ? " is-collapsed" : ""}`}>
      <aside aria-label="Shortcuts and revenue opportunities" className="app-sidebar">
        <button
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand left sidebar" : "Collapse left sidebar"}
          className="sidebar-collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" size={17} /> : <PanelLeftClose aria-hidden="true" size={17} />}
        </button>
        {children}
      </aside>
    </div>
  );
}
