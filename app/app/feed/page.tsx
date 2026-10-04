import Link from "next/link";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FeedComposer } from "@/components/feed-composer";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const name = String(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Member");
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";
  const { data: posts } = await supabase.from("posts").select("id, user_id, body, created_at").order("created_at", { ascending: false }).limit(30);
  const userIds = [...new Set((posts ?? []).map((post) => post.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, display_name, username").in("id", userIds)
    : { data: null };
  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (
    <section className="feed">
      <div className="feed-heading">
        <h1>Good evening, {name}.</h1>
        <p>{new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())}</p>
      </div>

      <FeedComposer initials={initials} />

      {posts?.length ? (
        posts.map((post) => {
          const profile = profilesById.get(post.user_id);
          const postName = profile?.display_name || profile?.username || "Member";

          return (
            <article className="post" key={post.id}>
              <div className="post-top">
                <span className="avatar">{postName.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{postName}</strong>
                  <p>@{profile?.username || "member"} · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.created_at))}</p>
                </div>
              </div>
              <p className="post-copy">{post.body}</p>
            </article>
          );
        })
      ) : (
        <div className="feed-empty">
          <Sparkles size={18} />
          <h2>Your feed is ready for its first note.</h2>
          <p>Share a thought or explore the network to begin your AETHER experience.</p>
          <Link href="/app/explore">Explore the network <span>↗</span></Link>
        </div>
      )}
    </section>
  );
}
