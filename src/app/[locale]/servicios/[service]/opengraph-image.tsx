import { ImageResponse } from "next/og";
import { getTranslationKey, isServiceSlug } from "@/lib/services";
import { SERVICE_SEO_META } from "@/lib/service-seo-meta";
import { SERVICE_PRICING } from "@/lib/business-data";

export const alt = "24clima — Air conditioning service in Panama";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type SupportedLocale = "es" | "en" | "ru";

const SERVICE_EMOJI: Record<string, string> = {
  cleaning: "🧹",
  maintenance: "🔧",
  repair: "🛠️",
  installation: "❄️",
  gasRecharge: "🌡️",
  emergency: "⚡",
};

const tagline: Record<SupportedLocale, string> = {
  es: "Maestro HVAC · 9+ años de experiencia · Garantía incluida",
  en: "HVAC Master · 9+ years experience · Warranty included",
  ru: "Мастер HVAC · 9+ лет опыта · Гарантия",
};

const cityLabel: Record<SupportedLocale, string> = {
  es: "Ciudad de Panamá · 24/7",
  en: "Panama City · 24/7",
  ru: "Панама-Сити · 24/7",
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale: rawLocale, service } = await params;

  const locale: SupportedLocale =
    rawLocale === "en" || rawLocale === "ru" ? rawLocale : "en";

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

  const title = meta?.title[locale] || meta?.title.en || service;
  const shortTitle = title.split(" |")[0].split(" from")[0].split(" от")[0];
  const price = pricing ? `from $${pricing.minPrice.toFixed(2)}` : "";

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
                {cityLabel[locale]}
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
            {tagline[locale]}
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
