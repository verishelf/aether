import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const categories = new Set(["Hangar", "Garage", "Closet", "Collection", "Fleet", "Estates"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const category = String(form.get("category") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim() || null;
  const maker = String(form.get("maker") ?? "").trim() || null;
  const yearValue = String(form.get("year") ?? "").trim();
  const year = yearValue ? Number(yearValue) : null;
  const visibility = String(form.get("visibility") ?? "private");
  if ((!categories.has(category) && !category) || !title || !["public", "circles", "private"].includes(visibility)) return NextResponse.json({ error: "Category, title, and visibility are required." }, { status: 400 });
  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0).slice(0, 8);
  const imagePaths: string[] = [];
  for (const file of files) {
    const path = `${user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await supabase.storage.from("asset-images").upload(path, file, { contentType: file.type, upsert: false });
    if (error) return NextResponse.json({ error: "Unable to upload asset images." }, { status: 400 });
    imagePaths.push(path);
  }
  const { error } = await supabase.from("assets").insert({ user_id: user.id, category: category || "Custom", title, description, maker, year, visibility, image_paths: imagePaths });
  if (error) return NextResponse.json({ error: "Unable to save asset." }, { status: 500 });
  return NextResponse.json({ saved: true });
}
