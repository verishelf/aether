"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Compass, Home, Layers3, MessageCircle, Search, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileAppMenu } from "@/components/mobile-app-menu";

type AppHeaderProps = { name: string; username: string };

const tabs = [
  { href: "/app/feed", label: "Feed", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/circles", label: "Circles", icon: Layers3 },
  { href: "/app/collection", label: "Collection", icon: Boxes },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
}

export function AppHeader({ name, username }: AppHeaderProps) {
  const pathname = usePathname() ?? "";

  return (
    <header className="dashboard-header">
      <MobileAppMenu />
      <Link className="app-topbar-brand" href="/app/feed">WealthCircle</Link>
      <label className="search-bar">
        <Search size={15} />
        <span className="sr-only">Search WealthCircle</span>
        <input type="search" placeholder="Search WealthCircle" />
      </label>
      <nav aria-label="Main navigation" className="top-tabs">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/app/feed" && pathname.startsWith(`${href}/`));
          return <Link aria-current={active ? "page" : undefined} aria-label={label} className={active ? "active" : undefined} href={href} key={href} title={label}><Icon aria-hidden="true" size={19} strokeWidth={1.7} /></Link>;
        })}
      </nav>
      <div className="topbar-actions">
        <ThemeToggle />
        <Link className="dashboard-account" href={`/app/profile/${username}`} aria-label={`Open public profile for ${name}`}>
          <span className="avatar">{initials(name)}</span>
        </Link>
      </div>
    </header>
  );
}
