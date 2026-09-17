"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Menu, Minus, MoveUpRight, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const principles = [
  { number: "01", title: "Signal over noise", text: "A considered place for considered people. No vanity metrics, no algorithmic churn." },
  { number: "02", title: "Privacy by design", text: "Your world remains yours. Every introduction is intentional, every circle is private." },
  { number: "03", title: "Access is earned", text: "A living network of the curious, the accomplished, and those building what comes next." },
];

const circles = ["Art & Design", "Family Offices", "Private Aviation", "Philanthropy"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) window.location.assign(`/signup?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="AETHER home">AETHER<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#manifesto">Manifesto</a><a href="#circles">Circles</a><a href="#membership">Membership</a></nav>
        <div className="header-actions"><ThemeToggle /><a className="text-link desktop-only" href="/login">Log in</a><a className="text-link desktop-only" href="/signup">Sign up <ArrowUpRight size={14} /></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </header>
      <AnimatePresence>{menuOpen && <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mobile-nav" aria-label="Mobile navigation"><a href="#manifesto" onClick={() => setMenuOpen(false)}>Manifesto</a><a href="#circles" onClick={() => setMenuOpen(false)}>Circles</a><a href="#membership" onClick={() => setMenuOpen(false)}>Membership</a><a href="/login" onClick={() => setMenuOpen(false)}>Log in</a><a href="/signup" onClick={() => setMenuOpen(false)}>Sign up <ArrowUpRight size={14} /></a></motion.nav>}</AnimatePresence>
      <section className="hero" id="top"><div className="hero-visual" role="img" aria-label="Black and white architectural detail" /><div className="hero-content"><p className="eyebrow reveal">A private social network · Est. 2026</p><h1 className="display-title reveal-delay">The private network<br />for those who<br /><em>already have everything.</em></h1><div className="hero-bottom reveal-delay-2"><p>Where accomplished lives meet<br />the ideas shaping tomorrow.</p><a className="circle-arrow" href="#access" aria-label="Request access"><MoveUpRight size={20} /></a></div></div><div className="hero-index">A / 01</div></section>
      <section className="manifesto section-grid" id="manifesto"><p className="eyebrow">01 / The premise</p><div className="manifesto-copy"><h2 className="section-title">A quieter<br /><em>kind</em> of connection.</h2><p className="large-copy">AETHER is a private room for people who move with intention. A place for honest exchange, considered discovery, and the rarest form of luxury: access to the right people.</p><a className="underlined-link" href="#access">Discover the AETHER way <ArrowUpRight size={14} /></a></div></section>
      <section className="principles section-grid"><p className="eyebrow">02 / Our principles</p><div className="principle-list">{principles.map((principle) => <article className="principle" key={principle.number}><span>{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.text}</p></div><Minus size={15} /></article>)}</div></section>
      <section className="circles-section" id="circles"><div className="circles-heading"><p className="eyebrow">03 / Private circles</p><h2 className="section-title">Find your<br /><em>people.</em></h2><p>Small, private conversations around the things that matter. Join the rooms where your next idea is already taking shape.</p></div><div className="circle-list">{circles.map((circle, index) => <a href="#access" className="circle-row" key={circle}><span>0{index + 1}</span><strong>{circle}</strong><ArrowUpRight size={17} /></a>)}</div></section>
      <section className="membership section-grid" id="membership"><p className="eyebrow">04 / Membership</p><div className="membership-content"><div><h2 className="section-title">Your invitation<br /><em>awaits.</em></h2><p className="large-copy">Membership is intentionally limited. Choose the cadence that suits your world.</p></div><div className="pricing-box"><div className="billing-toggle" role="group" aria-label="Billing frequency"><button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>Monthly</button><button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>Yearly <span>Save 17%</span></button></div><div className="price"><span>$</span><strong>{annual ? "247" : "297"}</strong><small>/ month</small></div><p className="price-note">{annual ? "Billed annually at $2,970" : "Billed monthly"}</p><a className="light-button" href="#access">Begin your application <ArrowUpRight size={16} /></a><ul><li><Check size={15} /> Full access to the network</li><li><Check size={15} /> All private circles</li><li><Check size={15} /> Direct messaging & discovery</li></ul></div></div></section>
      <section className="access-section" id="access"><div className="access-inner"><p className="eyebrow">05 / Request access</p><h2 className="section-title">The room is<br /><em>waiting.</em></h2><p>Tell us a little about yourself. We review every application personally.</p><form className="access-form" onSubmit={handleSubmit}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Your email address" required value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" aria-label="Start application"><ArrowUpRight size={19} /></button></form></div></section>
      <footer className="site-footer"><a className="wordmark" href="#top">AETHER<span>.</span></a><p>© 2026 AETHER Society</p><div><a href="#access">Privacy</a><a href="#access">Terms</a><a href="mailto:concierge@aether.social">Concierge</a></div></footer>
    </main>
  );
}
