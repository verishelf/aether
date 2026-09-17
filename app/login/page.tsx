"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email")), password: String(form.get("password")) }),
    });
    if (response.ok) {
      window.location.assign("/app/feed");
      return;
    }
    const result = await response.json();
    setError(result.error ?? "Unable to sign in.");
  }

  return <main className="auth-page"><Link className="wordmark" href="/">AETHER<span>.</span></Link><div className="auth-box"><p className="eyebrow">Member access</p><h1 className="section-title">Welcome<br /><em>back.</em></h1><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button type="submit">Enter AETHER <span>↗</span></button></form>{error && <p className="auth-error" role="alert">{error}</p>}<p className="auth-note">New here? <Link href="/signup">Request an invitation</Link></p></div></main>;
}
