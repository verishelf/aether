import { createClient } from "@/lib/supabase/server";
import { isVerificationException } from "@/lib/verification-exception";
import { VerificationFlow } from "@/components/verification-flow";

export default async function VerifyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  if (isVerificationException(user.email)) {
    return (
      <main className="utility-page verification-page">
        <header className="utility-page-header">
          <h1>Verification</h1>
          <p>Your membership is ready.</p>
        </header>
      </main>
    );
  }
  return (
    <main className="utility-page verification-page">
      <header className="utility-page-header">
        <h1>Verification</h1>
        <p>Connect your financial accounts securely through Plaid. We use your information only to confirm membership eligibility. We never store or display exact balances.</p>
      </header>
      <VerificationFlow />
    </main>
  );
}