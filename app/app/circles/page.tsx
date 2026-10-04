import { CircleExplorer } from "@/components/circle-explorer";
import { createClient } from "@/lib/supabase/server";

const memberUsernames = ["matteo-conti", "sarah-kim", "alexander-wei", "lena-moreau", "noah-bennett", "ines-rocha"];

export default async function CirclesPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("username, avatar_url").in("username", memberUsernames);
  const avatarUrls = await Promise.all((profiles ?? []).map(async ({ username, avatar_url }) => {
    if (!avatar_url) return [username, ""] as const;
    if (/^https?:\/\//i.test(avatar_url)) return [username, avatar_url] as const;
    const { data } = await supabase.storage.from("asset-images").createSignedUrl(avatar_url, 3600);
    return [username, data?.signedUrl ?? ""] as const;
  }));

  return <CircleExplorer avatarUrls={Object.fromEntries(avatarUrls)} />;
}
