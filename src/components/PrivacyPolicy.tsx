import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getLocalePrefix, type Locale } from "@/i18n/config";

const BASE = "https://24clima.com";

const DATA_KEYS = ["dataOrder", "dataContact", "dataTechnical"] as const;

const COOKIE_KEYS = [
  "cookiesGa",
  "cookiesMeta",
  "cookiesYandex",
  "cookiesGcr",
] as const;

const OPT_OUT_LINKS = [
  { key: "optOutGoogleAds", href: "https://myadcenter.google.com/" },
  { key: "optOutGa", href: "https://tools.google.com/dlpage/gaoptout" },
  { key: "optOutMeta", href: "https://www.facebook.com/adpreferences" },
  {
    key: "optOutYandex",
    href: "https://yandex.com/support/metrica/general/opt-out.html",
  },
] as const;

const TEXT_SECTIONS = [
  { title: "gcrTitle", body: "gcrText" },
  { title: "sharingTitle", body: "sharingText" },
  { title: "securityTitle", body: "securityText" },
  { title: "retentionTitle", body: "retentionText" },
  { title: "rightsTitle", body: "rightsText" },
  { title: "contactTitle", body: "contactText" },
  { title: "changesTitle", body: "changesText" },
] as const;

export async function generatePrivacyMetadata(
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "privacy" });
  const prefix = getLocalePrefix(locale as Locale);

  return {
    metadataBase: new URL(BASE),
    title: `${t("title")} | 24clima`,
    description: t("metaDescription"),
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${BASE}${prefix}/privacidad/`,
      languages: {
        "x-default": `${BASE}/privacidad/`,
        es: `${BASE}/privacidad/`,
        en: `${BASE}/en/privacidad/`,
        ru: `${BASE}/ru/privacidad/`,
      },
    },
  };
}

export async function PrivacyPolicy({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("updated")}</p>
        <p className="mt-4 text-lg text-muted-foreground">{t("intro")}</p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">
            {t("dataTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("dataIntro")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            {DATA_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">
            {t("cookiesTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("cookiesIntro")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            {COOKIE_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <p className="mt-4 text-muted-foreground">{t("cookiesNote")}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">
            {t("optOutTitle")}
          </h2>
          <p className="mt-3 text-muted-foreground">{t("optOutIntro")}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            {OPT_OUT_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted-foreground">{t("optOutBrowser")}</p>
        </section>

        {TEXT_SECTIONS.map(({ title, body }) => (
          <section key={title} className="mt-8">
            <h2 className="text-xl font-semibold text-foreground">
              {t(title)}
            </h2>
            <p className="mt-3 text-muted-foreground">{t(body)}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
