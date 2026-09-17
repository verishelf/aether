import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type AppHeaderProps = { name: string; email: string };

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
}

export function AppHeader({ name, email }: AppHeaderProps) {
  return <header className="dashboard-header"><Link className="app-topbar-brand" href="/app/feed">AETHER<span>.</span></Link><label className="search-bar"><Search size={15} /><span className="sr-only">Search AETHER</span><input type="search" placeholder="Search AETHER" /></label><div className="topbar-actions"><ThemeToggle /><Link className="dashboard-account" href="/app/settings" aria-label={`Open settings for ${name}`}><span className="avatar">{initials(name)}</span><span className="dashboard-account-copy"><strong>{name}</strong><small>{email}</small></span></Link></div></header>;
}
