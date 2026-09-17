import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  let event;
  try { event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!); } catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }); }
  const object = event.data.object as { metadata?: { user_id?: string }; customer?: string; subscription?: string; status?: string; current_period_end?: number };
  const userId = object.metadata?.user_id;
  if (userId && ["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await admin.from("subscriptions").upsert({ user_id: userId, stripe_customer_id: String(object.customer ?? ""), stripe_subscription_id: String(object.subscription ?? object.customer ?? ""), status: object.status ?? (event.type.endsWith("deleted") ? "canceled" : "active"), current_period_end: object.current_period_end ? new Date(object.current_period_end * 1000).toISOString() : null });
  }
  return NextResponse.json({ received: true });
}
