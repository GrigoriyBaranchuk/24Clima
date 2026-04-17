import { SERVICE_STATS } from "@/lib/service-stats";
import type { ServiceSlug } from "@/lib/services";

type SupportedLocale = "es" | "en" | "ru";

type Props = {
  service: ServiceSlug;
  locale: SupportedLocale;
};

/**
 * ServiceStatsBar — горизонтальная полоса с 3–4 ключевыми метриками услуги.
 *
 * Отображается сразу после Hero-секции на странице услуги.
 * Машинно-читаемые data-атрибуты (data-stat-value / data-stat-label)
 * помогают AI-ботам извлечь факты (+25–35% GEO по Princeton).
 *
 * Если для данного slug нет метрик — ничего не рендерится.
 */
export default function ServiceStatsBar({ service, locale }: Props) {
  const stats = SERVICE_STATS[service];
  if (!stats || stats.length === 0) return null;

  return (
    <section
      className="bg-[#0d2240] border-t border-b border-white/10"
      aria-label="service statistics"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-white/10">
          {stats.slice(0, 4).map((stat, i) => (
            <div
              key={i}
              className="py-6 md:py-8 px-4 md:px-6 text-center"
              data-stat-value={stat.value}
              data-stat-label={stat.label[locale]}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#7BC043] tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1.5 text-xs md:text-sm text-white/80 leading-snug">
                {stat.label[locale]}
              </div>
              {stat.source && (
                <div className="mt-1 text-[10px] md:text-xs text-white/40 italic">
                  {stat.source}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
