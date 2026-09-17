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
  const object = event.data.object as { metadata?: { user_id?: string; email?: string }; customer?: string; customer_email?: string; customer_details?: { email?: string }; subscription?: string; status?: string; current_period_end?: number };
  let userId = object.metadata?.user_id;
  const customerEmail = object.metadata?.email || object.customer_email || object.customer_details?.email;
  if (!userId && customerEmail && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    userId = users.users.find((candidate) => candidate.email?.toLowerCase() === customerEmail.toLowerCase())?.id;
  }
  if (userId && ["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await admin.from("subscriptions").upsert({ user_id: userId, stripe_customer_id: String(object.customer ?? ""), stripe_subscription_id: String(object.subscription ?? object.customer ?? ""), status: object.status ?? (event.type.endsWith("deleted") ? "canceled" : "active"), current_period_end: object.current_period_end ? new Date(object.current_period_end * 1000).toISOString() : null });
  }
  return NextResponse.json({ received: true });
}
