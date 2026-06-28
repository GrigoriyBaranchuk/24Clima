import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, createServerSupabaseAdmin } from "@/lib/auth-server";
import { buildSeoAggregate, aggregateToContext } from "@/lib/seo-aggregate";
import { getAnthropic, SEO_AGENT_MODEL, CHAT_SYSTEM } from "@/lib/seo-agent";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const supabase = createServerSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const anthropic = getAnthropic();
  if (!anthropic) return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { messages?: ChatMessage[] };
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12); // bound history
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Provide a non-empty messages array ending with a user message" }, { status: 400 });
  }

  const aggregate = await buildSeoAggregate(supabase);
  const system = `${CHAT_SYSTEM}\n\nDatos actuales del sitio:\n${aggregateToContext(aggregate)}`;

  const stream = anthropic.messages.stream({
    model: SEO_AGENT_MODEL,
    max_tokens: 2000,
    output_config: { effort: "medium" },
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const rs = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[Error al generar la respuesta]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(rs, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
