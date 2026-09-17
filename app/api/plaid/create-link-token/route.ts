import { plaid, plaidCountryCodes, plaidProducts } from "@/lib/plaid";
import { createClient } from "@/lib/supabase/server";
import { isVerificationException } from "@/lib/verification";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (isVerificationException(user.email)) return NextResponse.json({ verified: true });
  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) return NextResponse.json({ error: "Plaid is not configured." }, { status: 503 });
  try {
    const { data } = await plaid.linkTokenCreate({ user: { client_user_id: user.id }, client_name: "AETHER", language: "en", country_codes: plaidCountryCodes, products: plaidProducts });
    return NextResponse.json({ link_token: data.link_token });
  } catch { return NextResponse.json({ error: "Unable to start verification." }, { status: 502 }); }
}
