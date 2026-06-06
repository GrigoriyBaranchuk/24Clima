"use client";

import { metaPixelEvent } from "@/components/MetaPixel";
import { Star } from "lucide-react";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/HRgdnx2fS25pu48fA";

/**
 * Mobile-only compact Google rating plate.
 * Single tap → opens our Google Maps profile.
 * Designed per DESIGN.md (Apple-style card on dark hero, navy/green palette).
 */
export default function GoogleRatingCard() {
  return (
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => metaPixelEvent("ViewContent")}
      aria-label="Ver nuestras reseñas en Google Maps"
      className="lg:hidden flex items-center justify-between gap-3 mx-4 px-4 py-3 rounded-2xl bg-[#162a3e] active:scale-[0.98] transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
    >
      {/* Left: Google "G" + label */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Google G logo */}
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3.5 h-3.5 text-[#EF9F27] fill-[#EF9F27]"
                />
              ))}
            </div>
            <span
              className="text-white font-semibold text-[13px] tabular-nums"
              aria-label="5 de 5 estrellas"
            >
              5.0
            </span>
          </div>
          <span className="text-white/60 text-[12px] mt-0.5 truncate">
            Excelente en Google Maps
          </span>
        </div>
      </div>

      {/* Right: chevron-like arrow */}
      <span
        className="text-white/40 text-[20px] leading-none shrink-0 transition-transform active:translate-x-0.5"
        aria-hidden="true"
      >
        ›
      </span>
    </a>
  );
}
