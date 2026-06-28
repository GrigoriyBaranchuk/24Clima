"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { SeoAggregate } from "@/lib/seo-aggregate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogOut, RefreshCw, Sparkles, Database } from "lucide-react";
import { MetricsOverview } from "@/components/admin/seo/MetricsOverview";
import { RecommendationsPanel } from "@/components/admin/seo/RecommendationsPanel";
import { ChatPanel } from "@/components/admin/seo/ChatPanel";

export default function SeoAdminClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [metrics, setMetrics] = useState<SeoAggregate | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [recoKey, setRecoKey] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const token = session?.access_token;

  const authFetch = useCallback(
    (path: string, init?: RequestInit) =>
      fetch(path, { ...init, headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token ?? ""}` } }),
    [token]
  );

  const loadMetrics = useCallback(async () => {
    if (!token) return;
    setMetricsLoading(true);
    try {
      const res = await authFetch("/api/admin/seo/metrics");
      if (res.ok) setMetrics((await res.json()) as SeoAggregate);
    } finally {
      setMetricsLoading(false);
    }
  }, [authFetch, token]);

  useEffect(() => {
    if (token) loadMetrics();
  }, [token, loadMetrics]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const runSync = async (source: "google" | "dataforseo") => {
    setBusy(source);
    setToast("");
    try {
      const res = await authFetch("/api/admin/seo/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      setToast(data.ok ? `Данные обновлены (${source}).` : `Ошибка: ${data.error ?? res.status}`);
      await loadMetrics();
    } finally {
      setBusy(null);
    }
  };

  const runAnalyze = async () => {
    setBusy("analyze");
    setToast("");
    try {
      const res = await authFetch("/api/admin/seo/analyze", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; inserted?: number; error?: string };
      setToast(data.ok ? `Анализ готов: ${data.inserted ?? 0} рекомендаций.` : `Ошибка: ${data.error ?? res.status}`);
      setRecoKey((k) => k + 1);
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Загрузка…</div>
      </div>
    );
  }

  if (!supabase || !session) {
    return (
      <main id="main-content" className="min-h-screen pt-24 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">SEO · Панель</h1>
          </CardHeader>
          <CardContent>
            {!supabase ? (
              <p className="text-gray-600 text-center text-sm">Supabase не настроен.</p>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
                <Button type="submit" className="w-full">Войти</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    );
  }

  const staleSources = metrics?.syncHealth.filter((s) => s.stale).map((s) => s.source) ?? [];

  return (
    <main id="main-content" className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1e3a5f]">SEO · Панель агента</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Выйти
          </Button>
        </div>

        {/* Triggers + health */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => runSync("google")} disabled={busy !== null}>
                <Database className={`w-4 h-4 mr-2 ${busy === "google" ? "animate-pulse" : ""}`} /> Обновить Google
              </Button>
              <Button onClick={() => runSync("dataforseo")} disabled={busy !== null}>
                <Database className={`w-4 h-4 mr-2 ${busy === "dataforseo" ? "animate-pulse" : ""}`} /> Обновить DataForSEO
              </Button>
              <Button variant="secondary" onClick={runAnalyze} disabled={busy !== null}>
                <Sparkles className={`w-4 h-4 mr-2 ${busy === "analyze" ? "animate-pulse" : ""}`} /> Запросить анализ агента
              </Button>
              <Button variant="outline" size="sm" onClick={loadMetrics} disabled={metricsLoading}>
                <RefreshCw className={`w-4 h-4 ${metricsLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {toast && <p className="mt-3 text-sm text-gray-600">{toast}</p>}
            {staleSources.length > 0 && (
              <p className="mt-2 text-sm text-amber-600">⚠️ Источники с устаревшими/неуспешными данными: {staleSources.join(", ")}</p>
            )}
          </CardContent>
        </Card>

        {metrics ? <MetricsOverview data={metrics} /> : <p className="text-sm text-gray-500">Загрузка метрик…</p>}

        <RecommendationsPanel authFetch={authFetch} reloadKey={recoKey} />
        <ChatPanel authFetch={authFetch} />
      </div>
    </main>
  );
}
