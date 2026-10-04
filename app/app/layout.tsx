import Link from "next/link";
import { ArrowUpRight, Bookmark, Building2, CalendarDays, CircleUserRound, Compass, CreditCard, Handshake, Megaphone, MessageCircle, Network, Sparkles, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";

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
      <AppHeader name={name} email={user.email ?? ""} onlineMembers={onlineMembers} username={username} />
      <div className="dashboard-content">
        <div className="app-shell">
          <aside className="app-sidebar">
            <section className="sidebar-shortcuts">
              <p className="eyebrow">Shortcuts</p>
              <Link className="sidebar-shortcut" href={`/app/profile/${username}`}><CircleUserRound size={17} /><span>My profile</span></Link>
              <Link className="sidebar-shortcut" href="/app/collection"><Bookmark size={17} /><span>Saved collection</span></Link>
              <Link className="sidebar-shortcut" href="/app/circles"><UsersRound size={17} /><span>My circles</span></Link>
              <Link className="sidebar-shortcut" href="/app/messages"><MessageCircle size={17} /><span>Messages</span></Link>
              <Link className="sidebar-shortcut" href="/app/explore"><Compass size={17} /><span>Discover people</span></Link>
            </section>
            <section className="revenue-panel">
              <p className="eyebrow">Revenue opportunities</p>
              <h2>Grow with AETHER</h2>
              <p className="revenue-intro">Reach a private, high-intent community through considered offers and experiences.</p>
              <Link className="revenue-item" href="/app/settings">
                <CreditCard size={17} />
                <span><strong>Membership</strong><small>Plans and billing</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=Advertising%20with%20AETHER">
                <Megaphone size={17} />
                <span><strong>Brand placements</strong><small>Advertising opportunities</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=Sponsored%20AETHER%20Circle">
                <UsersRound size={17} />
                <span><strong>Circle sponsorship</strong><small>Support a member community</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=Private%20AETHER%20Event">
                <CalendarDays size={17} />
                <span><strong>Private events</strong><small>Host salons and experiences</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=Corporate%20AETHER%20Membership">
                <Building2 size={17} />
                <span><strong>Corporate access</strong><small>Team and office memberships</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=AETHER%20Strategic%20Partnership">
                <Handshake size={17} />
                <span><strong>Strategic partnerships</strong><small>Co-branded programs</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=AETHER%20Network%20Services">
                <Network size={17} />
                <span><strong>Network services</strong><small>Vetted member offerings</small></span>
                <ArrowUpRight size={14} />
              </a>
            </section>
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
    </>
  );
}
