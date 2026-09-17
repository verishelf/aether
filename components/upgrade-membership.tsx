"use client";

import { useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";

type Plan = "monthly" | "yearly";

export function UpgradeMembership() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState("");

  async function startCheckout(plan: Plan) {
    setLoading(plan);
    setError("");
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error ?? "Unable to start checkout.");
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setLoading(null);
    }
  }

  return <div className="membership-panel"><p className="eyebrow">Membership</p><h2>Choose your<br /><em>cadence.</em></h2><p className="membership-panel-copy">Upgrade your account to unlock every circle, conversation, and introduction.</p><div className="membership-plans"><button type="button" onClick={() => startCheckout("monthly")} disabled={loading !== null}><span><strong>Monthly</strong><small>$297 / month</small></span>{loading === "monthly" ? <LoaderCircle className="spin" size={17} /> : <ArrowUpRight size={17} />}</button><button type="button" onClick={() => startCheckout("yearly")} disabled={loading !== null}><span><strong>Yearly <i>Save 17%</i></strong><small>$247 / month, billed annually</small></span>{loading === "yearly" ? <LoaderCircle className="spin" size={17} /> : <ArrowUpRight size={17} />}</button></div>{error ? <p className="auth-error" role="alert">{error}</p> : <p className="membership-note"><Check size={14} /> Secure checkout powered by Stripe</p>}</div>;
}
