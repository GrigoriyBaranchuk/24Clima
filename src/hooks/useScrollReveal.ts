"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  /** IntersectionObserver threshold (0-1). Default 0.15 */
  threshold?: number;
  /** Root margin string. Default "0px 0px -60px 0px" */
  rootMargin?: string;
  /** Only trigger once? Default true */
  once?: boolean;
}

/**
 * Hook that tracks whether an element is visible in viewport.
 * Respects prefers-reduced-motion — instantly visible when motion is reduced.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
