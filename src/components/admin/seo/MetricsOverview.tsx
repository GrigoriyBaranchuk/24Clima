"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SeoAggregate } from "@/lib/seo-aggregate";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* Цвета серий заданы явными hex, а не hsl(var(--chart-N)): переменные --chart-1..5
   нигде не определены (ни в globals.css, ни в @24clima/design/tokens.css), из-за чего
   stroke резолвился в невалидное значение и падал в initial value `none` — линии не
   рисовались. Токены дизайн-системы живут в отдельном пакете и правятся только там,
   поэтому локальная палитра админки держится здесь.
   Проверено на разделение при дальтонизме: ΔE 25.5 (deutan) / 14.1 (tritan), контраст к фону ≥3:1. */
const CHART = {
  green: "#29a366", // брендовый зелёный (hsl 150 60% 40%)
  indigo: "#4059c4",
  marker: "#d97706", // amber-600: не пересекается с цветами серий
} as const;

/** Выполненная рекомендация — источник засечки на графиках. */
export type RecoMarker = {
  id: number;
  title: string;
  category: string;
  resolution: string;
  done_at: string; // timestamptz ISO
};

/* done_at — timestamptz (UTC), а дневные серии GSC/GA4 агрегированы по дате
   в таймзоне ресурса (Панама). Один канонический перевод — иначе засечка
   съезжает на соседний день для вечерних записей. */
function panamaDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sv-SE", {
    timeZone: "America/Panama",
  });
}

/** Среднее метрики за 7 дней до даты vs после (включая её саму). null — мало точек. */
function trendAround(
  series: Record<string, unknown>[],
  key: string,
  date: string,
) {
  const num = (p: Record<string, unknown>) => Number(p[key] ?? 0);
  const before = series.filter((p) => String(p.date) < date).slice(-7);
  const after = series.filter((p) => String(p.date) >= date).slice(0, 7);
  if (before.length < 3 || after.length < 3) return null;
  const avg = (arr: Record<string, unknown>[]) =>
    arr.reduce((s, p) => s + num(p), 0) / arr.length;
  return {
    before: avg(before),
    after: avg(after),
    daysBefore: before.length,
    daysAfter: after.length,
  };
}

function pct(curr: number, prev: number): string {
  if (prev === 0) return curr === 0 ? "0%" : "новый";
  const d = ((curr - prev) / prev) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
}

