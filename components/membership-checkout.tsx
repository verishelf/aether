"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

type Plan = "monthly" | "yearly";

export function MembershipCheckout({ plan }: { plan: Plan }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: email.trim() || undefined }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error ?? "Unable to start checkout.");
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  return <form className="checkout-form" onSubmit={checkout}><label className="sr-only" htmlFor={`checkout-email-${plan}`}>Email address</label><input id={`checkout-email-${plan}`} type="email" placeholder="Your email for checkout" value={email} onChange={(event) => setEmail(event.target.value)} required /><button className="light-button" type="submit" disabled={loading}>{loading ? <><span>Opening checkout</span><LoaderCircle className="spin" size={16} /></> : <><span>Continue to Stripe</span><ArrowUpRight size={16} /></>}</button>{error && <p className="auth-error" role="alert">{error}</p>}</form>;
}
