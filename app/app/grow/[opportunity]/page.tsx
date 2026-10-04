import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { conciergeEmail, revenueOpportunities } from "@/lib/revenue-opportunities";

type PageProps = { params: Promise<{ opportunity: string }> };

export function generateStaticParams() {
  return revenueOpportunities.map(({ slug }) => ({ opportunity: slug }));
}

export default async function RevenueOpportunityPage({ params }: PageProps) {
  const { opportunity: slug } = await params;
  const opportunity = revenueOpportunities.find((item) => item.slug === slug);
  if (!opportunity) notFound();

  const inquiry = new URLSearchParams({ subject: opportunity.subject, body: `Hello WealthCircle Concierge,\n\nI would like to discuss ${opportunity.title.toLowerCase()}.\n\n` });

  return (
    <main className="utility-page grow-detail-page">
      <Link className="grow-back-link" href="/app/grow"><ArrowLeft size={15} /> All opportunities</Link>
      <section className="grow-detail-content">
        <p className="eyebrow">{opportunity.eyebrow}</p>
        <h1>{opportunity.title}</h1>
        <p className="grow-detail-summary">{opportunity.summary}</p>
        <p className="grow-detail-description">{opportunity.description}</p>

        <div className="grow-detail-value">
          <p className="eyebrow">POSSIBILITIES</p>
          {opportunity.details.map((detail) => <p className="grow-value-row" key={detail}><Check aria-hidden="true" size={15} />{detail}</p>)}
        </div>

        <a className="grow-contact-link" href={`mailto:${conciergeEmail}?${inquiry.toString()}`}>
          Discuss this opportunity <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <p className="grow-contact-note">Our concierge will follow up to understand your proposal and discuss fit.</p>
      </section>
    </main>
  );
}
