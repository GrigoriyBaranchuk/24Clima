import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createServerSupabaseAdmin } from "@/lib/auth-server";
import { buildSeoAggregate } from "@/lib/seo-aggregate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const aggregate = await buildSeoAggregate(supabase);
  return NextResponse.json(aggregate);
}
