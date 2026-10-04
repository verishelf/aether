import Link from "next/link";
import { Boxes, Compass, Home, Layers3, MessageCircle, Settings, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/app/feed", label: "Feed", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/circles", label: "Circles", icon: Layers3 },
  { href: "/app/collection", label: "Collection", icon: Boxes },
  { href: "/app/messages", label: "Messages", icon: MessageCircle },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

const onlineMembers = [
  { name: "Matteo Conti", role: "Architecture · Milan", initials: "MC" },
  { name: "Sarah Kim", role: "Philanthropy · Seoul", initials: "SK" },
  { name: "Lena Moreau", role: "Art & Design · Paris", initials: "LM" },
];

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
}

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Member");
  let { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle();
  if (!profile) {
    const username = (user.email?.split("@")[0] || "member").toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 30);
    const { data: created } = await supabase.from("profiles").insert({ id: user.id, display_name: name, username }).select("username").maybeSingle();
    profile = created;
  }
  const username = profile?.username ?? user.email?.split("@")[0] ?? "member";

  return (
    <>
      <AppHeader name={name} email={user.email ?? ""} username={username} />
      <div className="dashboard-content">
        <div className="app-shell">
          <aside className="app-sidebar">
            <Link className="wordmark" href="/">AETHER<span>.</span></Link>
            <nav>
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Icon size={17} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="sidebar-profile">
              <span className="avatar">{initials(name)}</span>
              <span>{name}</span>
            </div>
          </aside>

          <div className="app-main-panel">{children}</div>

          <aside className="app-rightbar">
            <div className="rightbar-heading">
              <span className="eyebrow">Your network</span>
              <Sparkles size={16} />
            </div>
            <article className="sponsor-card">
              <span className="sponsor-label">Membership</span>
              <div className="sponsor-mark">A</div>
              <h2>AETHER SOCIETY</h2>
              <p>Your private network is ready to expand with purpose.</p>
              <Link href="/app/settings">
                Manage access <span>↗</span>
              </Link>
            </article>
            <article className="people-card">
              <div className="rightbar-heading">
                <span className="eyebrow">Suggested</span>
              </div>
              <div className="person-row">
                <span className="avatar">MC</span>
                <span>
                  <strong>Matteo Conti</strong>
                  <p>Architecture · Milan</p>
                </span>
                <button type="button">Invite</button>
              </div>
              <div className="person-row">
                <span className="avatar">SK</span>
                <span>
                  <strong>Sarah Kim</strong>
                  <p>Philanthropy · Seoul</p>
                </span>
                <button type="button">Follow</button>
              </div>
            </article>
          </aside>
        </div>

      </div>
      <details className="circles-quick-access">
        <summary>
          <span className="circles-tab">Circles</span>
          <span className="online-pill">6 online</span>
        </summary>
        <div className="circles-popup">
          <div className="circles-popup-header">
            <span className="eyebrow">Online now</span>
            <span className="online-dot" aria-label="6 people online" />
          </div>

          {onlineMembers.map((member) => (
            <Link className="circles-member" href="/app/circles" key={member.name}>
              <span className="avatar">{member.initials}</span>
              <span>
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </span>
              <span className="presence" aria-label="Online" />
            </Link>
          ))}

          <Link className="circles-more" href="/app/circles">
            View all circles <span>↗</span>
          </Link>
        </div>
      </details>
    </>
  );
}
