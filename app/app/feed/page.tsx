import Link from "next/link";
import { Compass, Home, Layers3, MessageCircle, Settings, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = String(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member");
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";

  return <main className="app-page"><aside className="app-sidebar"><Link className="wordmark" href="/">AETHER<span>.</span></Link><nav><Link className="active" href="/app/feed"><Home size={17} />Feed</Link><Link href="/app/explore"><Compass size={17} />Explore</Link><Link href="/app/circles"><Layers3 size={17} />Circles</Link><Link href="/app/messages"><MessageCircle size={17} />Messages</Link><Link href="/app/settings"><Settings size={17} />Settings</Link></nav><div className="sidebar-profile"><span className="avatar">{initials}</span><span>{name}</span></div></aside><section className="feed"><div className="feed-heading"><h1>Good evening, {name}.</h1><p>{new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())}</p></div><div className="composer"><span className="avatar">{initials}</span><span>Share something considered...</span><button>Post</button></div><div className="feed-empty"><Sparkles size={18} /><h2>Your feed is ready for its first note.</h2><p>Explore the network and join a circle to begin your AETHER experience.</p><Link href="/app/explore">Explore the network <span>↗</span></Link></div></section><aside className="app-rightbar"><div className="rightbar-heading"><span className="eyebrow">Your network</span><Sparkles size={16} /></div><article className="sponsor-card"><span className="sponsor-label">Membership</span><div className="sponsor-mark">A</div><h2>AETHER SOCIETY</h2><p>Your private network is ready to explore.</p><Link href="/app/circles">Explore circles <span>↗</span></Link></article></aside></main>;
}
