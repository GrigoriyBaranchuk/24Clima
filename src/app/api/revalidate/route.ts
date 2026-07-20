import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation. The shop-api backend POSTs here after a product is
 * published/updated so cached pages rebuild immediately instead of waiting for the
 * time-based revalidate window.
 *
 * Body: { secret: string, tags?: string[], paths?: string[] }
 * Auth: `secret` must equal process.env.REVALIDATE_SECRET (401 otherwise).
 *
 * Tags are shared with the tienda api-client (src/features/tienda/lib/api-client.ts):
 * "catalog" (product list/categories/brands/sitemap) and "product:{slug}" (detail).
 * These names MUST stay identical for on-demand invalidation to hit the cache.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  let body: { secret?: string; tags?: string[]; paths?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!secret || body.secret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];
  const paths = Array.isArray(body.paths) ? body.paths : [];

  for (const tag of tags) {
    if (typeof tag === "string" && tag) revalidateTag(tag);
  }
  for (const path of paths) {
    if (typeof path === "string" && path) revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, tags, paths, now: Date.now() });
}
