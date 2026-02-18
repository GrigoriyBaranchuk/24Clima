"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabase";
import { normalizeSlug } from "@/lib/slug";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogOut, Save, Trash2, Pencil } from "lucide-react";

const BUCKET = "article-images";

type ArticleRow = { slug: string; title_es: string | null; title_ru: string | null };

export default function TipsAdminPage() {
  const t = useTranslations("tipsAdmin");
  const router = useRouter();
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [slug, setSlug] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [titleEs, setTitleEs] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [contentEs, setContentEs] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

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

  const fetchArticles = useCallback(async () => {
    if (!supabase || !session) return;
    setArticlesLoading(true);
    try {
      const { data } = await supabase
        .from("articles")
        .select("slug, title_es, title_ru")
        .order("updated_at", { ascending: false });
      setArticles((data ?? []) as ArticleRow[]);
    } finally {
      setArticlesLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const handleSave = async () => {
    if (!slug.trim() || !titleRu.trim() || !contentRu.trim()) {
      setSaveMessage(t("error"));
      return;
    }
    setSaveLoading(true);
    setSaveMessage("");
    try {
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase.from("articles").upsert(
        {
          slug: normalizeSlug(slug),
          title_ru: titleRu,
          title_es: titleEs || null,
          title_en: titleEn || null,
          content_ru: contentRu,
          content_es: contentEs || null,
          content_en: contentEn || null,
          image_urls: imageUrls,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );
      if (error) throw error;
      setSaveMessage(t("saved"));
      fetchArticles();
    } catch {
      setSaveMessage(t("error"));
    }
    setSaveLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session || !supabase) return;
    const name = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET).upload(name, file, { upsert: true });
    if (error) return;
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    setImageUrls((prev) => [...prev, pub.publicUrl]);
  };

  const handleDelete = async (articleSlug: string) => {
    if (!supabase || !confirm(t("deleteConfirm"))) return;
    setDeletingSlug(articleSlug);
    try {
      const { error } = await supabase.from("articles").delete().eq("slug", articleSlug);
      if (error) throw error;
      setArticles((prev) => prev.filter((a) => a.slug !== articleSlug));
      setSaveMessage(t("deleted"));
    } catch {
      setSaveMessage(t("error"));
    } finally {
      setDeletingSlug(null);
    }
  };

  const loadArticle = async (articleSlug: string) => {
    if (!supabase) return;
    const { data } = await supabase.from("articles").select("slug, title_ru, title_es, title_en, content_ru, content_es, content_en, image_urls").eq("slug", articleSlug).single();
    if (data) {
      setSlug(data.slug ?? "");
      setTitleRu(data.title_ru ?? "");
      setTitleEs(data.title_es ?? "");
      setTitleEn(data.title_en ?? "");
      setContentRu(data.content_ru ?? "");
      setContentEs(data.content_es ?? "");
      setContentEn(data.content_en ?? "");
      setImageUrls((data.image_urls as string[]) ?? []);
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <p className="text-gray-600 text-center">
                Supabase не настроен. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в переменные окружения. См. docs/SETUP_TIPS_ADMIN.md
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("title")}</h1>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("password")}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {t("login")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#1e3a5f]">{t("title")}</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
          {articles.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-semibold text-[#1e3a5f]">{t("existingArticles")}</h2>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <p className="text-sm text-gray-500">{t("loading")}</p>
                ) : (
                  <ul className="space-y-2">
                    {articles.map((a) => (
                      <li
                        key={a.slug}
                        className="flex items-center justify-between gap-4 rounded-md border border-input bg-muted/50 px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => loadArticle(a.slug)}
                          className="min-w-0 flex-1 text-left text-sm hover:underline"
                        >
                          <span className="font-medium">{a.title_ru || a.title_es || a.slug}</span>
                          <span className="ml-2 text-gray-500">/{a.slug}</span>
                        </button>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadArticle(a.slug)}
                            title={t("edit")}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(a.slug)}
                            disabled={deletingSlug === a.slug}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
          <Card ref={formCardRef}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("slug")}</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="como-elegir-condicionador"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleTitle")}</label>
                <input
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder="Как выбрать кондиционер в комнату"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleTitleEs")}</label>
                <input
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  placeholder="Cómo elegir un acondicionador de aire"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleTitleEn")}</label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="How to choose an air conditioner"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleContent")}</label>
                <textarea
                  value={contentRu}
                  onChange={(e) => setContentRu(e.target.value)}
                  placeholder="Текст статьи на русском. Можно использовать HTML: <p>, <h2>, <ul>, <li>, <img src='url'> и т.д."
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleContentEs")}</label>
                <textarea
                  value={contentEs}
                  onChange={(e) => setContentEs(e.target.value)}
                  placeholder="Contenido en español (opcional)"
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("articleContentEn")}</label>
                <textarea
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  placeholder="Content in English (optional)"
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("addImage")}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm"
                />
                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="relative w-24 h-24">
                        <img src={url} alt="" className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <Button onClick={handleSave} disabled={saveLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {t("save")}
                </Button>
              </div>
              {saveMessage && <p className="text-sm text-gray-600">{saveMessage}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
