import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";

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
  return <><AppHeader name={name} email={user.email ?? ""} username={profile?.username ?? user.email?.split("@")[0] ?? "member"} /><div className="dashboard-content">{children}</div></>;
}
