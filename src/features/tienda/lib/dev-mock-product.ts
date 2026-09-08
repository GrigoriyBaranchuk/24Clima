/**
 * Dev-only fixture: a product that varies along TWO axes (16 diameters ×
 * 2 presentations, with two combinations deliberately missing).
 *
 * The production catalog has no such product yet, so the two-axis picker cannot
 * be exercised against the live API. Set `TIENDA_MOCK_PRODUCT=1` and open
 * /tienda/product/mock-tuberia-cobre-aislada/ under `next dev` to see it. The
 * loader in ProductPage.tsx refuses to consult this file when NODE_ENV is
 * production, so it can never reach a shopper.
 *
 * The same fixture backs the assertions in scripts/check-tienda.ts, which is why
 * it lives beside the code it exercises rather than in the page.
 */

import type { ProductDetail, ProductVariant } from "./api-client";

export const MOCK_TWO_AXIS_SLUG = "mock-tuberia-cobre-aislada";

const DIAMETERS = [
  '1/4" × 3/8"',
  '1/4" × 1/2"',
  '1/4" × 5/8"',
  '1/4" × 3/4"',
  '3/8" × 1/2"',
  '3/8" × 5/8"',
  '3/8" × 3/4"',
  '3/8" × 7/8"',
  '1/2" × 5/8"',
  '1/2" × 3/4"',
  '1/2" × 7/8"',
  '1/2" × 1 1/8"',
  '5/8" × 7/8"',
  '5/8" × 1 1/8"',
  '3/4" × 1 1/8"',
  '3/4" × 1 3/8"',
];

const PRESENTATIONS = ["Rollo 45 m", "Corte 15 m"];

/** The two widest diameters are stocked as rolls only — the picker must grey out the cut. */
const ROLL_ONLY = new Set(DIAMETERS.slice(-2));

function buildVariants(): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let sort = 0;
  DIAMETERS.forEach((diametro, di) => {
    for (const presentacion of PRESENTATIONS) {
      if (presentacion === "Corte 15 m" && ROLL_ONLY.has(diametro)) continue;
      const rollo = presentacion === "Rollo 45 m";
      const base = 120 + di * 18;
      variants.push({
        id: `mock-v${sort}`,
        label_es: `${diametro} · ${presentacion}`,
        sku_suffix: `${di + 1}-${rollo ? "R45" : "C15"}`,
        price: (rollo ? base : base / 2.6).toFixed(2),
        is_default: sort === 0,
        sort_order: sort,
        options: { diametro, presentacion },
      });
      sort += 1;
    }
  });
  return variants;
}

/** The fixture itself — a full ProductDetail the page can render unchanged. */
export function mockTwoAxisProduct(): ProductDetail {
  return {
    id: "mock-product",
    sku: "TUB-AISL",
    slug: MOCK_TWO_AXIS_SLUG,
    name: "Tubería de cobre aislada para mini split",
    short_description:
      "Par de tuberías de cobre con aislamiento, listas para instalar. Elige el diámetro y la presentación.",
    status: "active",
    is_b2b_only: false,
    price: "120.00",
    // A local asset: the fixture must render under `next dev` without adding a
    // remote host to next.config.js.
    image_url: "/images/logo.svg",
    brand: { id: "mock-brand", name: "PROTEKTOR", slug: "protektor", logo_url: null },
    category: {
      id: "mock-cat",
      name: "Tubería y aislamiento",
      slug: "tuberia-y-aislamiento",
      description: null,
      image_url: null,
      sort_order: 0,
      parent_id: null,
    },
    btu: null,
    variants: buildVariants(),
    variant_axes: [
      {
        key: "diametro",
        label_es: "Diámetro",
        label_en: "Diameter",
        label_ru: "Диаметр",
        values: DIAMETERS,
      },
      {
        key: "presentacion",
        label_es: "Presentación",
        label_en: "Presentation",
        label_ru: "Форма поставки",
        values: PRESENTATIONS,
      },
    ],
    copy_source: "ai",
    description:
      "Tubería de cobre aislada en pares, para líneas de refrigerante de equipos mini split. Aislamiento de espuma elastomérica de 9 mm.",
    warranty_months: 12,
    meta_title: null,
    meta_description: null,
    images: [
      {
        id: "mock-img-1",
        url: "/images/logo.svg",
        alt: "Rollo de tubería de cobre aislada",
        sort_order: 0,
        kind: "official",
      },
      // A generated card: shown in the gallery, never submitted to Merchant.
      {
        id: "mock-img-2",
        url: "/images/logo.svg",
        alt: "Tarjeta generada",
        sort_order: 1,
        kind: "card_main",
      },
    ],
    attributes: [],
    moq: 1,
    pack_size: 1,
  };
}
