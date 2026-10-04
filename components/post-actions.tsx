"use client";

import { FormEvent, useState } from "react";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";

type PostActionsProps = { postId: string; body: string };

export function PostActions({ postId, body }: PostActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copy, setCopy] = useState(body);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function updatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextCopy = copy.trim();
    if (!nextCopy || nextCopy.length > 1000) {
      setError("Write a note between 1 and 1,000 characters.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: nextCopy }),
      });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(result?.error || "Unable to update your note.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the publishing service. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost() {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(result?.error || "Unable to delete your note.");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the publishing service. Try again.");
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <form className="post-edit-form" onSubmit={updatePost}>
        <textarea aria-label="Edit post" maxLength={1000} onChange={(event) => setCopy(event.target.value)} value={copy} />
        {error && <p className="auth-error" role="alert">{error}</p>}
        <div>
          <button className="post-action-cancel" disabled={busy} onClick={() => { setEditing(false); setCopy(body); }} type="button"><X size={14} /> Cancel</button>
          <button className="post-action-save" disabled={busy || !copy.trim()} type="submit">{busy ? "Saving..." : "Save"}</button>
        </div>
      </form>
    );
  }

  return (
    <div className="post-actions">
      {error && <p className="auth-error" role="alert">{error}</p>}
      <details className="post-actions-menu" onToggle={(event) => setMenuOpen(event.currentTarget.open)} open={menuOpen}>
        <summary aria-label="Post actions" title="Post actions"><MoreHorizontal size={18} /></summary>
        <div>
          <button disabled={busy} onClick={() => { setEditing(true); setMenuOpen(false); }} type="button"><Pencil size={14} /> Edit post</button>
          <button className="post-delete-action" disabled={busy} onClick={deletePost} type="button"><Trash2 size={14} /> Delete post</button>
        </div>
      </details>
    </div>
  );
}