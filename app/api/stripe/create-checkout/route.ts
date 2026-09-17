import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stripe = getStripe();
  const { plan = "yearly" } = await request.json();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/feed?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/#membership`,
    metadata: { user_id: user.id },
  });
  return NextResponse.json({ url: session.url });
}
