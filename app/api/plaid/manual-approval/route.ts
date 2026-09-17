import { createClient } from "@supabase/supabase-js";
import { createClient as createUserClient } from "@/lib/supabase/server";
import { isVerificationException } from "@/lib/verification";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isVerificationException(user.email)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { user_id } = await request.json() as { user_id?: string };
  if (!user_id || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Manual approval is not configured." }, { status: 503 });
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await admin.from("profiles").update({ net_worth_verified: true, net_worth_range: "25M+", plaid_verified_at: new Date().toISOString() }).eq("id", user_id);
  if (error) return NextResponse.json({ error: "Unable to approve member." }, { status: 500 });
  return NextResponse.json({ approved: true });
}
