"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Compass, Home, Layers3, MessageCircle, Search, Settings, UsersRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileAppMenu } from "@/components/mobile-app-menu";

type OnlineMember = { name: string; role: string; initials: string };
type AppHeaderProps = { name: string; email: string; username: string; onlineMembers: OnlineMember[] };

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

export function AppHeader({ name, email, username, onlineMembers }: AppHeaderProps) {
  const pathname = usePathname() ?? "";

  return (
    <header className="dashboard-header">
      <MobileAppMenu />
      <Link className="app-topbar-brand" href="/app/feed">AETHER<span>.</span></Link>
      <label className="search-bar">
        <Search size={15} />
        <span className="sr-only">Search AETHER</span>
        <input type="search" placeholder="Search AETHER" />
      </label>
      <nav aria-label="Main navigation" className="top-tabs">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/app/feed" && pathname.startsWith(`${href}/`));
          return <Link aria-current={active ? "page" : undefined} aria-label={label} className={active ? "active" : undefined} href={href} key={href} title={label}><Icon aria-hidden="true" size={19} strokeWidth={1.7} /></Link>;
        })}
      </nav>
      <div className="topbar-actions">
        <details className="circles-header-menu">
          <summary aria-label="Open circles quick access" title="Circles">
            <UsersRound size={19} />
            <span aria-label="Members online" className="circles-header-presence" />
          </summary>
          <div className="circles-popup">
            <div className="circles-popup-header">
              <span className="eyebrow">Online now</span>
              <span className="online-dot" aria-label="Members are online" />
            </div>
            {onlineMembers.map((member) => (
              <Link className="circles-member" href="/app/circles" key={member.name}>
                <span className="avatar">{member.initials}</span>
                <span><strong>{member.name}</strong><small>{member.role}</small></span>
                <span className="presence" aria-label="Online" />
              </Link>
            ))}
            <Link className="circles-more" href="/app/circles">View all circles <span>↗</span></Link>
          </div>
        </details>
        <ThemeToggle />
        <Link className="dashboard-account" href={`/app/profile/${username}`} aria-label={`Open public profile for ${name}`}>
          <span className="avatar">{initials(name)}</span>
          <span className="dashboard-account-copy"><strong>{name}</strong><small>{email}</small></span>
        </Link>
      </div>
    </header>
  );
}
