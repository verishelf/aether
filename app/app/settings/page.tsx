import Link from "next/link";
import { UpgradeMembership } from "@/components/upgrade-membership";
import { AccountSettings } from "@/components/account-settings";
import { createClient } from "@/lib/supabase/server";
import { AssetManager } from "@/components/asset-manager";

export default async function SettingsPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	const { data: profile } = user ? await supabase.from("profiles").select("display_name, username, profile_visible, searchable").eq("id", user.id).maybeSingle() : { data: null };
	const { data: subscription } = user ? await supabase.from("subscriptions").select("status").eq("user_id", user.id).maybeSingle() : { data: null };
	return <main className="placeholder-page settings-page"><Link className="wordmark" href="/app/feed">AETHER<span>.</span></Link><p className="eyebrow">Account</p><h1 className="section-title">Your<br /><em>settings.</em></h1><p>Manage your account, privacy, and membership.</p><UpgradeMembership /><AssetManager /><AccountSettings email={user?.email ?? ""} displayName={profile?.display_name ?? user?.user_metadata?.full_name ?? ""} username={profile?.username ?? user?.email?.split("@")[0] ?? "member"} profileVisible={profile?.profile_visible ?? true} searchable={profile?.searchable ?? true} membership={subscription?.status === "active" ? "Active membership" : "Membership not active"} /></main>;
}
