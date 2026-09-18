import Link from "next/link";
import { ArrowUpRight, Building2, Gem, HeartHandshake, Palette, Plane, Watch } from "lucide-react";

const categories = [
	{ name: "Private Aviation", detail: "Routes, aircraft, and the art of arriving well.", icon: Plane, tone: "aviation" },
	{ name: "Art & Design", detail: "Collections, studios, and new ways of seeing.", icon: Palette, tone: "art" },
	{ name: "Real Estate", detail: "Exceptional places and the people shaping them.", icon: Building2, tone: "real-estate" },
	{ name: "Fine Watches", detail: "Craft, provenance, and the mechanics of time.", icon: Watch, tone: "watches" },
	{ name: "Philanthropy", detail: "Patient capital for a more generous future.", icon: HeartHandshake, tone: "philanthropy" },
	{ name: "Family Offices", detail: "Long-term thinking across generations.", icon: Gem, tone: "offices" },
];

export default function ExplorePage() {
	return <main className="explore-page"><section className="explore-intro"><p className="eyebrow">Explore the network</p><h1 className="section-title">Begin<br /><em>somewhere.</em></h1><p>Curated rooms for the subjects, objects, and ideas worth a closer look.</p></section><section className="explore-categories"><div className="explore-section-heading"><p className="eyebrow">Browse by interest</p><span>06 rooms</span></div><div className="category-grid">{categories.map(({ name, detail, icon: Icon, tone }) => <Link className={`category-card ${tone}`} href={`/app/circles#${tone}`} key={name}><Icon size={20} /><div><h2>{name}</h2><p>{detail}</p></div><ArrowUpRight size={17} /></Link>)}</div></section><section className="explore-featured"><div className="explore-section-heading"><p className="eyebrow">High signal</p><span>Selected today</span></div><div className="featured-grid"><Link className="feature-card feature-image" href="/app/profile/matteo-conti"><span className="eyebrow">Member spotlight</span><div><h2>Matteo Conti</h2><p>Architect · Collector · Milan</p></div><ArrowUpRight size={17} /></Link><Link className="feature-card feature-note" href="/app/feed"><span className="eyebrow">Conversation</span><div><h2>What makes a collection feel alive?</h2><p>18 members are in this conversation</p></div><ArrowUpRight size={17} /></Link></div></section></main>;
}
