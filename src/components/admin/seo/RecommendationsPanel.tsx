"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, CheckCheck, RefreshCw } from "lucide-react";

export type Reco = {
  id: number;
  category: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  status: "new" | "accepted" | "rejected" | "done";
  created_at: string;
};

type AuthFetch = (path: string, init?: RequestInit) => Promise<Response>;

const SEV_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
};

const SEV_LABEL: Record<string, string> = {
  critical: "критично",
  warning: "предупреждение",
  info: "инфо",
};

export function RecommendationsPanel({ authFetch, reloadKey = 0 }: { authFetch: AuthFetch; reloadKey?: number }) {
  const [recos, setRecos] = useState<Reco[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/admin/seo/recommendations?status=new");
      const data = (await res.json().catch(() => ({}))) as { recommendations?: Reco[] };
      setRecos(data.recommendations ?? []);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    load();
  }, [load, reloadKey]);

  const setStatus = async (id: number, status: Reco["status"]) => {
    setRecos((prev) => prev.filter((r) => r.id !== id)); // optimistic remove from the "new" list
    await authFetch("/api/admin/seo/recommendations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="font-semibold text-[#1e3a5f]">Рекомендации агента</h3>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Загрузка…</p>
        ) : recos.length === 0 ? (
          <p className="text-sm text-gray-500">Новых рекомендаций нет. Нажмите «Запросить анализ агента» выше.</p>
        ) : (
          <ul className="space-y-3">
            {recos.map((r) => (
              <li key={r.id} className="rounded-md border border-input p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${SEV_STYLE[r.severity] ?? SEV_STYLE.info}`}>
                        {SEV_LABEL[r.severity] ?? r.severity}
                      </span>
                      <span className="text-xs text-gray-400">{r.category}</span>
                    </div>
                    <div className="mt-1 font-medium text-sm">{r.title}</div>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{r.detail}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="outline" size="sm" title="Принять" onClick={() => setStatus(r.id, "accepted")}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button variant="outline" size="sm" title="Готово" onClick={() => setStatus(r.id, "done")}>
                      <CheckCheck className="w-4 h-4 text-sky-600" />
                    </Button>
                    <Button variant="outline" size="sm" title="Отклонить" onClick={() => setStatus(r.id, "rejected")}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
