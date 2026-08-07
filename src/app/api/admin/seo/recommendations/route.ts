import { createServerSupabaseAdmin, requireAdmin } from "@/lib/auth-server";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const VALID_STATUS = ["new", "accepted", "rejected", "done"];
const MAX_RESOLUTION_LENGTH = 2000;

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase)
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );

  const status = new URL(req.url).searchParams.get("status");
  let q = supabase.from("seo_recommendations").select("*").limit(100);
  if (status && VALID_STATUS.includes(status)) q = q.eq("status", status);
  // Done rows feed the chart markers: order by completion date so the most
  // recent markers survive the limit; everything else stays newest-first.
  q =
    status === "done"
      ? q.order("done_at", { ascending: false })
      : q.order("created_at", { ascending: false });
  const { data, error } = await q;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recommendations: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth)
    return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase)
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );

  const body = (await req.json().catch(() => ({}))) as {
    id?: number;
    status?: string;
    resolution?: string;
  };
  if (!body.id || !body.status || !VALID_STATUS.includes(body.status)) {
    return NextResponse.json(
      { error: "Provide { id, status } with a valid status" },
      { status: 400 },
    );
  }
  if (body.resolution !== undefined && typeof body.resolution !== "string") {
    return NextResponse.json(
      { error: "resolution must be a string" },
      { status: 400 },
    );
  }
  const resolution = body.resolution?.trim().slice(0, MAX_RESOLUTION_LENGTH);

  // done_at must satisfy the seo_reco_done_at_consistency check constraint:
  // set on entering "done" (keep the original date on a repeated done), clear
  // on leaving it. Read the current row first — supabase-js can't express
  // "coalesce(done_at, now())" in an update.
  const { data: current, error: readError } = await supabase
    .from("seo_recommendations")
    .select("done_at")
    .eq("id", body.id)
    .single();
  if (readError)
    return NextResponse.json(
      { error: readError.message },
      { status: readError.code === "PGRST116" ? 404 : 500 },
    );

  const update: Record<string, unknown> = {
    status: body.status,
    updated_at: new Date().toISOString(),
    done_at:
      body.status === "done"
        ? (current.done_at ?? new Date().toISOString())
        : null,
  };
  if (resolution !== undefined) update.resolution = resolution;

  const { error } = await supabase
    .from("seo_recommendations")
    .update(update)
    .eq("id", body.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
