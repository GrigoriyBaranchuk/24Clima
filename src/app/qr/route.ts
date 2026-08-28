import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse, after } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const WHATSAPP_MESSAGE =
  "Hola, vi el QR del auto de 24clima y quiero una cotización";
// wa.me wants digits only, no "+".
const WHATSAPP_TARGET = `https://wa.me/50768282120?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export async function GET(req: NextRequest) {
  // Ответ строится ПЕРВЫМ — логирование не должно влиять на редирект.
  const response = NextResponse.redirect(WHATSAPP_TARGET, 302);

  const userAgent = req.headers.get("user-agent");
  const referrer = req.headers.get("referer");
  const country = req.headers.get("x-vercel-ip-country");

  // Runs after the response is sent — fire-and-forget analytics.
  after(async () => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      // supabase-js returns errors instead of throwing — log, never rethrow.
      const { error } = await supabase.from("qr_scans").insert({
        user_agent: userAgent,
        referrer,
        country,
        source: "car-sticker",
      });
      if (error) console.error("[qr] scan log failed", error.message);
    } catch (e) {
      console.error("[qr] scan log failed", e);
    }
  });

  return response;
}
