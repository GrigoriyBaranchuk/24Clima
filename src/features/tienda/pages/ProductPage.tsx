import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api, ApiError } from "../lib/api-client";
import { ProductPageContent } from "../components/product/ProductPageContent";
import { ProductJsonLd } from "../components/seo/ProductJsonLd";
import { TiendaShell } from "../components/TiendaShell";
import { BASE, tiendaProductUrl, tiendaLangAlternates } from "../lib/tienda-url";

export async function generateTiendaProductMetadata(locale: string, slug: string): Promise<Metadata> {
  try {
    const p = await api.getProductCached(slug, locale);
    const mainImage = p.images?.[0]?.url;
    return {
      metadataBase: new URL(BASE),
      title: p.meta_title || p.name + " | 24Clima Shop",
      description: p.meta_description || p.short_description || p.name,
      robots: { index: true, follow: true },
      alternates: {
        canonical: tiendaProductUrl(locale, slug),
        languages: tiendaLangAlternates(`/product/${slug}`),
      },
      openGraph: {
        title: p.name,
        description: p.short_description || p.name,
        url: tiendaProductUrl(locale, slug),
        type: "website",
        ...(mainImage ? { images: [{ url: mainImage }] } : {}),
      },
    };
  } catch {
    return { title: "Producto | 24Clima Shop" };
  }
}

export async function TiendaProductPage({ locale, slug }: { locale: string; slug: string }) {
  const t = await getTranslations({ locale, namespace: "tienda.product" });
  const tBadge = await getTranslations({ locale, namespace: "tienda.badge" });
  const tCommon = await getTranslations({ locale, namespace: "tienda.common" });
  let product;
  try {
    product = await api.getProductCached(slug, locale);
  } catch (e) {
    // Only a real API 404 means "no such product". Anything else (API down, bad
    // env, 5xx) must surface as an error, not silently render as a 404 page.
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
  if (!product) notFound();
  const whatsappNumber = "50768282120";
  const whatsappOrderText = t("askWhatsAppMessage", { name: product.name, sku: product.sku });

  return (
    <TiendaShell>
      <ProductJsonLd product={product} locale={locale} homeLabel={tCommon("home")} />
      <ProductPageContent
        product={product}
        addToCartLabel={t("addToCart")}
        askWhatsAppLabel={t("askWhatsApp")}
        descriptionLabel={t("description")}
        specsTitle={t("specsTitle")}
        faqTitle={t("faqTitle")}
        professionalLabel={tBadge("professional")}
        whatsappNumber={whatsappNumber}
        whatsappOrderText={whatsappOrderText}
      />
    </TiendaShell>
  );
}
