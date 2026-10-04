import Link from "next/link";
import { ArrowUpRight, CreditCard } from "lucide-react";
import { revenueOpportunities } from "@/lib/revenue-opportunities";

export default function GrowPage() {
  return (
    <main className="utility-page grow-page">
      <header className="grow-header">
        <p className="eyebrow">WEALTHCIRCLE / COMMERCIAL INQUIRIES</p>
        <h1>Grow with WealthCircle</h1>
        <p>Explore considered ways to reach, support, and build with the WealthCircle community.</p>
      </header>

      <section aria-label="Revenue opportunities" className="grow-opportunity-list">
        <Link className="grow-opportunity membership-opportunity" href="/app/settings">
          <span className="grow-opportunity-number">00</span>
          <span className="grow-opportunity-copy"><strong>Membership</strong><small>Plans and billing</small></span>
          <CreditCard aria-hidden="true" size={18} />
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
        {revenueOpportunities.map((opportunity, index) => (
          <Link className="grow-opportunity" href={`/app/grow/${opportunity.slug}`} key={opportunity.slug}>
            <span className="grow-opportunity-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="grow-opportunity-copy"><strong>{opportunity.title}</strong><small>{opportunity.summary}</small></span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        ))}
      </section>
    </main>
  );
}
