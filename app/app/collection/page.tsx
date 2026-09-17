import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AssetManager } from "@/components/asset-manager";

export default function CollectionPage() {
  return <main className="placeholder-page collection-page"><header className="collection-page-header"><Link className="wordmark" href="/app/feed">AETHER<span>.</span></Link><Link className="profile-back" href="/app/feed"><ArrowLeft size={15} /> Back to feed</Link></header><p className="eyebrow">Private collection</p><h1 className="section-title">Your<br /><em>collection.</em></h1><p>Add and curate the objects, places, and pieces that define your world.</p><AssetManager /></main>;
}
