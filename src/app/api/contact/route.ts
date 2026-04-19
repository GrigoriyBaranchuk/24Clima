import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RATE_LIMIT_MS = 30_000; // 30s between submissions
const recentIPs = new Map<string, number>();

export async function POST(request: Request) {
  try {
    // Basic rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const lastSubmit = recentIPs.get(ip);
    if (lastSubmit && Date.now() - lastSubmit < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Por favor espera antes de enviar otro mensaje" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, contact, message } = body;

    // Validation
    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (name.length > 100 || contact.length > 100 || message.length > 2000) {
      return NextResponse.json(
        { error: "Mensaje demasiado largo" },
        { status: 400 }
      );
    }

    // Simple honeypot / spam check — no URLs in name
    if (/https?:\/\//.test(name)) {
      return NextResponse.json({ ok: true }); // Silent reject spam
    }

    // Save to Supabase if available
    if (supabase) {
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
        ip,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Don't fail — the form still "works" even if DB is down
      }
    }

    // Update rate limit
    recentIPs.set(ip, Date.now());

    // Clean old entries periodically
    if (recentIPs.size > 1000) {
      const cutoff = Date.now() - RATE_LIMIT_MS * 10;
      for (const [key, time] of recentIPs) {
        if (time < cutoff) recentIPs.delete(key);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
