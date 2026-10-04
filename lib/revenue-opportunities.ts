export const revenueOpportunities = [
  {
    slug: "brand-placements",
    title: "Brand placements",
    eyebrow: "01 / Brand partnerships",
    summary: "Introduce a considered brand to a focused private community.",
    description: "WealthCircle works with a limited number of brands whose products and point of view fit the interests of our members. Placement opportunities are reviewed for relevance and quality before they reach the network.",
    details: ["Curated introductions to relevant member interests", "Editorially considered placement formats", "Campaign conversations handled by our concierge"],
    subject: "Advertising with WealthCircle",
  },
  {
    slug: "circle-sponsorship",
    title: "Circle sponsorship",
    eyebrow: "02 / Community sponsorship",
    summary: "Support a private circle around a shared field of interest.",
    description: "Sponsor a circle with a clear connection to your work. We shape each proposal around the members, subject, and value the sponsor can bring, keeping the conversation useful rather than noisy.",
    details: ["Sponsor a relevant member circle", "Explore expert sessions or member resources", "Agree on scope directly with our concierge"],
    subject: "Sponsored WealthCircle Circle",
  },
  {
    slug: "private-events",
    title: "Private events",
    eyebrow: "03 / Member experiences",
    summary: "Host a salon or gathering designed for a select audience.",
    description: "Bring members together around a strong idea, a distinctive place, or a useful conversation. Our team can discuss the audience, format, and guest experience with you.",
    details: ["Small-format salons and private gatherings", "Topic and audience planning", "Concierge coordination for event proposals"],
    subject: "Private WealthCircle Event",
  },
  {
    slug: "corporate-access",
    title: "Corporate access",
    eyebrow: "04 / Organization memberships",
    summary: "Explore membership access for a team, office, or family enterprise.",
    description: "Discuss a considered membership arrangement for colleagues or an organization. We will review the intended group, membership fit, and access needs before proposing next steps.",
    details: ["Team and office membership conversations", "Access planning for principals and colleagues", "Membership options reviewed with the concierge"],
    subject: "Corporate WealthCircle Membership",
  },
  {
    slug: "strategic-partnerships",
    title: "Strategic partnerships",
    eyebrow: "05 / Long-term collaboration",
    summary: "Build a thoughtful program with a shared member benefit.",
    description: "We consider partnerships that strengthen the network and create a clear benefit for members. Share your proposal and the audience or expertise you hope to bring together.",
    details: ["Co-created member programs", "Relevant expertise and access exchange", "Long-term partnership discussions"],
    subject: "WealthCircle Strategic Partnership",
  },
  {
    slug: "network-services",
    title: "Network services",
    eyebrow: "06 / Vetted services",
    summary: "Introduce a specialist service that members may find valuable.",
    description: "We review member-service proposals for quality, fit, and clarity. Tell us what you offer, who it serves, and how a member would benefit from an introduction.",
    details: ["Vetted professional and lifestyle services", "Clear member value and service expectations", "Introductions considered by relevance"],
    subject: "WealthCircle Network Services",
  },
] as const;

export type RevenueOpportunity = (typeof revenueOpportunities)[number];
export const conciergeEmail = "concierge@aether.social";
