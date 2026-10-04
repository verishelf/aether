import Link from "next/link";
import { ArrowUpRight, CreditCard, Handshake, Megaphone, Sparkles } from "lucide-react";
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
            <section className="revenue-panel">
              <p className="eyebrow">Revenue</p>
              <h2>Grow with AETHER</h2>
              <p className="revenue-intro">Thoughtful offers for brands aligned with our private community.</p>
              <Link className="revenue-item" href="/app/settings">
                <CreditCard size={17} />
                <span><strong>Membership</strong><small>Plans and billing</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=Advertising%20with%20AETHER">
                <Megaphone size={17} />
                <span><strong>Advertising</strong><small>Curated placements</small></span>
                <ArrowUpRight size={14} />
              </a>
              <a className="revenue-item" href="mailto:concierge@aether.social?subject=AETHER%20Partnership">
                <Handshake size={17} />
                <span><strong>Partnerships</strong><small>Build something together</small></span>
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
