import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createServerSupabaseAdmin } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

const VALID_STATUS = ["new", "accepted", "rejected", "done"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const status = new URL(req.url).searchParams.get("status");
  let q = supabase.from("seo_recommendations").select("*").order("created_at", { ascending: false }).limit(100);
  if (status && VALID_STATUS.includes(status)) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recommendations: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { id?: number; status?: string };
  if (!body.id || !body.status || !VALID_STATUS.includes(body.status)) {
    return NextResponse.json({ error: "Provide { id, status } with a valid status" }, { status: 400 });
  }
  const { error } = await supabase
    .from("seo_recommendations")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