function Kpi({
  label,
  value,
  delta,
  good,
}: { label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div className="mt-1 text-2xl font-bold text-[#1e3a5f]">{value}</div>
        {delta && (
          <div
            className={`text-sm ${good === undefined ? "text-gray-500" : good ? "text-green-600" : "text-red-600"}`}
          >
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* Кликабельная засечка на ReferenceLine. Стандартный ReferenceDot даёт цель
   клика ~4px — не попасть ни мышью, ни пальцем, поэтому свой глиф с невидимой
   зоной нажатия r=14. recharts клонирует label-элемент и передаёт viewBox
   (пиксельные координаты вертикальной линии). */
function MarkerGlyph(props: {
  viewBox?: { x?: number; y?: number };
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  const { viewBox, count, active, onSelect } = props;
  const x = viewBox?.x ?? 0;
  const y = (viewBox?.y ?? 0) + 8;
  return (
    /* role="button" на <g>: внутри SVG-графика recharts нет настоящего <button>;
       rule useSemanticElements отключён для файла в biome.json (overrides). */
    <g
      transform={`translate(${x},${y})`}
      style={{ cursor: "pointer" }}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <circle r={14} fill="transparent" />
      <circle
        r={6}
        fill={active ? "#92400e" : CHART.marker}
        stroke="#fff"
        strokeWidth={1.5}
      />
      {count > 1 && (
        <text
          y={2.5}
          textAnchor="middle"
          fontSize={8}
          fill="#fff"
          fontWeight="bold"
        >
          {count}
        </text>
      )}
    </g>
  );
}

/* Засечка привязывается к ближайшей дате, реально существующей в серии:
   GSC отдаёт данные с лагом ~2 дня, поэтому «сделано сегодня» без снаппинга
   просто не отрисовалось бы на категориальной оси X. */
function snapToSeries(
  markerDate: string,
  seriesDates: string[],
): string | null {
  if (!seriesDates.length || markerDate < seriesDates[0]) return null;
  return (
    seriesDates.find((d) => d >= markerDate) ??
    seriesDates[seriesDates.length - 1]
  );
}

export function MetricsOverview({
  data,
  markers = [],
}: { data: SeoAggregate; markers?: RecoMarker[] }) {
  const citedRate = data.aiMentions.totalCurr
    ? Math.round((data.aiMentions.citedCurr / data.aiMentions.totalCurr) * 100)
    : null;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Группировка по дню (в таймзоне Панамы): несколько внедрений за день — одна засечка со счётчиком.
  const markerGroups = useMemo(() => {
    const groups = new Map<string, RecoMarker[]>();
    for (const m of markers) {
      const d = panamaDate(m.done_at);
      groups.set(d, [...(groups.get(d) ?? []), m]);
    }
    return groups;
  }, [markers]);

  const selectMarker = (date: string) => {
    setSelectedDate((prev) => (prev === date ? null : date));
    setSelectedIdx(0);
  };

  // Пиксельная позиция засечки на каждом графике — своя (серии могут отличаться диапазоном).
  const renderMarkers = (seriesDates: string[], yAxisId?: string) =>
    [...markerGroups.entries()].map(([date, group]) => {
      const snapped = snapToSeries(date, seriesDates);
      if (!snapped) return null;
      return (
        <ReferenceLine
          key={date}
          x={snapped}
          {...(yAxisId ? { yAxisId } : {})}
          stroke={CHART.marker}
          strokeDasharray="4 3"
          label={
            <MarkerGlyph
              count={group.length}
              active={selectedDate === date}
              onSelect={() => selectMarker(date)}
            />
          }
        />
      );
    });

  const selectedGroup = selectedDate
    ? (markerGroups.get(selectedDate) ?? [])
    : [];
  const selectedReco = selectedGroup[selectedIdx] ?? selectedGroup[0] ?? null;
  const gscTrends = selectedDate
    ? {
        clicks: trendAround(data.gsc.series, "clicks", selectedDate),
        impressions: trendAround(data.gsc.series, "impressions", selectedDate),
        sessions: trendAround(data.ga4.series, "sessions", selectedDate),
      }
    : null;

  const fmtTrend = (label: string, t: ReturnType<typeof trendAround>) => {
    if (!t) return `${label}: пока недостаточно данных после внедрения`;
    const delta =
      t.before === 0
        ? t.after > 0
          ? "рост с нуля"
          : "0%"
        : `${t.after >= t.before ? "+" : ""}${(((t.after - t.before) / t.before) * 100).toFixed(0)}%`;
    return `${label}: ${t.before.toFixed(1)}/д → ${t.after.toFixed(1)}/д (${delta})`;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Клики (GSC, 7д)"
          value={String(data.gsc.clicksCurr)}
          delta={`${pct(data.gsc.clicksCurr, data.gsc.clicksPrev)} к пред.`}
          good={data.gsc.clicksCurr >= data.gsc.clicksPrev}
        />
        <Kpi
          label="Органические сессии (7д)"
          value={String(data.ga4.sessionsCurr)}
          delta={`${pct(data.ga4.sessionsCurr, data.ga4.sessionsPrev)} к пред.`}
          good={data.ga4.sessionsCurr >= data.ga4.sessionsPrev}
        />
        <Kpi
          label="Цитирование в ИИ"
          value={citedRate == null ? "—" : `${citedRate}%`}
          delta={`${data.aiMentions.citedCurr}/${data.aiMentions.totalCurr} запросов`}
          good={data.aiMentions.citedCurr >= data.aiMentions.citedPrev}
        />
        <Kpi
          label="Расходы DataForSEO (8д)"
          value={`$${data.weeklyCost.toFixed(2)}`}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">
              Клики и показы (GSC)
            </h3>
          </CardHeader>
          <CardContent>
            {data.gsc.series.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={data.gsc.series}
                  margin={{ left: -16, right: -16, top: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  {/* Две шкалы: клики (единицы) иначе вжимаются в ось шкалой показов (сотни).
                      Подписи каждой оси окрашены в цвет своей серии, а сторона продублирована
                      в легенде — иначе непонятно, какая линия к какой шкале относится.
                      Важно: при разных шкалах точки пересечения линий физического смысла не имеют. */}
                  <YAxis
                    yAxisId="clicks"
                    tick={{ fontSize: 10, fill: CHART.green }}
                    allowDecimals={false}
                  />
                  <YAxis
                    yAxisId="impressions"
                    orientation="right"
                    tick={{ fontSize: 10, fill: CHART.indigo }}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    height={24}
                    iconType="plainline"
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Line
                    yAxisId="clicks"
                    type="monotone"
                    dataKey="clicks"
                    stroke={CHART.green}
                    strokeWidth={2}
                    dot={false}
                    name="Клики (шкала слева)"
                  />
                  <Line
                    yAxisId="impressions"
                    type="monotone"
                    dataKey="impressions"
                    stroke={CHART.indigo}
                    strokeWidth={2}
                    dot={false}
                    name="Показы (шкала справа)"
                  />
                  {renderMarkers(
                    data.gsc.series.map((p) => p.date),
                    "clicks",
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">Пока нет данных.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">
              Органические сессии (GA4)
            </h3>
          </CardHeader>
          <CardContent>
            {data.ga4.series.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={data.ga4.series}
                  margin={{ left: -16, right: 8, top: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(d: string) => d.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke={CHART.green}
                    strokeWidth={2}
                    dot={false}
                    name="Сессии"
                  />
                  {renderMarkers(data.ga4.series.map((p) => p.date))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">Пока нет данных.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {markerGroups.size > 0 && (
        <p className="text-xs text-gray-400 -mt-3">
          ● — внедрённая рекомендация (в пределах окна графиков). Нажмите на
          засечку, чтобы увидеть динамику.
        </p>
      )}

      {/* Detail card for the selected marker */}
      {selectedReco && selectedDate && (
        <Card className="border-amber-300">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-gray-400">
                Внедрено {selectedDate} · {selectedReco.category}
              </div>
              {selectedGroup.length > 1 ? (
                <select
                  value={selectedIdx}
                  onChange={(e) => setSelectedIdx(Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm font-medium"
                >
                  {selectedGroup.map((m, i) => (
                    <option key={m.id} value={i}>
                      {m.title}
                    </option>
                  ))}
                </select>
              ) : (
                <h3 className="mt-1 font-semibold text-sm text-[#1e3a5f]">
                  {selectedReco.title}
                </h3>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600 text-sm shrink-0"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedReco.resolution && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap border-l-2 border-green-300 pl-2">
                {selectedReco.resolution}
              </p>
            )}
            <div className="text-sm space-y-1">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Динамика: среднее 7 дней до → 7 дней после
              </div>
              <p>{fmtTrend("Клики (GSC)", gscTrends?.clicks ?? null)}</p>
              <p>{fmtTrend("Показы (GSC)", gscTrends?.impressions ?? null)}</p>
              <p>{fmtTrend("Сессии (GA4)", gscTrends?.sessions ?? null)}</p>
            </div>
            <p className="text-xs text-gray-400">
              Это корреляция, а не доказанное влияние: SEO-эффект запаздывает на
              дни и недели, данные GSC приходят с лагом ~2 дня, на цифры влияют
              сезонность и другие изменения.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rankings table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-[#1e3a5f]">
            Позиции в выдаче (DataForSEO)
          </h3>
        </CardHeader>
        <CardContent>
          {data.rankings.rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">Запрос</th>
                    <th className="py-2 px-2">Текущая</th>
                    <th className="py-2 px-2">Пред.</th>
                    <th className="py-2 px-2">Объём</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rankings.rows.slice(0, 15).map((r) => {
                    const improved =
                      r.position != null &&
                      r.prevPosition != null &&
                      r.position < r.prevPosition;
                    const worse =
                      r.position != null &&
                      r.prevPosition != null &&
                      r.position > r.prevPosition;
                    return (
                      <tr key={r.keyword} className="border-b last:border-0">
                        <td className="py-2 pr-4">{r.keyword}</td>
                        <td
                          className={`py-2 px-2 font-medium ${improved ? "text-green-600" : worse ? "text-red-600" : ""}`}
                        >
                          {r.position ?? ">20"}
                        </td>
                        <td className="py-2 px-2 text-gray-500">
                          {r.prevPosition ?? "—"}
                        </td>
                        <td className="py-2 px-2 text-gray-500">
                          {r.searchVolume ?? "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Пока нет данных о позициях.</p>
          )}
        </CardContent>
      </Card>

      {/* CWV + backlinks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">
              Core Web Vitals (поле)
            </h3>
          </CardHeader>
          <CardContent>
            {data.cwv.breaches.length ? (
              <ul className="space-y-1 text-sm">
                {data.cwv.breaches.map((b) => (
                  <li key={b.url} className="text-red-600">
                    🔴 {b.url} — LCP {b.lcp ?? "—"}ms · INP {b.inp ?? "—"}ms ·
                    CLS {b.cls?.toFixed(2) ?? "—"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600">✅ Нарушений CWV нет.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">Бэклинки</h3>
          </CardHeader>
          <CardContent>
            {data.backlinks.snapshot ? (
              <ul className="text-sm space-y-1">
                <li>
                  Ссылающиеся домены:{" "}
                  <b>
                    {String(data.backlinks.snapshot.referring_domains ?? "—")}
                  </b>
                </li>
                <li>
                  Бэклинки:{" "}
                  <b>{String(data.backlinks.snapshot.backlinks ?? "—")}</b>
                </li>
                <li>Ранг: {String(data.backlinks.snapshot.rank ?? "—")}</li>
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Пока нет данных о бэклинках.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
