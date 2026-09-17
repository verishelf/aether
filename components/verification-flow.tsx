"use client";

import { usePlaidLink } from "react-plaid-link";
import { useEffect, useState } from "react";

export function VerificationFlow() {
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { open, ready } = usePlaidLink({ token, onSuccess: async (publicToken) => {
    const exchange = await fetch("/api/plaid/exchange-token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ public_token: publicToken }) });
    if (!exchange.ok) { setError("We could not secure the connected account."); return; }
    const verify = await fetch("/api/plaid/verify-net-worth", { method: "POST" });
    const result = await verify.json();
    if (!verify.ok) { setError(result.error ?? "Verification could not be completed."); return; }
    setMessage("Verified. Opening your dashboard...");
    window.location.assign("/app/feed");
  } });

  useEffect(() => { fetch("/api/plaid/create-link-token", { method: "POST" }).then((response) => response.json()).then((result) => result.link_token ? setToken(result.link_token) : setError(result.error ?? "Plaid is not configured.")); }, []);
  return <div className="verification-actions">{message ? <p className="auth-success">{message}</p> : <button className="verification-button" type="button" disabled={!ready} onClick={() => open()}>Connect securely <span>↗</span></button>}{error && <p className="auth-error" role="alert">{error}</p>}<p className="verification-note">Your data is encrypted and never displayed as an exact number. <a href="mailto:concierge@aether.social?subject=Manual%20verification%20review">Request manual review</a></p></div>;
}