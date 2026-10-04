import { AssetManager } from "@/components/asset-manager";

export default function CollectionPage() {
  return (
    <main className="utility-page collection-page">
      <header className="utility-page-header">
        <h1>Collection</h1>
        <p>Add and curate the objects, places, and pieces that define your world.</p>
      </header>
      <AssetManager />
    </main>
  );
}
