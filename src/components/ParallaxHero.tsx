"use client";

import { useEffect, useRef } from "react";

type ParallaxHeroProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Hero with a transform-based parallax background.
 *
 * Performance notes:
 * - Animates ONLY `transform: translate3d` on a compositor layer — no
 *   layout/paint per frame. (The old version used
 *   `background-attachment: fixed`, which repaints the whole layer on
 *   every scroll frame and is ignored on most mobile browsers anyway.)
 * - The scroll handler does nothing but schedule one rAF; the rAF reads
 *   the rect once and writes the transform once (read-then-write, no
 *   layout thrashing).
 * - The rAF loop only runs while the hero is in the viewport
 *   (IntersectionObserver toggles it on/off).
 * - Parallax is a desktop-only enhancement and is skipped under
 *   `prefers-reduced-motion: reduce`. On mobile the layer just sits
 *   static — visually identical, zero scroll cost.
 * - `will-change: transform` is set only while the effect is active and
 *   cleared when off-screen, so we don't pin a layer for nothing.
 */
export default function ParallaxHero({
  children,
  className = "",
}: ParallaxHeroProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;

    // Desktop + motion-allowed only. Parallax during momentum scroll on
    // touch devices is a jank source and visually negligible here.
    const allowed = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    if (!allowed.matches) return;

    // One-shot reveal of the content: fade + small upward translate.
    // Gated by the SAME desktop+motion condition as the parallax, so on
    // mobile / reduced-motion the content renders static and visible
    // (the start styles below are only ever applied when allowed).
    // transform + opacity only — compositor-friendly.
    const content = contentRef.current;
    if (content) {
      content.style.opacity = "0";
      content.style.transform = "translate3d(0, 12px, 0)";
      content.style.willChange = "transform, opacity";
      requestAnimationFrame(() => {
        content.style.transition =
          "transform 600ms ease-out, opacity 600ms ease-out";
        content.style.opacity = "1";
        content.style.transform = "translate3d(0, 0, 0)";
      });
      const clearWillChange = () => {
        content.style.willChange = "";
      };
      content.addEventListener("transitionend", clearWillChange, {
        once: true,
      });
    }

    let active = false;
    let ticking = false;
    let raf = 0;

    const update = () => {
      ticking = false;
      const rect = hero.getBoundingClientRect();
      // Background drifts at a fraction of the scroll, clamped to the
      // slack we reserved with the -inset-y so edges never show.
      const slack = rect.height * 0.15;
      const y = Math.max(-slack, Math.min(slack, rect.top * -0.12));
      layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!active || ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          layer.style.willChange = "transform";
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
          layer.style.willChange = "";
        }
      },
      { threshold: 0 },
    );
    io.observe(hero);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`relative min-h-[45vh] lg:min-h-[50vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Oversized so the parallax translate has room without exposing edges */}
      <div
        ref={layerRef}
        className="absolute inset-x-0 -top-[18%] -bottom-[18%] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(13, 34, 64, 0.9) 50%, rgba(10, 22, 40, 0.95) 100%)",
        }}
        aria-hidden
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>
      <div ref={contentRef} className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
