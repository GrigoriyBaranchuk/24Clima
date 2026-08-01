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
// Thinking runs before the JSON comes back, so the whole call takes longer than
// it did on Opus 4.8 — 60s was cutting it close.
export const maxDuration = 300;

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
      max_tokens: 12000,
      system: ANALYZE_SYSTEM,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: RECOMMENDATIONS_SCHEMA },
      },
      messages: [{ role: "user", content: `Datos de esta semana:\n\n${context}` }],
    });
    // Both cases would otherwise surface as an opaque JSON parse error: a
    // truncated answer isn't valid JSON, and a refusal has no text block at all.
    if (response.stop_reason === "max_tokens") {
      throw new Error("respuesta truncada (max_tokens) — subir el límite");
    }
    if (response.stop_reason === "refusal") {
      throw new Error("el modelo rechazó la petición");
    }
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
