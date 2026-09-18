import { createClient } from "@/lib/supabase/server";
import { isVerificationException } from "@/lib/verification-exception";
import { VerificationFlow } from "@/components/verification-flow";

export default async function VerifyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  if (isVerificationException(user.email)) return <main className="verification-page"><p className="eyebrow">Verified member</p><h1 className="section-title">Welcome<br /><em>inside.</em></h1><p>Your membership is ready.</p></main>;
  return <main className="verification-page"><div className="verification-copy"><p className="eyebrow">Private member verification</p><h1 className="section-title">One final<br /><em>threshold.</em></h1><p>Connect your financial accounts securely through Plaid. We use your information only to confirm membership eligibility. We never store or display exact balances.</p><VerificationFlow /></div></main>;
}