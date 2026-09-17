import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { plan = "yearly", email } = await request.json() as { plan?: string; email?: string };
  if (!user && !email) return NextResponse.json({ error: "Email is required to start checkout." }, { status: 400 });
  if (plan !== "monthly" && plan !== "yearly") return NextResponse.json({ error: "Invalid membership plan." }, { status: 400 });
  const priceId = PRICE_IDS[plan];
  if (!priceId) return NextResponse.json({ error: "Membership pricing is not configured yet." }, { status: 503 });
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_creation: "always",
    customer_email: user?.email ?? email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/app/feed?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin}/app/settings`,
    metadata: { user_id: user?.id ?? "", email: user?.email ?? email ?? "" },
  });
  return NextResponse.json({ url: session.url });
}
