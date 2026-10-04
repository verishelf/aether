import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { body } = await request.json() as { body?: string };
  const copy = body?.trim();
  if (!copy || copy.length > 1000) return NextResponse.json({ error: "Write a note between 1 and 1,000 characters." }, { status: 400 });

  const { id } = await params;
  const { data, error } = await supabase.from("posts").update({ body: copy }).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Unable to update your note." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Post not found or you do not have permission to edit it." }, { status: 404 });
  return NextResponse.json({ updated: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: ownedPost, error: lookupError } = await supabase.from("posts").select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (lookupError) return NextResponse.json({ error: "Unable to verify post ownership." }, { status: 500 });
  if (!ownedPost) return NextResponse.json({ error: "Post not found or you do not have permission to delete it." }, { status: 404 });

  const { error } = await supabase.from("posts").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Unable to delete your note." }, { status: 500 });

  const { data: remainingPost, error: verifyError } = await supabase.from("posts").select("id").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (verifyError) return NextResponse.json({ error: "Unable to verify that your note was deleted." }, { status: 500 });
  if (remainingPost) return NextResponse.json({ error: "Supabase is blocking post deletion. Apply the owners-can-delete-posts policy from supabase/schema.sql, then try again." }, { status: 503 });

  return NextResponse.json({ deleted: true });
}