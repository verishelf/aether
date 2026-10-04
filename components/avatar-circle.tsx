type AvatarCircleProps = { initials: string; avatarUrl?: string | null; label?: string; className?: string };

export function AvatarCircle({ initials, avatarUrl, label, className = "" }: AvatarCircleProps) {
  return (
    <span
      aria-label={label}
      className={`avatar${avatarUrl ? " avatar-photo" : ""}${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
    >
      {avatarUrl ? null : initials}
    </span>
  );
}
