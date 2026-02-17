import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();
    if (!text || !target) {
      return NextResponse.json(
        { error: "text and target required" },
        { status: 400 }
      );
    }
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Translation API not configured" },
        { status: 503 }
      );
    }
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target, source: "ru" }),
      }
    );
    const data = await res.json();
    if (data.error) {
      return NextResponse.json(data.error, { status: 400 });
    }
    const translated =
      data.data?.translations?.[0]?.translatedText ?? text;
    return NextResponse.json({ translated });
  } catch (e) {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
