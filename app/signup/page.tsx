"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmation = String(form.get("confirmation"));
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(form.get("email")), password, name: String(form.get("name")) }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to create your account.");
      return;
    }
    if (result.authenticated) {
      window.location.assign("/app/feed");
    } else {
      setMessage("Your application is received. Check your email to confirm your membership.");
    }
  }

  return <main className="auth-page"><Link className="wordmark" href="/">AETHER<span>.</span></Link><div className="auth-box"><p className="eyebrow">Application</p><h1 className="section-title">Make your<br /><em>entrance.</em></h1><p className="auth-intro">Create your member account. Every application is reviewed personally.</p><form className="auth-form" onSubmit={handleSubmit}><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required /><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /><label htmlFor="confirmation">Confirm password</label><input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required /><button type="submit">Submit application <span>↗</span></button></form>{error && <p className="auth-error" role="alert">{error}</p>}{message && <p className="auth-success" role="status">{message}</p>}<p className="auth-note">Already a member? <Link href="/login">Sign in</Link></p></div></main>;
}
