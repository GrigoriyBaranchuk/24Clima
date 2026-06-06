import { Link } from "@/i18n/routing";
import type { ServiceSlug } from "@/lib/services";
import {
  ChevronRight,
  Droplets,
  Settings,
  Thermometer,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

/**
 * Mobile services list — used on /servicios page.
 * Apple-style cards on the dark hero background.
 * Each card → /servicios/[slug] (existing detail page).
 */
type ServiceItem = {
  slug: ServiceSlug;
  translationKey: string;
  icon: typeof Droplets;
  /** Tailwind gradient classes for the icon tile background */
  gradient: string;
};

const SERVICES: ServiceItem[] = [
  {
    slug: "limpieza",
    translationKey: "cleaning",
    icon: Droplets,
    gradient: "from-[#4A90D9] to-[#357ABD]",
  },
  {
    slug: "mantenimiento",
    translationKey: "maintenance",
    icon: Settings,
    gradient: "from-[#7BC043] to-[#0F9D58]",
  },
  {
    slug: "reparacion",
    translationKey: "repair",
    icon: Wrench,
    gradient: "from-[#F5A623] to-[#E8961E]",
  },
  {
    slug: "instalacion",
    translationKey: "installation",
    icon: Wind,
    gradient: "from-[#185FA5] to-[#103E6E]",
  },
  {
    slug: "carga-de-gas",
    translationKey: "gasRecharge",
    icon: Thermometer,
    gradient: "from-[#0F6E56] to-[#0a4f3e]",
  },
  {
    slug: "emergencia",
    translationKey: "emergency",
    icon: Zap,
    gradient: "from-[#E55B8C] to-[#A32D2D]",
  },
];

export default async function ServicesGrid() {
  const t = await getTranslations("services");

  return (
    <section className="lg:hidden bg-[#0d1b2a] px-4 pt-4 pb-6 min-h-[calc(100dvh-3.5rem-5rem)]">
      {/* Title */}
      <div className="mb-4">
        <p className="text-white/55 text-[12px] font-semibold uppercase tracking-[0.12em]">
          {t("title")}
        </p>
        <h1
          className="text-white text-[22px] font-semibold mt-1"
          style={{ letterSpacing: "-0.3px" }}
        >
          {t("subtitle")}
        </h1>
      </div>

      {/* Services list — vertical cards (Apple-style) */}
      <ul className="flex flex-col gap-2.5">
        {SERVICES.map((s, index) => {
          const shortTitle = t(`${s.translationKey}.shortTitle`);
          const desc = t(`${s.translationKey}.description`);
          const Icon = s.icon;
          return (
            <li
              key={s.slug}
              className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Link
                href={`/servicios/${s.slug}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#162a3e] active:scale-[0.98] transition-transform shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-[16px] leading-tight">
                    {shortTitle}
                  </p>
                  <p className="text-white/55 text-[12px] mt-1 line-clamp-2 leading-snug">
                    {desc}
                  </p>
                </div>
                <ChevronRight
                  className="w-5 h-5 text-white/40 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
