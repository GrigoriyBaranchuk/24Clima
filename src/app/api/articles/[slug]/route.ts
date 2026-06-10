import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseAdmin, verifyArticlesApiSecret } from "@/lib/auth-server";
import { normalizeSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * DELETE /api/articles/:slug — remove an article by slug.
 * Auth: Authorization: Bearer <ARTICLES_API_SECRET>. Idempotent:
 * deleting a missing slug also returns 200.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verifyArticlesApiSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug: rawSlug } = await params;
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawSlug ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const slug = normalizeSlug(decoded);
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const admin = createServerSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  // Match both the normalized slug and the legacy leading-slash form the article
  // pages read as a fallback, so a delete removes the row the site would serve.
  const { error } = await admin.from("articles").delete().in("slug", [slug, `/${slug}`]);
  if (error) {
    console.error("articles delete error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug }, { status: 200 });
}
