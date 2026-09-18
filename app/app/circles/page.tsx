"use client";

import Link from "next/link";

const members = [
	{ username: "matteo-conti", initials: "MC", name: "Matteo Conti", detail: "Architecture · Milan", size: "large", position: "node-one", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
	{ username: "sarah-kim", initials: "SK", name: "Sarah Kim", detail: "Philanthropy · Seoul", size: "small", position: "node-two", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
	{ username: "alexander-wei", initials: "AW", name: "Alexander Wei", detail: "Family offices · Singapore", size: "medium", position: "node-three", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
	{ username: "lena-moreau", initials: "LM", name: "Lena Moreau", detail: "Art & Design · Paris", size: "large", position: "node-four", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80" },
	{ username: "noah-bennett", initials: "NB", name: "Noah Bennett", detail: "Private aviation · London", size: "small", position: "node-five", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
	{ username: "ines-rocha", initials: "IR", name: "Ines Rocha", detail: "Real estate · Lisbon", size: "medium", position: "node-six", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" },
];

function handleParallax(event: React.MouseEvent<HTMLAnchorElement>) {
	const bounds = event.currentTarget.getBoundingClientRect();
	const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
	const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 16;
	event.currentTarget.style.setProperty("--mx", `${x}px`);
	event.currentTarget.style.setProperty("--my", `${y}px`);
}

function resetParallax(event: React.MouseEvent<HTMLAnchorElement>) {
	event.currentTarget.style.setProperty("--mx", "0px");
	event.currentTarget.style.setProperty("--my", "0px");
}

export default function CirclesPage() {
	return <main className="network-page"><section className="network-intro"><p className="eyebrow">Private circles / 06 members online</p><h1 className="section-title">Rooms for<br /><em>ideas.</em></h1><p>Move through the network. Hover over a member to see their world, then open their profile.</p></section><section className="network-map" aria-label="AETHER member network">{members.map((member) => <Link aria-label={`Open ${member.name}'s profile`} className={`network-node ${member.size} ${member.position}`} href={`/app/profile/${member.username}`} key={member.username} onMouseMove={handleParallax} onMouseLeave={resetParallax}><span className="node-photo" style={{ backgroundImage: `url(${member.photo})` }} aria-hidden="true" /><span className="node-initials">{member.initials}</span><span className="node-tooltip"><strong>{member.name}</strong><small>{member.detail}</small><i>Open profile ↗</i></span></Link>)}</section><footer className="network-footer"><span>Art & Design</span><span>Family Offices</span><span>Private Aviation</span><span>Philanthropy</span></footer></main>;
}
