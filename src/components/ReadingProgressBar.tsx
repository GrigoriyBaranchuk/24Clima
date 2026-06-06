"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(1);
      } else {
        const scrolled = window.scrollY / docHeight;
        setProgress(Math.min(scrolled, 1));
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 w-full bg-[#7BC043] transition-transform duration-150 ease-out motion-reduce:transition-none"
      style={{ transform: `scaleX(${progress})`, transformOrigin: "left" }}
      aria-hidden
    />
  );
}
