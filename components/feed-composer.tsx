"use client";

import { FormEvent, useState } from "react";

export function FeedComposer({ initials }: { initials: string }) {
  const [copy, setCopy] = useState("");
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!copy.trim()) return;
    setPosting(true); setError("");
    const response = await fetch("/api/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: copy }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to publish your note."); else { setCopy(""); window.location.reload(); }
    setPosting(false);
  }

  return <form className="composer" onSubmit={submit}><span className="avatar">{initials}</span><textarea value={copy} onChange={(event) => setCopy(event.target.value)} placeholder="Share something considered..." aria-label="Write a post" rows={2} maxLength={1000} /><button type="submit" disabled={posting || !copy.trim()}>{posting ? "Posting..." : "Post"}</button>{error && <p className="auth-error" role="alert">{error}</p>}</form>;
}
