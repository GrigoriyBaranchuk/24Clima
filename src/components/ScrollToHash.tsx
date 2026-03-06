"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";

const HEADER_OFFSET_PX = 80;

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/" && pathname !== "") return;
    const hash = typeof window !== "undefined" ? window.location.hash?.slice(1) : "";
    if (!hash) return;
    const scroll = () => {
      const el = document.getElementById(hash);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
      window.scrollTo({ top, behavior: "smooth" });
    };
    const t = setTimeout(scroll, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
