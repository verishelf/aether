import Link from "next/link";
import { UpgradeMembership } from "@/components/upgrade-membership";

export default function SettingsPage() {
	return <main className="placeholder-page settings-page"><Link className="wordmark" href="/app/feed">AETHER<span>.</span></Link><p className="eyebrow">Account</p><h1 className="section-title">Your<br /><em>membership.</em></h1><p>Manage your account and choose the membership that fits your cadence.</p><UpgradeMembership /></main>;
}
