"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Camera, LoaderCircle } from "lucide-react";

type ProfileAvatarProps = { name: string; avatarUrl: string | null; canEdit: boolean };

export function ProfileAvatar({ name, avatarUrl, canEdit }: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("avatar", file);
      const response = await fetch("/api/account/avatar", { method: "POST", body: formData });
      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) {
        setError(result?.error || "Unable to upload your profile photo.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Could not reach the upload service. Try again.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="profile-avatar-wrap">
      <div aria-label={`${name}'s profile photo`} className={`profile-avatar-large${avatarUrl ? " has-photo" : ""}`} role="img" style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}>
        <span>{name.slice(0, 2).toUpperCase()}</span>
      </div>
      {canEdit && (
        <>
          <input accept="image/*" aria-label="Choose a profile photo" className="sr-only" onChange={uploadAvatar} ref={inputRef} type="file" />
          <button aria-label="Upload profile photo" className="profile-avatar-upload" disabled={uploading} onClick={() => inputRef.current?.click()} title="Upload profile photo" type="button">
            {uploading ? <LoaderCircle className="spin" size={15} /> : <Camera size={15} />}
          </button>
          {error && <p className="profile-avatar-error" role="alert">{error}</p>}
        </>
      )}
    </div>
  );
}
