"use client";

import type { SeoAggregate } from "@/lib/seo-aggregate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function pct(curr: number, prev: number): string {
  if (prev === 0) return curr === 0 ? "0%" : "nuevo";
  const d = ((curr - prev) / prev) * 100;
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
}

function Kpi({ label, value, delta, good }: { label: string; value: string; delta?: string; good?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className="mt-1 text-2xl font-bold text-[#1e3a5f]">{value}</div>
        {delta && (
          <div className={`text-sm ${good === undefined ? "text-gray-500" : good ? "text-green-600" : "text-red-600"}`}>{delta}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function MetricsOverview({ data }: { data: SeoAggregate }) {
  const citedRate = data.aiMentions.totalCurr ? Math.round((data.aiMentions.citedCurr / data.aiMentions.totalCurr) * 100) : null;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Clics (GSC, 7d)"
          value={String(data.gsc.clicksCurr)}
          delta={`${pct(data.gsc.clicksCurr, data.gsc.clicksPrev)} vs previa`}
          good={data.gsc.clicksCurr >= data.gsc.clicksPrev}
        />
        <Kpi
          label="Sesiones orgánicas (7d)"
          value={String(data.ga4.sessionsCurr)}
          delta={`${pct(data.ga4.sessionsCurr, data.ga4.sessionsPrev)} vs previa`}
          good={data.ga4.sessionsCurr >= data.ga4.sessionsPrev}
        />
        <Kpi
          label="Citado en IA"
          value={citedRate == null ? "—" : `${citedRate}%`}
          delta={`${data.aiMentions.citedCurr}/${data.aiMentions.totalCurr} consultas`}
          good={data.aiMentions.citedCurr >= data.aiMentions.citedPrev}
        />
        <Kpi label="Gasto DataForSEO (8d)" value={`$${data.weeklyCost.toFixed(2)}`} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">Clics e impresiones (GSC)</h3>
          </CardHeader>
          <CardContent>
            {data.gsc.series.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.gsc.series} margin={{ left: -16, right: 8, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-1))" dot={false} name="Clics" />
                  <Line type="monotone" dataKey="impressions" stroke="hsl(var(--chart-2))" dot={false} name="Impresiones" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">Sin datos todavía.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">Sesiones orgánicas (GA4)</h3>
          </CardHeader>
          <CardContent>
            {data.ga4.series.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.ga4.series} margin={{ left: -16, right: 8, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d: string) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="hsl(var(--chart-3))" dot={false} name="Sesiones" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500">Sin datos todavía.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rankings table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-[#1e3a5f]">Posiciones SERP (DataForSEO)</h3>
        </CardHeader>
        <CardContent>
          {data.rankings.rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2 pr-4">Keyword</th>
                    <th className="py-2 px-2">Actual</th>
                    <th className="py-2 px-2">Previa</th>
                    <th className="py-2 px-2">Vol.</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rankings.rows.slice(0, 15).map((r) => {
                    const improved = r.position != null && r.prevPosition != null && r.position < r.prevPosition;
                    const worse = r.position != null && r.prevPosition != null && r.position > r.prevPosition;
                    return (
                      <tr key={r.keyword} className="border-b last:border-0">
                        <td className="py-2 pr-4">{r.keyword}</td>
                        <td className={`py-2 px-2 font-medium ${improved ? "text-green-600" : worse ? "text-red-600" : ""}`}>
                          {r.position ?? ">20"}
                        </td>
                        <td className="py-2 px-2 text-gray-500">{r.prevPosition ?? "—"}</td>
                        <td className="py-2 px-2 text-gray-500">{r.searchVolume ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin datos de posiciones todavía.</p>
          )}
        </CardContent>
      </Card>

      {/* CWV + backlinks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">Core Web Vitals (campo)</h3>
          </CardHeader>
          <CardContent>
            {data.cwv.breaches.length ? (
              <ul className="space-y-1 text-sm">
                {data.cwv.breaches.map((b) => (
                  <li key={b.url} className="text-red-600">
                    🔴 {b.url} — LCP {b.lcp ?? "—"}ms · INP {b.inp ?? "—"}ms · CLS {b.cls?.toFixed(2) ?? "—"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600">✅ Sin breaches de CWV.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[#1e3a5f]">Backlinks</h3>
          </CardHeader>
          <CardContent>
            {data.backlinks.snapshot ? (
              <ul className="text-sm space-y-1">
                <li>Dominios de referencia: <b>{String(data.backlinks.snapshot.referring_domains ?? "—")}</b></li>
                <li>Backlinks: <b>{String(data.backlinks.snapshot.backlinks ?? "—")}</b></li>
                <li>Rank: {String(data.backlinks.snapshot.rank ?? "—")}</li>
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Sin datos de backlinks todavía.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
