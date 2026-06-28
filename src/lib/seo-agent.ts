/**
 * Shared config for the interactive SEO agent (analyze + chat routes).
 * The agent runs server-side via the Anthropic API. It interprets the
 * deterministic seo_* data and produces recommendations / answers — it does
 * NOT open PRs (that stays in the Claude Code routine).
 */

import Anthropic from "@anthropic-ai/sdk";

/** One place to swap the model. Opus is the default; sonnet is the cheaper option. */
export const SEO_AGENT_MODEL = "claude-opus-4-8";

/** Returns an Anthropic client, or null if the API key isn't configured. */
export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

const SHARED_CONTEXT = `Eres un analista SEO/GEO/AEO para 24clima.com, una empresa de climatización (HVAC) en Panamá. El contenido del sitio está en español; la conversión es por WhatsApp. Trabajas sobre datos ya recogidos (Google Search Console, GA4, Core Web Vitals, y DataForSEO: posiciones, menciones en IA, on-page, backlinks).

Reglas de interpretación:
- La posición de GSC (datos propios, dónde aparecemos) y la posición de DataForSEO (SERP absoluto) son métricas distintas: no las promedies.
- Las menciones en IA tienen un retraso de 2-7 días: trátalas como direccionales, no actúes por una caída de una sola semana.
- CWV: solo compara datos de campo (CrUX) con umbrales LCP>2.5s / INP>200ms / CLS>0.1.
- Si una fuente está marcada como obsoleta/fallida, no interpretes su valor como una regresión real.`;

export const ANALYZE_SYSTEM = `${SHARED_CONTEXT}

Tu tarea: a partir de los datos, produce una lista PRIORIZADA de recomendaciones accionables (por impacto × confianza). Cada recomendación: categoría (rankings | ai | cwv | onpage | content | technical), severidad (critical | warning | info), un título corto y un detalle con la evidencia (la cifra concreta) y el siguiente paso recomendado. No propongas cambios de código ni PRs: son recomendaciones para que una persona decida. Devuelve entre 3 y 10 recomendaciones, las más valiosas primero. ESCRIBE el título (title) y el detalle (detail) de cada recomendación en RUSO.`;

export const CHAT_SYSTEM = `${SHARED_CONTEXT}

Estás respondiendo preguntas del dueño del sitio en un panel de administración. Responde de forma concreta y breve, SIEMPRE fundamentado en los datos que se te dan abajo. Si los datos no contienen la respuesta, dilo claramente en lugar de inventar. Responde SIEMPRE en RUSO, salvo que la pregunta esté escrita en otro idioma (en ese caso, responde en el idioma de la pregunta).`;

/** JSON schema for the structured analyze output. */
export const RECOMMENDATIONS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string" },
          severity: { type: "string", enum: ["critical", "warning", "info"] },
          title: { type: "string" },
          detail: { type: "string" },
        },
        required: ["category", "severity", "title", "detail"],
      },
    },
  },
  required: ["recommendations"],
} as const;

export type AgentRecommendation = {
  category: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
};
