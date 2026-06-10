import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseAdmin, verifyArticlesApiSecret } from "@/lib/auth-server";
import { normalizeSlug } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TITLE_MAX = 200;
const CONTENT_MAX = 200_000;
const IMAGE_URLS_MAX = 20;
const BODY_BYTES_MAX = 1_000_000; // ~1 MB; reject oversized payloads before parsing

/** Optional title/content field: must be string within limit; empty → null. */
function optionalText(value: unknown, max: number): string | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined; // signal invalid
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) return undefined;
  return trimmed;
}

/**
 * POST /api/articles — create or update an article (upsert by slug).
 * Auth: Authorization: Bearer <ARTICLES_API_SECRET>. Server-to-server, idempotent.
 * content_* fields are GitHub-flavored Markdown (not HTML).
 */
export async function POST(req: NextRequest) {
  if (!verifyArticlesApiSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cap total body size regardless of Content-Length (covers chunked bodies and
  // oversized non-content fields). Vercel also bounds the request body at the platform level.
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > BODY_BYTES_MAX) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > BODY_BYTES_MAX) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;

  // slug — required, normalized, must match strict pattern.
  if (typeof input.slug !== "string") {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  const slug = normalizeSlug(input.slug);
  if (slug.length < 3 || slug.length > 120 || !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "slug must be 3-120 chars, lowercase letters/digits separated by hyphens" },
      { status: 400 }
    );
  }

  // title_es / content_es — required: the site is Spanish and the article only
  // shows on the main site when Spanish fields are present.
  if (typeof input.title_es !== "string" || !input.title_es.trim()) {
    return NextResponse.json({ error: "title_es is required" }, { status: 400 });
  }
  if (typeof input.content_es !== "string" || !input.content_es.trim()) {
    return NextResponse.json({ error: "content_es is required" }, { status: 400 });
  }
  const titleEs = input.title_es.trim();
  const contentEs = input.content_es.trim();
  if (titleEs.length > TITLE_MAX) {
    return NextResponse.json({ error: `title_es exceeds ${TITLE_MAX} chars` }, { status: 400 });
  }
  if (contentEs.length > CONTENT_MAX) {
    return NextResponse.json({ error: `content_es exceeds ${CONTENT_MAX} chars` }, { status: 400 });
  }

  // Optional localized fields (ru/en). title_ru/content_ru are NOT NULL in the DB,
  // so fall back to the Spanish text when the partner does not send Russian.
  const titleRuOpt = optionalText(input.title_ru, TITLE_MAX);
  const contentRuOpt = optionalText(input.content_ru, CONTENT_MAX);
  const titleEn = optionalText(input.title_en, TITLE_MAX);
  const contentEn = optionalText(input.content_en, CONTENT_MAX);
  if ([titleRuOpt, contentRuOpt, titleEn, contentEn].some((v) => v === undefined)) {
    return NextResponse.json(
      { error: "title_ru/content_ru/title_en/content_en must be strings within length limits" },
      { status: 400 }
    );
  }
  const titleRu = titleRuOpt ?? titleEs;
  const contentRu = contentRuOpt ?? contentEs;

  // image_urls — optional array of https URLs.
  const imageUrls: string[] = [];
  if (input.image_urls !== undefined && input.image_urls !== null) {
    if (!Array.isArray(input.image_urls)) {
      return NextResponse.json({ error: "image_urls must be an array" }, { status: 400 });
    }
    if (input.image_urls.length > IMAGE_URLS_MAX) {
      return NextResponse.json({ error: `image_urls max ${IMAGE_URLS_MAX} items` }, { status: 400 });
    }
    for (const url of input.image_urls) {
      if (typeof url !== "string") {
        return NextResponse.json({ error: "image_urls must contain strings" }, { status: 400 });
      }
      const trimmed = url.trim();
      let parsed: URL;
      try {
        parsed = new URL(trimmed);
      } catch {
        return NextResponse.json({ error: `invalid image URL: ${url}` }, { status: 400 });
      }
      if (parsed.protocol !== "https:") {
        return NextResponse.json({ error: `image URLs must be https: ${url}` }, { status: 400 });
      }
      imageUrls.push(trimmed);
    }
  }

  const admin = createServerSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  const { error } = await admin.from("articles").upsert(
    {
      slug,
      title_ru: titleRu,
      title_es: titleEs,
      title_en: titleEn ?? null,
      content_ru: contentRu,
      content_es: contentEs,
      content_en: contentEn ?? null,
      image_urls: imageUrls,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" }
  );

  if (error) {
    console.error("articles upsert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug }, { status: 200 });
}
