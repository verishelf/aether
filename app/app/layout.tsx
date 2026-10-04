import Link from "next/link";
import { ArrowUpRight, Bookmark, Building2, CalendarDays, CircleUserRound, Compass, CreditCard, Handshake, Megaphone, MessageCircle, Network, Sparkles, UsersRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { CollapsibleSidebar } from "@/components/collapsible-sidebar";
import { FriendsOnlineWidget } from "@/components/friends-online-widget";
import { AvatarCircle } from "@/components/avatar-circle";
import { redirect } from "next/navigation";

const onlineMembers = [
  { username: "matteo-conti", name: "Matteo Conti", role: "Architecture · Milan", initials: "MC" },
  { username: "alexander-wei", name: "Alexander Wei", role: "Family offices · Singapore", initials: "AW" },
  { username: "lena-moreau", name: "Lena Moreau", role: "Art & Design · Paris", initials: "LM" },
  { username: "ines-rocha", name: "Ines Rocha", role: "Real estate · Lisbon", initials: "IR" },
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
  let { data: profile } = await supabase.from("profiles").select("username, avatar_url").eq("id", user.id).maybeSingle();
  if (!profile) {
    const username = (user.email?.split("@")[0] || "member").toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 30);
    const { data: created } = await supabase.from("profiles").insert({ id: user.id, display_name: name, username }).select("username, avatar_url").maybeSingle();
    profile = created;
  }
  const username = profile?.username ?? user.email?.split("@")[0] ?? "member";
  async function signedAvatarUrl(path: string | null | undefined) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    const { data } = await supabase.storage.from("asset-images").createSignedUrl(path, 3600);
    return data?.signedUrl ?? null;
  }
  const avatarUrl = await signedAvatarUrl(profile?.avatar_url);
  const { data: onlineProfiles } = await supabase.from("profiles").select("username, avatar_url").in("username", onlineMembers.map((member) => member.username));
  const onlineAvatarUrls = new Map(await Promise.all((onlineProfiles ?? []).map(async (onlineProfile) => [onlineProfile.username, await signedAvatarUrl(onlineProfile.avatar_url)] as const)));
  const friendsWithAvatars = onlineMembers.map((member) => ({ ...member, avatarUrl: onlineAvatarUrls.get(member.username) ?? null }));

  return (
    <>
      <AppHeader avatarUrl={avatarUrl} name={name} username={username} />
      <div className="dashboard-content">
        <div className="app-shell">
          <CollapsibleSidebar>
            <section className="sidebar-shortcuts">
              <p className="eyebrow">Shortcuts</p>
              <Link aria-label="My profile" className="sidebar-shortcut" href={`/app/profile/${username}`} title="My profile"><CircleUserRound size={17} /><span>My profile</span></Link>
              <Link aria-label="Saved collection" className="sidebar-shortcut" href="/app/collection" title="Saved collection"><Bookmark size={17} /><span>Saved collection</span></Link>
              <Link aria-label="My circles" className="sidebar-shortcut" href="/app/circles" title="My circles"><UsersRound size={17} /><span>My circles</span></Link>
              <Link aria-label="Messages" className="sidebar-shortcut" href="/app/messages" title="Messages"><MessageCircle size={17} /><span>Messages</span></Link>
              <Link aria-label="Discover people" className="sidebar-shortcut" href="/app/explore" title="Discover people"><Compass size={17} /><span>Discover people</span></Link>
            </section>
            <section className="revenue-panel">
              <Link aria-label="Grow with WealthCircle: view opportunities" className="revenue-heading-link" href="/app/grow">
                <p className="eyebrow">Revenue opportunities</p>
                <h2>Grow with WealthCircle</h2>
              </Link>
              <p className="revenue-intro">Reach a private, high-intent community through considered offers and experiences.</p>
              <Link aria-label="Membership: plans and billing" className="revenue-item" href="/app/settings" title="Membership: plans and billing">
                <CreditCard size={17} />
                <span><strong>Membership</strong><small>Plans and billing</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Brand placements: advertising opportunities" className="revenue-item" href="/app/grow/brand-placements" title="Brand placements: advertising opportunities">
                <Megaphone size={17} />
                <span><strong>Brand placements</strong><small>Advertising opportunities</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Circle sponsorship" className="revenue-item" href="/app/grow/circle-sponsorship" title="Circle sponsorship">
                <UsersRound size={17} />
                <span><strong>Circle sponsorship</strong><small>Support a member community</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Private events" className="revenue-item" href="/app/grow/private-events" title="Private events">
                <CalendarDays size={17} />
                <span><strong>Private events</strong><small>Host salons and experiences</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Corporate access" className="revenue-item" href="/app/grow/corporate-access" title="Corporate access">
                <Building2 size={17} />
                <span><strong>Corporate access</strong><small>Team and office memberships</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Strategic partnerships" className="revenue-item" href="/app/grow/strategic-partnerships" title="Strategic partnerships">
                <Handshake size={17} />
                <span><strong>Strategic partnerships</strong><small>Co-branded programs</small></span>
                <ArrowUpRight size={14} />
              </Link>
              <Link aria-label="Network services" className="revenue-item" href="/app/grow/network-services" title="Network services">
                <Network size={17} />
                <span><strong>Network services</strong><small>Vetted member offerings</small></span>
                <ArrowUpRight size={14} />
              </Link>
            </section>
            <div className="sidebar-profile">
              <AvatarCircle avatarUrl={avatarUrl} initials={initials(name)} label={`${name}'s profile photo`} />
              <span>{name}</span>
            </div>
          </CollapsibleSidebar>

          <div className="app-main-panel">{children}</div>

          <aside className="app-rightbar">
            <div className="rightbar-heading">
              <span className="eyebrow">Your network</span>
              <Sparkles size={16} />
            </div>
            <article className="sponsor-card">
              <span className="sponsor-label">Membership</span>
              <div className="sponsor-mark">A</div>
              <h2>WealthCircle</h2>
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
      <FriendsOnlineWidget members={friendsWithAvatars} />
    </>
  );
}
