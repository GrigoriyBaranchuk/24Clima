import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createServerSupabaseAdmin } from "@/lib/auth-server";
import { buildSeoAggregate, aggregateToContext } from "@/lib/seo-aggregate";
import {
  getAnthropic,
  SEO_AGENT_MODEL,
  ANALYZE_SYSTEM,
  RECOMMENDATIONS_SCHEMA,
  type AgentRecommendation,
} from "@/lib/seo-agent";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const anthropic = getAnthropic();
  if (!anthropic) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });

  const aggregate = await buildSeoAggregate(supabase);
  const context = aggregateToContext(aggregate);

  let recommendations: AgentRecommendation[];
  try {
    const response = await anthropic.messages.create({
      model: SEO_AGENT_MODEL,
      max_tokens: 4000,
      system: ANALYZE_SYSTEM,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: RECOMMENDATIONS_SCHEMA },
      },
      messages: [{ role: "user", content: `Datos de esta semana:\n\n${context}` }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    const parsed = JSON.parse(textBlock && "text" in textBlock ? textBlock.text : "{}") as {
      recommendations?: AgentRecommendation[];
    };
    recommendations = parsed.recommendations ?? [];
  } catch (e) {
    return NextResponse.json({ error: "Agent analysis failed", details: String(e).slice(0, 300) }, { status: 502 });
  }

  if (recommendations.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, recommendations: [] });
  }

  // Mark prior 'new' rows superseded by this run, then insert the fresh set.
  await supabase.from("seo_recommendations").update({ status: "rejected", updated_at: new Date().toISOString() }).eq("status", "new");
  const rows = recommendations.map((r) => ({
    source: "agent",
    category: r.category,
    severity: ["critical", "warning", "info"].includes(r.severity) ? r.severity : "info",
    title: r.title,
    detail: r.detail,
    evidence: {},
    status: "new",
  }));
  const { data, error } = await supabase.from("seo_recommendations").insert(rows).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, inserted: rows.length, recommendations: data ?? [] });
}
