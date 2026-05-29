"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type Props = {
  className?: string;
  /** Stroke color. Default green brand. */
  color?: string;
  /** Stroke width in viewBox units. Default 0.5. */
  width?: number;
};

/**
 * Decorative horizontal line that draws itself with stroke-dashoffset
 * when it enters the viewport. Reuses the project's IntersectionObserver
 * hook so we don't double up on observers.
 *
 * SEO/CWV notes:
 * - Fixed 2px box height — no CLS contribution.
 * - opacity/stroke-dashoffset only (no layout properties animated).
 * - prefers-reduced-motion: useScrollReveal returns isVisible=true on
 *   first render, so the line is fully drawn immediately.
 * - aria-hidden — purely decorative.
 */
export default function SectionDividerStroke({
  className = "",
  color = "#7BC043",
  width = 0.5,
}: Props) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <div
      ref={ref}
      className={`relative h-[2px] w-full ${className}`}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="2"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        className="block"
      >
        <line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          stroke={color}
          strokeWidth={width}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={isVisible ? 0 : 100}
          style={{
            transition: "stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
    </div>
  );
}
