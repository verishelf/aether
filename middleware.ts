import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isVerificationException } from "@/lib/verification-exception";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) return NextResponse.redirect(new URL("/login", request.url));
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) => { request.cookies.set(name, value); response = NextResponse.next({ request }); response.cookies.set(name, value, options); }),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  if (request.nextUrl.pathname === "/app/verify") return response;
  if (isVerificationException(user.email)) return response;
  const [{ data: subscription }, { data: profile }] = await Promise.all([
    supabase.from("subscriptions").select("status, current_period_end").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("net_worth_verified").eq("id", user.id).maybeSingle(),
  ]);
  const activeSubscription = subscription?.status === "active" && (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());
  if (!activeSubscription || !profile?.net_worth_verified) return NextResponse.redirect(new URL("/app/verify", request.url));
  return response;
}

export const config = { matcher: ["/app/:path*"] };
