import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Member");
  return <><AppHeader name={name} email={user.email ?? ""} /><div className="dashboard-content">{children}</div></>;
}
