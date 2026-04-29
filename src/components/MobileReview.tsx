"use client";

import { Star } from "lucide-react";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/HRgdnx2fS25pu48fA";

/**
 * Google Maps rating badge — mobile only.
 * Links to the 24clima Google Maps profile.
 */
export default function MobileReview() {
  return (
    <div className="lg:hidden bg-[#0d1b2a] px-4 py-2">
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#162a3e] rounded-2xl p-4 active:scale-[0.98] transition-transform"
      >
        {/* Google "G" icon */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        {/* Rating info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-white font-semibold text-sm">5.0</span>
          </div>
          <p className="text-white/50 text-xs">Google Maps &middot; Ver reseñas</p>
        </div>
        {/* Arrow */}
        <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
