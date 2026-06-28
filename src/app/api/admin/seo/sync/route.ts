import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;

const ENDPOINTS: Record<string, string> = {
  google: "/api/sync-seo",
  dataforseo: "/api/sync-dataforseo",
};

/** Triggers an ingestion run by proxying the existing cron endpoint (reuses CRON_SECRET). */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  if (!CRON_SECRET) return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { source?: string };
  const path = body.source ? ENDPOINTS[body.source] : undefined;
  if (!path) return NextResponse.json({ error: "Invalid source (google | dataforseo)" }, { status: 400 });

  // Build an absolute URL to our own deployment from the incoming request origin.
  const origin = new URL(req.url).origin;
  let res: Response;
  try {
    res = await fetch(`${origin}${path}`, { headers: { Authorization: `Bearer ${CRON_SECRET}` } });
  } catch (e) {
    return NextResponse.json({ error: "Failed to reach ingestion endpoint", details: String(e) }, { status: 502 });
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json({ ok: res.ok, status: res.status, result: data }, { status: res.ok ? 200 : 207 });
}
