import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { confirmation } = await request.json() as { confirmation?: string };
  if (confirmation !== "DELETE") return NextResponse.json({ error: "Type DELETE to confirm account removal." }, { status: 400 });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Account deletion is not configured." }, { status: 503 });
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "Unable to delete your account." }, { status: 500 });
  await supabase.auth.signOut();
  return NextResponse.json({ deleted: true });
}
