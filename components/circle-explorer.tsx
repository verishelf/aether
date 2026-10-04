"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, MapPin, Search, UsersRound } from "lucide-react";

const members = [
  { username: "matteo-conti", initials: "MC", name: "Matteo Conti", field: "Architecture", city: "Milan", circle: "Art & Design", size: "large", position: "node-one", online: true, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=85" },
  { username: "sarah-kim", initials: "SK", name: "Sarah Kim", field: "Philanthropy", city: "Seoul", circle: "Philanthropy", size: "small", position: "node-two", online: false, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=85" },
  { username: "alexander-wei", initials: "AW", name: "Alexander Wei", field: "Family offices", city: "Singapore", circle: "Family Offices", size: "medium", position: "node-three", online: true, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=85" },
  { username: "lena-moreau", initials: "LM", name: "Lena Moreau", field: "Art & Design", city: "Paris", circle: "Art & Design", size: "large", position: "node-four", online: true, photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=85" },
  { username: "noah-bennett", initials: "NB", name: "Noah Bennett", field: "Private aviation", city: "London", circle: "Private Aviation", size: "small", position: "node-five", online: false, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=85" },
  { username: "ines-rocha", initials: "IR", name: "Ines Rocha", field: "Real estate", city: "Lisbon", circle: "Real Estate", size: "medium", position: "node-six", online: true, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=85" },
];
const circleFilters = ["All circles", "Art & Design", "Family Offices", "Private Aviation", "Philanthropy", "Real Estate"];

export function CircleExplorer({ avatarUrls }: { avatarUrls: Record<string, string> }) {
  const [circle, setCircle] = useState("All circles");
  const [query, setQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selected, setSelected] = useState(members[0].username);
  const search = query.trim().toLowerCase();
  const visible = members.filter((member) => (circle === "All circles" || member.circle === circle) && (!onlineOnly || member.online) && (!search || `${member.name} ${member.field} ${member.city} ${member.circle}`.toLowerCase().includes(search)));
  const activeMember = visible.find((member) => member.username === selected) ?? visible[0];
  const onlineCount = members.filter((member) => member.online).length;

  return (
    <main className="utility-page circles-discovery-page">
      <header className="circles-discovery-header">
        <div><p className="eyebrow">WealthCircle / PRIVATE NETWORK</p><h1>Circles</h1><p>Find your people across the interests shaping your world.</p></div>
        <div className="circle-online-summary"><span className="online-dot" /><strong>{onlineCount}</strong><span>members online</span></div>
      </header>
      <div className="circle-explorer-toolbar">
        <label className="circle-search"><Search aria-hidden="true" size={16} /><input aria-label="Search members and circles" onChange={(event) => setQuery(event.target.value)} placeholder="Search members, interests, cities" type="search" value={query} /></label>
        <button aria-pressed={onlineOnly} className={`circle-online-filter${onlineOnly ? " active" : ""}`} onClick={() => setOnlineOnly(!onlineOnly)} type="button"><span className="online-dot" /> Online now</button>
      </div>
      <div aria-label="Filter by circle" className="circle-filter-tabs" role="tablist">
        {circleFilters.map((filter) => <button aria-selected={circle === filter} className={circle === filter ? "active" : ""} key={filter} onClick={() => setCircle(filter)} role="tab" type="button">{filter}{filter === "All circles" && <span>{members.length}</span>}</button>)}
      </div>
      <div className="circle-explorer-layout">
        <section aria-label="Member constellation" className="circle-map-section">
          <header className="circle-section-heading"><div><p className="eyebrow">MEMBER CONSTELLATION</p><h2>{circle === "All circles" ? "The network" : circle}</h2></div><span>{visible.length} of {members.length} members</span></header>
          {visible.length ? <div className="circle-network-map">
            <span className="circle-map-line line-one" /><span className="circle-map-line line-two" /><span className="circle-map-line line-three" /><span className="circle-map-line line-four" />
            {visible.map((member) => <button aria-label={`${member.name}, ${member.circle}, ${member.city}${member.online ? ", online" : ", away"}`} aria-pressed={activeMember?.username === member.username} className={`network-node ${member.size} ${member.position}${activeMember?.username === member.username ? " selected" : ""}`} key={member.username} onClick={() => setSelected(member.username)} title={`${member.name} · ${member.circle}`} type="button"><span aria-hidden="true" className="node-photo" style={{ backgroundImage: `url(${avatarUrls[member.username] || member.photo})` }} /><span className="node-initials">{member.initials}</span><span aria-hidden="true" className={`node-presence${member.online ? " online" : ""}`} /></button>)}
            <span className="circle-map-caption"><UsersRound size={13} /> Select a member to preview their profile</span>
          </div> : <div className="circle-empty-state"><Search size={18} /><strong>No members match those filters</strong><button onClick={() => { setQuery(""); setCircle("All circles"); setOnlineOnly(false); }} type="button">Clear filters</button></div>}
        </section>
        <aside aria-live="polite" className="circle-member-preview">
          {activeMember ? <>
            <div className="circle-preview-topline"><span className="eyebrow">MEMBER PROFILE</span><span className={`circle-presence-label${activeMember.online ? " online" : ""}`}><span />{activeMember.online ? "Online" : "Away"}</span></div>
              <div className="circle-preview-portrait" style={{ backgroundImage: `url(${avatarUrls[activeMember.username] || activeMember.photo})` }}><span>{activeMember.initials}</span></div>
            <h2>{activeMember.name}</h2><p className="circle-member-role">{activeMember.field}</p><p className="circle-member-location"><MapPin size={14} />{activeMember.city}</p>
            <div className="circle-member-interest"><span className="eyebrow">CIRCLE</span><strong>{activeMember.circle}</strong></div>
            <Link className="circle-profile-link" href={`/app/profile/${activeMember.username}`}>Open profile <ArrowUpRight size={15} /></Link>
          </> : <div className="circle-preview-empty"><UsersRound size={22} /><p>Select a member to see their profile preview.</p></div>}
        </aside>
      </div>
    </main>
  );
}
