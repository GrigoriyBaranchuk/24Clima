"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  /** Final value as displayed string, e.g. "+800", "9+", "24/7" */
  value: string;
  /** Animation duration in ms */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Animates an integer value from 0 to the parsed target when the element
 * enters the viewport. Designed to be SEO/CWV-safe:
 *
 * - SSR renders the FINAL value (the `value` prop). No-JS users and
 *   Googlebot's first-pass DOM see the real number — same string as before.
 * - useState initial value matches SSR → no hydration mismatch.
 * - Animation only kicks in after IntersectionObserver triggers on the
 *   client; if `prefers-reduced-motion: reduce` is on, no animation at all.
 * - Only animates once per mount (we track with a ref) — re-entering the
 *   viewport later doesn't re-trigger.
 * - If `value` doesn't contain a parseable integer (e.g. "24/7"), renders
 *   as a static span.
 *
 * Pattern: render `+800` → IO triggers → reset to 0 → tick to 800. Reads
 * to the user as "the stat counted up when I scrolled here." For
 * pages where the stat is above-the-fold, the IO fires almost immediately
 * after hydration; expect a brief 0→target tick.
 */
export default function CountUp({ value, duration = 1200, className, style }: Props) {
  const match = value.match(/^([+\-]?)(\d+)(.*)$/);
  const [display, setDisplay] = useState<string>(value);
  const animated = useRef(false);
  const { ref, isVisible } = useScrollReveal<HTMLSpanElement>();

  useEffect(() => {
    if (!isVisible || !match || animated.current) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    if (isNaN(target) || target === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animated.current = true;
      return;
    }

    animated.current = true;

    let frameId = 0;
    let startTs: number | null = null;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const current = Math.round(target * easeOutQuart(progress));
      setDisplay(`${prefix}${current}${suffix}`);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, value, duration, match]);

  if (!match) {
    return (
      <span className={className} style={style}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={style}>
      {display}
    </span>
  );
}
