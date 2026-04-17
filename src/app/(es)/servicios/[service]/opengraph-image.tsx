import { ImageResponse } from "next/og";
import { getTranslationKey, isServiceSlug } from "@/lib/services";
import { SERVICE_SEO_META } from "@/lib/service-seo-meta";
import { SERVICE_PRICING } from "@/lib/business-data";

export const alt = "24clima — Servicio de aire acondicionado en Panamá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERVICE_EMOJI: Record<string, string> = {
  cleaning: "🧹",
  maintenance: "🔧",
  repair: "🛠️",
  installation: "❄️",
  gasRecharge: "🌡️",
  emergency: "⚡",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;

  if (!isServiceSlug(service)) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1e3a5f",
            color: "white",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          24clima.com
        </div>
      ),
      { ...size }
    );
  }

  const translationKey = getTranslationKey(service)!;
  const seoKey = translationKey as keyof typeof SERVICE_SEO_META;
  const meta = SERVICE_SEO_META[seoKey];
  const pricing = SERVICE_PRICING[service];
  const emoji = SERVICE_EMOJI[translationKey] || "❄️";

  const title = meta?.title.es || service;
  // Extract short title (before " |")
  const shortTitle = title.split(" |")[0].split(" desde")[0];
  const price = pricing ? `desde $${pricing.minPrice.toFixed(2)}` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #1e3a5f 0%, #0d2240 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "rgba(123, 192, 67, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              {emoji}
            </div>
            <span
              style={{
                color: "#7BC043",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              24clima
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#fbbf24",
              fontSize: "24px",
            }}
          >
            ★ 5.0
          </div>
        </div>

        {/* Center: Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "52px",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {shortTitle}
          </h1>
          {price && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  background: "#7BC043",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: 700,
                  padding: "8px 24px",
                  borderRadius: "12px",
                }}
              >
                {price}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "22px",
                }}
              >
                Ciudad de Panamá · 24/7
              </span>
            </div>
          )}
        </div>

        {/* Bottom: Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "20px",
            }}
          >
            Maestro HVAC · 9+ años de experiencia · Garantía incluida
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "18px",
            }}
          >
            24clima.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
