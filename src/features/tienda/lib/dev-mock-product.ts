/**
 * Dev-only fixture: a product that varies along THREE axes — the shape the
 * copper-tubing family takes once the listing bot describes it properly:
 *
 *   tubo         9 values (6 single diameters + 3 pairs)   ← is_size
 *   aislamiento  3 values (3/8" · 1/2" · 3/4")
 *   presentacion 2 values (Rollo 45 m · Corte 15 m)
 *
 * The full grid would be 54 cells; the fixture deliberately leaves some empty
 * (pairs are sold as rolls only, and the thickest insulation is not stocked for
 * the two thinnest tubes) so the picker's greying-out is exercised on more than
 * one axis at a time.
 *
 * The production catalog has no such product yet, so the multi-axis picker
 * cannot be exercised against the live API. Set `TIENDA_MOCK_PRODUCT=1` and open
 * /tienda/product/mock-tuberia-cobre-aislada/ under `next dev` to see it. The
 * loader in ProductPage.tsx refuses to consult this file when NODE_ENV is
 * production, so it can never reach a shopper.
 *
 * The same fixture backs the assertions in scripts/check-tienda.ts, which is why
 * it lives beside the code it exercises rather than in the page.
 */

import type { ProductDetail, ProductVariant } from "./api-client";

export const MOCK_MULTI_AXIS_SLUG = "mock-tuberia-cobre-aislada";

/** Six single diameters, then three pre-made pairs (liquid + suction line). */
export const MOCK_TUBOS = [
  '1/4"',
  '3/8"',
  '1/2"',
  '5/8"',
  '3/4"',
  '7/8"',
  '1/4" + 3/8"',
  '3/8" + 5/8"',
  '1/2" + 7/8"',
];

export const MOCK_AISLAMIENTOS = ['3/8"', '1/2"', '3/4"'];

export const MOCK_PRESENTACIONES = ["Rollo 45 m", "Corte 15 m"];

/** A pre-made pair — sold on the 45 m roll only, never cut. */
function isPair(tubo: string): boolean {
  return tubo.includes("+");
}

/** The two thinnest tubes are not stocked with the thickest insulation. */
const THIN_TUBOS = new Set(MOCK_TUBOS.slice(0, 2));
const THICKEST_AISLAMIENTO = MOCK_AISLAMIENTOS[MOCK_AISLAMIENTOS.length - 1];

/** True when this cell of the 9 x 3 x 2 grid is not stocked. */
export function mockCellMissing(tubo: string, aislamiento: string, presentacion: string): boolean {
  if (isPair(tubo) && presentacion === "Corte 15 m") return true;
  if (THIN_TUBOS.has(tubo) && aislamiento === THICKEST_AISLAMIENTO) return true;
  return false;
}

function buildVariants(): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let sort = 0;
  MOCK_TUBOS.forEach((tubo, ti) => {
    MOCK_AISLAMIENTOS.forEach((aislamiento, ai) => {
      for (const presentacion of MOCK_PRESENTACIONES) {
        if (mockCellMissing(tubo, aislamiento, presentacion)) continue;
        const rollo = presentacion === "Rollo 45 m";
        const base = 120 + ti * 18 + ai * 7;
        variants.push({
          id: `mock-v${sort}`,
          label_es: `${tubo} · ${aislamiento} · ${presentacion}`,
          sku_suffix: `${ti + 1}-${ai + 1}-${rollo ? "R45" : "C15"}`,
          price: (rollo ? base : base / 2.6).toFixed(2),
          is_default: sort === 0,
          sort_order: sort,
          options: { tubo, aislamiento, presentacion },
        });
        sort += 1;
      }
    });
  });
  return variants;
}

/** The fixture itself — a full ProductDetail the page can render unchanged. */
export function mockMultiAxisProduct(): ProductDetail {
  return {
    id: "mock-product",
    sku: "TUB-AISL",
    slug: MOCK_MULTI_AXIS_SLUG,
    name: "Tubería de cobre aislada para mini split",
    short_description:
      "Tubería de cobre con aislamiento, lista para instalar. Elige el tubo, el aislamiento y la presentación.",
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
        key: "tubo",
        label_es: "Tubo",
        label_en: "Tube",
        label_ru: "Труба",
        values: MOCK_TUBOS,
        is_size: true,
      },
      {
        key: "aislamiento",
        label_es: "Aislamiento",
        label_en: "Insulation",
        label_ru: "Изоляция",
        values: MOCK_AISLAMIENTOS,
      },
      {
        key: "presentacion",
        label_es: "Presentación",
        label_en: "Presentation",
        label_ru: "Форма поставки",
        values: MOCK_PRESENTACIONES,
      },
    ],
    copy_source: "ai",
    description:
      "Tubería de cobre aislada para líneas de refrigerante de equipos mini split. Aislamiento de espuma elastomérica de 9 mm.",
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
