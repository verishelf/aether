import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  if (!email || !password || !name) return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ authenticated: Boolean(data.session) });
}