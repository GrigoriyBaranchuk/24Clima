import { getTranslations } from "next-intl/server";
import { Users, Award, Star, Clock, MapPin } from "lucide-react";

type StatItem = {
  value: string;
  labelKey: "clients" | "expertYears" | "rating" | "availability" | "zonesCovered";
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Machine-readable value for GEO/AI extraction via microdata.
   */
  itemValue: string;
  itemName: string;
};

const STATS: StatItem[] = [
  {
    value: "300+",
    labelKey: "clients",
    icon: Users,
    itemName: "satisfiedClients",
    itemValue: "300",
  },
  {
    value: "9+",
    labelKey: "expertYears",
    icon: Award,
    itemName: "expertExperienceYears",
    itemValue: "9",
  },
  {
    value: "5.0★",
    labelKey: "rating",
    icon: Star,
    itemName: "averageRating",
    itemValue: "5.0",
  },
  {
    value: "24/7",
    labelKey: "availability",
    icon: Clock,
    itemName: "emergencyAvailability",
    itemValue: "24/7",
  },
  {
    value: "10+",
    labelKey: "zonesCovered",
    icon: MapPin,
    itemName: "zonesCovered",
    itemValue: "10",
  },
];

type Props = {
  locale?: "es" | "en" | "ru";
};

/**
 * StatsSection — блок «По цифрам» для главной.
 * Усиливает E-E-A-T (Experience, Trustworthiness) и GEO:
 * извлекаемые факты с микроразметкой для AI-поисковиков.
 */
export default async function StatsSection({ locale: _locale }: Props = {}) {
  const t = await getTranslations("stats");

  return (
    <section
      className="hero-gradient py-16 md:py-20 relative overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Decorative blur background — consistent with Hero */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#7BC043] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <h2
            id="stats-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            {t("sectionTitle")}
          </h2>
          <p className="mt-3 md:mt-4 text-white/80 text-base md:text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <ul
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
          role="list"
        >
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <li
                key={stat.labelKey}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 md:p-6 flex flex-col items-center text-center hover:bg-white/15 transition-colors"
                data-stat-name={stat.itemName}
                data-stat-value={stat.itemValue}
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#7BC043]/20 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#7BC043]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm md:text-base text-white/80 leading-snug">
                  {t(stat.labelKey)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
