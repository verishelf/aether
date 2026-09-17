import { Image as ImageIcon } from "lucide-react";

type Asset = { id: string; category: string; title: string; description: string | null; year: number | null; maker: string | null; image_paths: string[] };

export function AssetGallery({ assets }: { assets: Asset[] }) {
  if (!assets.length) return <div className="assets-empty"><ImageIcon size={18} /><h2>Your collection is quiet.</h2><p>Assets you choose to share will appear here.</p></div>;
  return <div className="asset-grid">{assets.map((asset) => <article className="asset-card" key={asset.id}>{asset.image_paths[0] ? <div className="asset-image" style={{ backgroundImage: `url(${asset.image_paths[0]})` }} /> : <div className="asset-image asset-image-empty"><ImageIcon size={20} /></div>}<p className="eyebrow">{asset.category}</p><h2>{asset.title}</h2>{asset.description && <p>{asset.description}</p>}<small>{[asset.maker, asset.year].filter(Boolean).join(" · ")}</small></article>)}</div>;
}
