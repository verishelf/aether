import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FeedComposer } from "@/components/feed-composer";
import { PostActions } from "@/components/post-actions";
import { AvatarCircle } from "@/components/avatar-circle";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = String(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member");
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
  const { data: posts } = await supabase.from("posts").select("id, user_id, body, created_at").order("created_at", { ascending: false }).limit(30);
  const userIds = [...new Set([...(posts ?? []).map((post) => post.user_id), ...(user ? [user.id] : [])])];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", userIds)
    : { data: null };
  const profilesWithAvatars = await Promise.all((profiles ?? []).map(async (profile) => {
    let avatarUrl = profile.avatar_url;
    if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
      const { data } = await supabase.storage.from("asset-images").createSignedUrl(avatarUrl, 3600);
      avatarUrl = data?.signedUrl ?? null;
    }
    return [profile.id, { ...profile, avatarUrl }] as const;
  }));
  const profilesById = new Map(profilesWithAvatars);

  return (
    <section className="feed">
      <div className="feed-heading">
        <h1>Good evening, {name}.</h1>
        <p>{new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())}</p>
      </div>

      <FeedComposer avatarUrl={profilesById.get(user?.id ?? "")?.avatarUrl} initials={initials} />

      {posts?.length ? (
        posts.map((post) => {
          const profile = profilesById.get(post.user_id);
          const postName = profile?.display_name || profile?.username || "Member";

          return (
            <article className="post" key={post.id}>
              <div className="post-top">
                <AvatarCircle avatarUrl={profile?.avatarUrl} initials={postName.slice(0, 2).toUpperCase()} label={`${postName}'s profile photo`} />
                <div>
                  <strong>{postName}</strong>
                  <p>@{profile?.username || "member"} · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.created_at))}</p>
                </div>
                {post.user_id === user?.id && <PostActions body={post.body} postId={post.id} />}
              </div>
              <p className="post-copy">{post.body}</p>
            </article>
          );
        })
      ) : (
        <div className="feed-empty">
          <Sparkles size={18} />
          <h2>Your feed is ready for its first note.</h2>
          <p>Share a thought or explore the network to begin your WealthCircle experience.</p>
          <Link href="/app/explore">Explore the network <span>↗</span></Link>
        </div>
      )}
    </section>
  );
}
