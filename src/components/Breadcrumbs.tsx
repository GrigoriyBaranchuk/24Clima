"use client";

import { useLocale } from "next-intl";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "@/i18n/routing";

export interface BreadcrumbSegment {
  label: string;
  href?: string; // omit for current (last) item
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
  /** Visual variant — "light" for dark backgrounds, "dark" for light backgrounds */
  variant?: "light" | "dark";
}

/**
 * Visual breadcrumb navigation bar.
 * Renders Home icon → ... → current page.
 * Uses next-intl Link for locale-aware routing.
 *
 * JSON-LD structured data is handled separately in each page's server component
 * via buildBreadcrumbJsonLd() — this component is purely visual + accessible.
 */
export default function Breadcrumbs({ segments, variant = "dark" }: BreadcrumbsProps) {
  const locale = useLocale();

  const homeLabel = locale === "ru" ? "Главная" : locale === "en" ? "Home" : "Inicio";

  const colors =
    variant === "light"
      ? { link: "text-white/70 hover:text-white", current: "text-white", separator: "text-white/40", bg: "" }
      : { link: "text-[#1e3a5f]/70 hover:text-[#1e3a5f]", current: "text-[#1e3a5f]", separator: "text-[#1e3a5f]/40", bg: "" };

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${colors.bg}`}>
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className={`flex items-center gap-1 transition-colors ${colors.link}`}
            aria-label={homeLabel}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{homeLabel}</span>
          </Link>
        </li>

        {/* Segments */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRight className={`w-3.5 h-3.5 mx-1 ${colors.separator}`} aria-hidden="true" />
              {isLast || !segment.href ? (
                <span className={`font-medium ${colors.current}`} aria-current="page">
                  {segment.label}
                </span>
              ) : (
                <Link
                  href={segment.href}
                  className={`transition-colors ${colors.link}`}
                >
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
