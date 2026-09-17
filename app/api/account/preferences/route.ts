import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const values = await request.json() as { profile_visible?: boolean; searchable?: boolean };
  const { error } = await supabase.from("profiles").update({ profile_visible: values.profile_visible, searchable: values.searchable, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) return NextResponse.json({ error: "Unable to save preferences." }, { status: 500 });
  return NextResponse.json({ saved: true });
}
