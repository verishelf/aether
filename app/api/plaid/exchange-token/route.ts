import { plaid } from "@/lib/plaid";
import { createClient } from "@/lib/supabase/server";
import { encryptPlaidToken, isVerificationException } from "@/lib/verification";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isVerificationException(user.email)) return NextResponse.json({ verified: true });
  const { public_token } = await request.json() as { public_token?: string };
  if (!public_token) return NextResponse.json({ error: "Public token is required." }, { status: 400 });
  try {
    const { data } = await plaid.itemPublicTokenExchange({ public_token });
    const { error } = await supabase.from("plaid_items").upsert({ user_id: user.id, encrypted_access_token: encryptPlaidToken(data.access_token), item_id: data.item_id, updated_at: new Date().toISOString() });
    if (error) throw error;
    return NextResponse.json({ exchanged: true });
  } catch { return NextResponse.json({ error: "Unable to secure your connected account." }, { status: 502 }); }
}
