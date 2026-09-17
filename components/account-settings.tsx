"use client";

import { useState } from "react";
import { Check, LogOut, Trash2 } from "lucide-react";

type AccountSettingsProps = { email: string; displayName: string; username: string; profileVisible: boolean; searchable: boolean; membership: string };

export function AccountSettings({ email, displayName: initialDisplayName, username: initialUsername, profileVisible: initialProfileVisible, searchable: initialSearchable, membership }: AccountSettingsProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [username, setUsername] = useState(initialUsername);
  const [profileVisible, setProfileVisible] = useState(initialProfileVisible);
  const [searchable, setSearchable] = useState(initialSearchable);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setNotice(""); setError("");
    const response = await fetch("/api/account/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ display_name: displayName, username }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Unable to update your profile."); return; }
    setNotice("Profile saved.");
  }

  async function savePreference(key: "profile_visible" | "searchable", value: boolean) {
    setNotice(""); setError("");
    if (key === "profile_visible") setProfileVisible(value); else setSearchable(value);
    const response = await fetch("/api/account/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_visible: key === "profile_visible" ? value : profileVisible, searchable: key === "searchable" ? value : searchable }) });
    if (!response.ok) { setError("Unable to save that preference."); return; }
    setNotice("Preferences saved.");
  }

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.assign("/login");
  }

  async function deleteAccount() {
    if (!window.confirm("Delete your account and all associated data? This cannot be undone.")) return;
    setDeleting(true); setError("");
    const response = await fetch("/api/account/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirmation: "DELETE" }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Unable to delete your account."); setDeleting(false); return; }
    window.location.assign("/");
  }

  return <div className="account-settings"><section className="settings-section"><div><p className="eyebrow">Account</p><h2>{email}</h2><p>Member account · {membership}</p></div><button className="settings-action" type="button" onClick={signOut}><LogOut size={15} /> Sign out</button></section><form className="settings-section settings-profile-form" onSubmit={saveProfile}><div><p className="eyebrow">Profile</p><h2>Your public identity.</h2><p>Choose how your name appears across AETHER.</p></div><div className="settings-fields"><label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></label><label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label><button className="settings-action" type="submit">Save profile</button></div></form><section className="settings-section"><div><p className="eyebrow">Privacy</p><h2>Your presence, on your terms.</h2><p>Control how your profile appears inside AETHER.</p></div><div className="settings-options"><label><span><strong>Profile visibility</strong><small>Allow members to view your profile.</small></span><input type="checkbox" checked={profileVisible} onChange={(event) => savePreference("profile_visible", event.target.checked)} /></label><label><span><strong>Searchable profile</strong><small>Allow your profile to appear in member search.</small></span><input type="checkbox" checked={searchable} onChange={(event) => savePreference("searchable", event.target.checked)} /></label></div></section>{notice && <p className="settings-notice"><Check size={14} /> {notice}</p>}{error && <p className="auth-error" role="alert">{error}</p>}<section className="settings-section settings-danger"><div><p className="eyebrow">Close account</p><h2>Leave AETHER.</h2><p>This permanently removes your account, assets, and membership record.</p></div><button className="settings-danger-action" type="button" onClick={deleteAccount} disabled={deleting}><Trash2 size={15} /> {deleting ? "Removing..." : "Delete account"}</button></section></div>;
}
