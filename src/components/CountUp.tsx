"use client";

import { useEffect, useRef, useState } from "react";

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
 * enters the viewport.
 *
 * SEO/CWV safety:
 * - SSR renders the FINAL value. No-JS and Googlebot see the real number.
 * - useState initial value matches SSR → no hydration mismatch.
 * - Animation runs at most once per mount.
 *
 * Avoiding the "downshift glitch":
 * If the element is ALREADY in the viewport when the component mounts
 * (e.g. stats above the fold on desktop), we skip the animation entirely
 * and keep the SSR value visible — otherwise the user would see the
 * number flash from "+800" down to "+0" and tick back up, which reads
 * as a backwards countdown. Animation only runs when the user actively
 * scrolls the element INTO view from outside.
 *
 * If `value` has no parseable integer (e.g. "24/7"), renders as static.
 */
export default function CountUp({
  value,
  duration = 1200,
  className,
  style,
}: Props) {
  const match = value.match(/^([+\-]?)(\d+)(.*)$/);
  const [display, setDisplay] = useState<string>(value);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!match || animated.current) return;
    const el = ref.current;
    if (!el) return;

    const [, prefix, numStr, suffix] = match;
    const target = Number.parseInt(numStr, 10);
    if (Number.isNaN(target) || target === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animated.current = true;
      return;
    }

    // Synchronously check whether the element is already in the viewport.
    // If so, skip animation — we don't want to reset to 0 in front of a
    // user who already saw the final value (reads as backwards countdown).
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyInView) {
      animated.current = true;
      return;
    }

    let frameId = 0;
    let startTs: number | null = null;
    const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

    const start = () => {
      // Begin from 0 (or base) — only safe because we confirmed the
      // element is not yet visible at the moment of this call.
      // Write intermediate frames straight to the DOM via the ref to avoid
      // a React re-render every animation frame; React state is committed
      // only once at the end so the DOM and React agree on the final value.
      el.textContent = `${prefix}0${suffix}`;
      const tick = (ts: number) => {
        if (startTs === null) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        const current = Math.round(target * easeOutQuart(progress));
        if (progress < 1) {
          el.textContent = `${prefix}${current}${suffix}`;
          frameId = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };
      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          observer.unobserve(el);
          start();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [value, duration, match]);

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
