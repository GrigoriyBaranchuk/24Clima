"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right";
  /** Delay in ms (applied as transition-delay) */
  delay?: number;
  /**
   * Tag to render. Defaults to `div`; pass `li` when the wrapper sits directly
   * inside a `<ul>` — otherwise the wrapper breaks the list's semantics by
   * standing between the list and its items.
   */
  as?: "div" | "li";
} & { [key: `data-${string}`]: string | number | undefined };

const hiddenStyles: Record<string, React.CSSProperties> = {
  "fade-up": {
    opacity: 0,
    transform: "translateY(30px)",
    willChange: "opacity, transform",
  },
  "fade-in": {
    opacity: 0,
    transform: "none",
    willChange: "opacity, transform",
  },
  "fade-left": {
    opacity: 0,
    transform: "translateX(-30px)",
    willChange: "opacity, transform",
  },
  "fade-right": {
    opacity: 0,
    transform: "translateX(30px)",
    willChange: "opacity, transform",
  },
};

const visibleStyles: React.CSSProperties = { opacity: 1, transform: "none" };

/**
 * Wrapper component that animates children into view on scroll.
 * Respects prefers-reduced-motion via the hook.
 */
export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  as: Tag = "div",
  ...rest
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  const baseStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: "700ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
  };

  return (
    <Tag
      // The hook is generic over one element type; `div` and `li` are different
      // DOM interfaces, so the ref needs a cast to satisfy both tags.
      ref={ref as React.RefObject<HTMLDivElement & HTMLLIElement>}
      className={className}
      style={{
        ...baseStyles,
        ...(isVisible ? visibleStyles : hiddenStyles[animation]),
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
