import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { plan = "yearly" } = await request.json() as { plan?: string };
  if (plan !== "monthly" && plan !== "yearly") return NextResponse.json({ error: "Invalid membership plan." }, { status: 400 });
  const priceId = PRICE_IDS[plan];
  if (!priceId) return NextResponse.json({ error: "Membership pricing is not configured yet." }, { status: 503 });
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/app/feed?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/app/settings`,
    metadata: { user_id: user.id },
  });
  return NextResponse.json({ url: session.url });
}
