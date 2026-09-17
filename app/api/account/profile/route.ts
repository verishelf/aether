import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const values = await request.json() as { display_name?: string; username?: string };
  const displayName = values.display_name?.trim();
  const username = values.username?.trim().toLowerCase();
  if (!displayName || !username || !/^[a-z0-9_]{3,30}$/.test(username)) return NextResponse.json({ error: "Use a display name and a username with 3-30 letters, numbers, or underscores." }, { status: 400 });
  const { error } = await supabase.from("profiles").update({ display_name: displayName, username, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error?.code === "23505") return NextResponse.json({ error: "That username is already in use." }, { status: 409 });
  if (error) return NextResponse.json({ error: "Unable to update your profile." }, { status: 500 });
  return NextResponse.json({ saved: true, display_name: displayName, username });
}
