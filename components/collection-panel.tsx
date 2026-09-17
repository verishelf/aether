"use client";

import Link from "next/link";
import { ArrowUpRight, Trash2 } from "lucide-react";
import { useState } from "react";

type CollectionAsset = { id: string; category: string; title: string; image_paths: string[] };

export function CollectionPanel({ assets }: { assets: CollectionAsset[] }) {
  const [items, setItems] = useState(assets);
  const [error, setError] = useState("");

  async function remove(id: string) {
    if (!window.confirm("Remove this asset from your collection?")) return;
    const response = await fetch(`/api/assets?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) { setError("Unable to remove asset."); return; }
    setItems((current) => current.filter((asset) => asset.id !== id));
  }

  return <article className="collection-panel"><div className="rightbar-heading"><span className="eyebrow">My collection</span><Link href="/app/settings" aria-label="Manage collection"><ArrowUpRight size={16} /></Link></div>{items.length ? <div className="collection-list">{items.slice(0, 5).map((asset) => <div className="collection-row" key={asset.id}>{asset.image_paths[0] ? <div className="collection-thumb" style={{ backgroundImage: `url(${asset.image_paths[0]})` }} /> : <div className="collection-thumb collection-thumb-empty" /> }<span><strong>{asset.title}</strong><small>{asset.category}</small></span><button type="button" onClick={() => remove(asset.id)} aria-label={`Delete ${asset.title}`}><Trash2 size={13} /></button></div>)}</div> : <p className="collection-empty">Your collection is waiting for its first piece.</p>}<Link className="collection-link" href="/app/settings">Add, edit, or manage assets <span>↗</span></Link>{error && <p className="auth-error" role="alert">{error}</p>}</article>;
}
