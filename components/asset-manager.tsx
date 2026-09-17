"use client";

import { FormEvent, useState } from "react";

const categories = ["Hangar", "Garage", "Closet", "Collection", "Fleet", "Estates", "Custom"];

export function AssetManager() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    const response = await fetch("/api/assets", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to save asset."); else { setMessage("Asset saved to your collection."); event.currentTarget.reset(); }
    setSaving(false);
  }

  return <section className="asset-manager"><p className="eyebrow">Your collection</p><h2>Add an asset.</h2><form onSubmit={submit}><div className="asset-form-grid"><label>Category<select name="category" defaultValue="Hangar">{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Title<input name="title" required placeholder="The name of the piece" /></label><label>Maker<input name="maker" placeholder="Optional maker" /></label><label>Year<input name="year" type="number" min="1800" max="2100" placeholder="Optional" /></label><label className="asset-form-wide">Description<textarea name="description" rows={3} placeholder="A short description" /></label><label>Visibility<select name="visibility" defaultValue="private"><option value="public">Public</option><option value="circles">Circles only</option><option value="private">Private</option></select></label><label>Images<input name="images" type="file" accept="image/*" multiple /></label></div><button className="settings-action" type="submit" disabled={saving}>{saving ? "Saving..." : "Save asset"}</button></form>{message && <p className="settings-notice">{message}</p>}{error && <p className="auth-error" role="alert">{error}</p>}</section>;
}
