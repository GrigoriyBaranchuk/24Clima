import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-server";

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const MAX_BODY_BYTES = 8 * 1024; // 8KB
const ALLOWED_TARGETS = new Set(["es", "en"]);

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "Translation API not configured" },
      { status: 503 }
    );
  }

  let body: { text?: unknown; target?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }
    body = JSON.parse(raw) as { text?: unknown; target?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const target = typeof body.target === "string" ? body.target.toLowerCase() : "";

  if (!text || !target) {
    return NextResponse.json(
      { error: "text and target required" },
      { status: 400 }
    );
  }
  if (!ALLOWED_TARGETS.has(target)) {
    return NextResponse.json(
      { error: "target must be es or en" },
      { status: 400 }
    );
  }
  if (text.length > 5000) {
    return NextResponse.json(
      { error: "text too long" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target, source: "ru" }),
      }
    );
    const data = (await res.json()) as { data?: { translations?: { translatedText?: string }[] }; error?: unknown };
    if (data.error) {
      return NextResponse.json(data.error, { status: 400 });
    }
    const translated = data.data?.translations?.[0]?.translatedText ?? text;
    return NextResponse.json({ translated });
  } catch {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
