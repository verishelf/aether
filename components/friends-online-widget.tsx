import Link from "next/link";
import { UsersRound } from "lucide-react";
import { AvatarCircle } from "@/components/avatar-circle";

type OnlineMember = { name: string; role: string; initials: string; avatarUrl?: string | null };

export function FriendsOnlineWidget({ members }: { members: OnlineMember[] }) {
  return (
    <details className="circles-quick-access">
      <summary aria-label="Show friends online" title="Friends online">
        <UsersRound aria-hidden="true" size={20} />
        <span aria-label="Members online" className="circles-header-presence" />
      </summary>
      <div className="circles-popup">
        <div className="circles-popup-header">
          <span className="eyebrow">Friends online</span>
          <span className="online-count">{members.length} online</span>
          <span className="online-dot" aria-label="Members are online" />
        </div>
        {members.map((member) => (
          <Link className="circles-member" href="/app/circles" key={member.name}>
            <AvatarCircle avatarUrl={member.avatarUrl} initials={member.initials} label={`${member.name}'s profile photo`} />
            <span><strong>{member.name}</strong><small>{member.role}</small></span>
            <span className="presence" aria-label="Online" />
          </Link>
        ))}
        <Link className="circles-more" href="/app/circles">View all circles <span>↗</span></Link>
      </div>
    </details>
  );
}
