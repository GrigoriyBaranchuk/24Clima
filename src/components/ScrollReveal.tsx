"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  /** Delay in ms (applied as transition-delay) */
  delay?: number;
}

/**
 * Wrapper component that animates children into view on scroll.
 * Respects prefers-reduced-motion via the hook.
 */
export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const baseStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: "700ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
  };

  const hiddenStyles: Record<string, React.CSSProperties> = {
    "fade-up": { opacity: 0, transform: "translateY(30px)" },
    "fade-in": { opacity: 0, transform: "none" },
    "fade-left": { opacity: 0, transform: "translateX(-30px)" },
    "fade-right": { opacity: 0, transform: "translateX(30px)" },
  };

  const visibleStyles: React.CSSProperties = { opacity: 1, transform: "none" };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...baseStyles,
        ...(isVisible ? visibleStyles : hiddenStyles[animation]),
      }}
    >
      {children}
    </div>
  );
}
