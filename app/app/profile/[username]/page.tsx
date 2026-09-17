import Link from "next/link";
import { ArrowLeft, BadgeCheck, MessageCircle, UserPlus } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssetGallery } from "@/components/asset-gallery";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: member } = await supabase.from("profiles").select("id, username, display_name, avatar_url, net_worth_verified").eq("username", username).maybeSingle();
  if (!member) notFound();
  const { data: rows } = await supabase.from("assets").select("id, category, title, description, year, maker, image_paths").eq("user_id", member.id).in("visibility", ["public", "circles"]).order("created_at", { ascending: false });
  const signed = await Promise.all((rows ?? []).map(async (asset) => {
    const paths = asset.image_paths ?? [];
    const { data } = paths.length ? await supabase.storage.from("asset-images").createSignedUrls(paths, 3600) : { data: [] };
    return { ...asset, image_paths: (data ?? []).map((item) => item.signedUrl).filter((url): url is string => Boolean(url)) };
  }));
  const name = member.display_name || member.username;
  return <main className="profile-page"><header className="profile-header"><Link className="wordmark" href="/app/feed">AETHER<span>.</span></Link><Link className="profile-back" href="/app/circles"><ArrowLeft size={15} /> Back to circles</Link></header><section className="profile-hero"><div className="profile-avatar-large" style={member.avatar_url ? { backgroundImage: `url(${member.avatar_url})` } : undefined}><span>{name.slice(0, 2).toUpperCase()}</span></div><div className="profile-content"><p className="eyebrow">AETHER member</p><h1 className="section-title">{name}</h1><p className="profile-role">@{member.username}</p>{member.net_worth_verified && <p className="verified-badge"><BadgeCheck size={15} /> Verified Member</p>}<p className="profile-bio">A considered life, shared selectively.</p><div className="profile-actions"><button className="profile-action"><UserPlus size={15} /> Follow</button><button className="profile-action secondary"><MessageCircle size={15} /> Message</button></div></div></section><nav className="profile-tabs" aria-label="Profile sections"><a className="active" href="#wall">Wall</a><a href="#assets">Assets</a><a href="#about">About</a></nav><section className="profile-body"><div className="profile-wall" id="wall"><div className="wall-heading"><p className="eyebrow">{name}&apos;s wall</p><span>Recent notes</span></div><div className="profile-empty"><p>No public notes yet.</p></div><section className="profile-assets" id="assets"><div className="wall-heading"><p className="eyebrow">Assets</p><span>Shared collection</span></div><AssetGallery assets={signed} /></section></div><aside className="profile-aside" id="about"><div className="profile-stat-feature"><span className="eyebrow">About</span><strong>Private by design.</strong><small>Only information intentionally shared by this member appears here.</small></div></aside></section></main>;
}
