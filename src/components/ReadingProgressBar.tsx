"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(100);
        return;
      }
      const scrolled = (window.scrollY / docHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 bg-[#7BC043] transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
}
