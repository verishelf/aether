import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const maximumSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const avatar = form.get("avatar");
  if (!(avatar instanceof File) || !allowedTypes.has(avatar.type)) {
    return NextResponse.json({ error: "Choose a JPEG, PNG, WebP, or AVIF image." }, { status: 400 });
  }
  if (avatar.size < 1 || avatar.size > maximumSize) {
    return NextResponse.json({ error: "Choose an image smaller than 5 MB." }, { status: 400 });
  }

  const path = `${user.id}/avatars/${crypto.randomUUID()}.${extensions[avatar.type]}`;
  const { error: uploadError } = await supabase.storage.from("asset-images").upload(path, avatar, { contentType: avatar.type, upsert: false });
  if (uploadError) return NextResponse.json({ error: "Unable to upload your profile photo." }, { status: 400 });

  const { data: currentProfile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).maybeSingle();
  const { error: updateError } = await supabase.from("profiles").update({ avatar_url: path, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (updateError) {
    await supabase.storage.from("asset-images").remove([path]);
    return NextResponse.json({ error: "Unable to save your profile photo." }, { status: 500 });
  }

  const oldPath = currentProfile?.avatar_url;
  if (oldPath?.startsWith(`${user.id}/avatars/`)) await supabase.storage.from("asset-images").remove([oldPath]);
  return NextResponse.json({ uploaded: true });
}
