"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, CheckCheck, RefreshCw, Undo2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type Reco = {
  id: number;
  category: string;
  severity: "critical" | "warning" | "info";
  title: string;
  detail: string;
  status: "new" | "accepted" | "rejected" | "done";
  resolution: string;
  done_at: string | null;
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

type Tab = "new" | "accepted" | "done";

const TABS: { key: Tab; label: string }[] = [
  { key: "new", label: "Новые" },
  { key: "accepted", label: "Принятые" },
  { key: "done", label: "Готово" },
];

export function RecommendationsPanel({
  authFetch,
  reloadKey = 0,
  onStatusChange,
}: {
  authFetch: AuthFetch;
  reloadKey?: number;
  onStatusChange?: () => void;
}) {
  const [tab, setTab] = useState<Tab>("new");
  const [recos, setRecos] = useState<Reco[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        `/api/admin/seo/recommendations?status=${tab}`,
      );
      const data = (await res.json().catch(() => ({}))) as {
        recommendations?: Reco[];
      };
      setRecos(data.recommendations ?? []);
    } finally {
      setLoading(false);
    }
  }, [authFetch, tab]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reloadKey — внешний триггер перезагрузки (родитель бампает после анализа)
  useEffect(() => {
    load();
  }, [load, reloadKey]);

  const setStatus = async (id: number, status: Reco["status"]) => {
    setRecos((prev) => prev.filter((r) => r.id !== id)); // optimistic remove from the current tab
    await authFetch("/api/admin/seo/recommendations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    onStatusChange?.();
  };

  const EMPTY_TEXT: Record<Tab, string> = {
    new: "Новых рекомендаций нет. Нажмите «Запросить анализ агента» выше.",
    accepted:
      "Нет принятых рекомендаций в работе. Принятые задачи забираются в терминале командой /seo-tasks.",
    done: "Выполненных рекомендаций пока нет.",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-[#1e3a5f]">Рекомендации агента</h3>
          <div className="flex rounded-md border border-input overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3 py-1 text-xs transition-colors ${
                  tab === t.key
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-gray-500">Загрузка…</p>
        ) : recos.length === 0 ? (
          <p className="text-sm text-gray-500">{EMPTY_TEXT[tab]}</p>
        ) : (
          <ul className="space-y-3">
            {recos.map((r) => (
              <li key={r.id} className="rounded-md border border-input p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${SEV_STYLE[r.severity] ?? SEV_STYLE.info}`}
                      >
                        {SEV_LABEL[r.severity] ?? r.severity}
                      </span>
                      <span className="text-xs text-gray-400">
                        {r.category}
                      </span>
                      {tab === "done" && r.done_at && (
                        <span className="text-xs text-gray-400">
                          выполнено {r.done_at.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-medium text-sm">{r.title}</div>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                      {r.detail}
                    </p>
                    {tab === "done" && r.resolution && (
                      <p className="mt-2 text-sm text-green-700 whitespace-pre-wrap border-l-2 border-green-300 pl-2">
                        {r.resolution}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {tab === "new" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Принять (в работу через /seo-tasks)"
                          onClick={() => setStatus(r.id, "accepted")}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Готово"
                          onClick={() => setStatus(r.id, "done")}
                        >
                          <CheckCheck className="w-4 h-4 text-sky-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Отклонить"
                          onClick={() => setStatus(r.id, "rejected")}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    {tab === "accepted" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Готово"
                          onClick={() => setStatus(r.id, "done")}
                        >
                          <CheckCheck className="w-4 h-4 text-sky-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          title="Отклонить"
                          onClick={() => setStatus(r.id, "rejected")}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    {tab === "done" && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Вернуть в работу"
                        onClick={() => setStatus(r.id, "accepted")}
                      >
                        <Undo2 className="w-4 h-4 text-gray-600" />
                      </Button>
                    )}
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
