import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { body } = await request.json() as { body?: string };
  const copy = body?.trim();
  if (!copy || copy.length > 1000) return NextResponse.json({ error: "Write a note between 1 and 1,000 characters." }, { status: 400 });
  const { error } = await supabase.from("posts").insert({ user_id: user.id, body: copy });
  if (error) return NextResponse.json({ error: "Unable to publish your note." }, { status: 500 });
  return NextResponse.json({ posted: true });
}
