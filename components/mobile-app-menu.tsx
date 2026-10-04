"use client";

import Link from "next/link";
import { useState } from "react";
import { Boxes, Compass, Home, Layers3, Menu, MessageCircle, Settings, X } from "lucide-react";

const items = [
  { href: "/app/feed", label: "Feed", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/circles", label: "Circles", icon: Layers3 },
  { href: "/app/collection", label: "Collection", icon: Boxes },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function MobileAppMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        className="mobile-app-menu-toggle"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="mobile-app-menu-layer">
          <button aria-label="Close navigation menu" className="mobile-app-menu-backdrop" onClick={() => setOpen(false)} type="button" />
          <nav aria-label="App navigation" className="mobile-app-menu-panel">
            <span className="eyebrow">WealthCircle / Navigation</span>
            {items.map(({ href, label, icon: Icon }) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
