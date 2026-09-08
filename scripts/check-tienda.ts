/**
 * Assertions for the pure tienda logic that has no other guard: which variant a
 * pair of axes resolves to, what a Merchant feed row looks like, and the robots
 * / hreflang rules for the shop.
 *
 * The repo has no test runner (and adding one would mean a new toolchain in a
 * project whose CI is just lint + Vercel build), so this is a plain script:
 *   bun run check:feed
 * It exits non-zero on the first failed assertion.
 */

import assert from "node:assert/strict";
import type { ProductDetail, ProductVariant } from "@/features/tienda/lib/api-client";
import { MOCK_TWO_AXIS_SLUG, mockTwoAxisProduct } from "@/features/tienda/lib/dev-mock-product";
import { buildFeedItems, feedImages } from "@/features/tienda/lib/merchant-feed";
import { tiendaLangAlternates, tiendaRobots } from "@/features/tienda/lib/tienda-url";
import {
  availableValues,
  axisLabel,
  reconcileSelection,
  resolveVariant,
  selectionFromVariant,
  sortVariants,
  usableAxes,
  variantOptions,
} from "@/features/tienda/lib/variants";

let checks = 0;
function check(name: string, fn: () => void) {
  fn();
  checks += 1;
  console.log(`  ok  ${name}`);
}

/** Everything inside one XML tag, e.g. tagValue(item, "g:id"). */
function tagValue(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? m[1] : null;
}
function tagValues(xml: string, name: string): string[] {
  return [...xml.matchAll(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`, "g"))].map((m) => m[1]);
}

// ---------------------------------------------------------------- variants

const product = mockTwoAxisProduct();
const variants = sortVariants(product.variants);
const axes = usableAxes(product.variant_axes, variants);
const DIAMETERS = product.variant_axes?.[0].values ?? [];
const FIRST_D = DIAMETERS[0];
const ROLL_ONLY_D = DIAMETERS[DIAMETERS.length - 1];

console.log("variants (two axes)");

check("fixture is the 16 x 2 grid minus the two roll-only cuts", () => {
  assert.equal(product.slug, MOCK_TWO_AXIS_SLUG);
  assert.equal(DIAMETERS.length, 16);
  assert.equal(variants.length, 30);
  assert.equal(axes.length, 2);
});

check("usableAxes ignores axes the variants do not carry", () => {
  const stripped: ProductVariant[] = variants.map((v) => ({ ...v, options: null }));
  assert.deepEqual(usableAxes(product.variant_axes, stripped), []);
  assert.deepEqual(usableAxes(null, variants), []);
  assert.deepEqual(usableAxes(product.variant_axes, []), []);
});

check("axisLabel falls back to Spanish", () => {
  assert.equal(axisLabel(axes[0], "es"), "Diámetro");
  assert.equal(axisLabel(axes[0], "en"), "Diameter");
  assert.equal(axisLabel(axes[0], "ru"), "Диаметр");
  assert.equal(axisLabel({ key: "x", label_es: "Eje", values: ["a"] }, "en"), "Eje");
});

check("resolveVariant finds the cell, and null for an empty one", () => {
  const hit = resolveVariant(variants, { diametro: FIRST_D, presentacion: "Corte 15 m" });
  assert.ok(hit);
  assert.deepEqual(variantOptions(hit), { diametro: FIRST_D, presentacion: "Corte 15 m" });
  assert.equal(resolveVariant(variants, { diametro: ROLL_ONLY_D, presentacion: "Corte 15 m" }), null);
  assert.equal(resolveVariant(variants, {}), null);
});

check("availableValues greys out only the unreachable combinations", () => {
  const onRollOnly = availableValues(variants, axes, { diametro: ROLL_ONLY_D });
  assert.deepEqual(onRollOnly.presentacion, ["Rollo 45 m"]);
  const onCut = availableValues(variants, axes, { presentacion: "Corte 15 m" });
  assert.equal(onCut.diametro.length, 14);
  assert.ok(!onCut.diametro.includes(ROLL_ONLY_D));
  const onRoll = availableValues(variants, axes, { presentacion: "Rollo 45 m" });
  assert.equal(onRoll.diametro.length, 16);
});

check("switching to a roll-only diameter slides the presentation to the first available", () => {
  const from = { diametro: FIRST_D, presentacion: "Corte 15 m" };
  const next = reconcileSelection(variants, axes, from, "diametro", ROLL_ONLY_D);
  assert.deepEqual(next, { diametro: ROLL_ONLY_D, presentacion: "Rollo 45 m" });
  assert.ok(resolveVariant(variants, next));
});

check("switching keeps a still-valid value on the other axis", () => {
  const from = { diametro: FIRST_D, presentacion: "Corte 15 m" };
  const next = reconcileSelection(variants, axes, from, "diametro", DIAMETERS[3]);
  assert.deepEqual(next, { diametro: DIAMETERS[3], presentacion: "Corte 15 m" });
});

check("selectionFromVariant round-trips through resolveVariant", () => {
  for (const v of variants) {
    assert.equal(resolveVariant(variants, selectionFromVariant(v, axes))?.id, v.id);
  }
});

// ------------------------------------------------------------ merchant feed

console.log("merchant feed");

const aiItems = buildFeedItems(product);

check("a product with variants becomes one row per variant, tied by item_group_id", () => {
  assert.equal(aiItems.length, 30);
  const ids = aiItems.map((i) => tagValue(i, "g:id"));
  assert.equal(new Set(ids).size, 30);
  assert.ok(ids.every((id) => id?.startsWith("TUB-AISL-")));
  for (const item of aiItems) {
    assert.equal(tagValue(item, "g:item_group_id"), "TUB-AISL");
    assert.equal(tagValue(item, "g:mpn"), tagValue(item, "g:id"));
    assert.match(tagValue(item, "g:link") ?? "", /\/tienda\/product\/.+\/\?variant=mock-v\d+$/);
  }
});

check("g:size carries the diameter and the second axis rides in g:product_detail", () => {
  const first = aiItems[0];
  assert.equal(tagValue(first, "g:size"), FIRST_D.replace(/"/g, "&quot;"));
  assert.equal(tagValue(first, "g:section_name"), "Presentación");
  assert.equal(tagValue(first, "g:attribute_name"), "Presentación");
  assert.equal(tagValue(first, "g:attribute_value"), "Rollo 45 m");
  // Exactly one product_detail block: the diameter is g:size, not a detail.
  assert.equal(tagValues(first, "g:attribute_value").length, 1);
});

check("AI copy is declared machine-generated and never sent as g:title", () => {
  for (const item of aiItems) {
    assert.ok(!item.includes("<g:title>"));
    assert.ok(!item.includes("<g:description>"));
    assert.ok(item.includes("<g:structured_title>"));
    assert.ok(item.includes("<g:structured_description>"));
    assert.equal(tagValue(item, "g:digital_source_type"), "trained_algorithmic_media");
  }
  const content = tagValue(aiItems[0], "g:content") ?? "";
  assert.ok(content.startsWith("Tubería de cobre aislada para mini split — "));
  assert.ok(content.length <= 150);
});

check("human copy keeps plain g:title / g:description", () => {
  const human: ProductDetail = { ...product, copy_source: "human" };
  const items = buildFeedItems(human);
  assert.equal(items.length, 30);
  assert.ok(items[0].includes("<g:title>"));
  assert.ok(items[0].includes("<g:description>"));
  assert.ok(!items[0].includes("structured_title"));
});

check("copy with no declared source stays human — old products do not change", () => {
  const legacy: ProductDetail = { ...product };
  legacy.copy_source = undefined;
  assert.ok(buildFeedItems(legacy)[0].includes("<g:title>"));
});

check("generated cards and infographics never reach the feed", () => {
  // The fixture holds two image rows — one photo, one generated card.
  assert.equal((product.images ?? []).length, 2);
  assert.deepEqual(feedImages(product), ["/images/logo.svg"]);
  for (const item of aiItems) {
    assert.equal(tagValue(item, "g:image_link"), "/images/logo.svg");
    assert.ok(!item.includes("additional_image_link"));
  }
  const withInfographic: ProductDetail = {
    ...product,
    images: [
      { id: "a", url: "https://x/a.jpg", alt: null, sort_order: 0, kind: "infographic" },
      { id: "b", url: "https://x/b.jpg", alt: null, sort_order: 1, kind: "card_hero" },
      { id: "c", url: "https://x/c.jpg", alt: null, sort_order: 2, kind: null },
    ],
  };
  assert.deepEqual(feedImages(withInfographic), ["https://x/c.jpg"]);
});

check("a product left with only cards is dropped, loudly", () => {
  const cardsOnly: ProductDetail = {
    ...product,
    images: [{ id: "b", url: "https://x/b.jpg", alt: null, sort_order: 0, kind: "card_main" }],
  };
  const warnings: string[] = [];
  const original = console.warn;
  console.warn = (...args: unknown[]) => void warnings.push(args.join(" "));
  try {
    assert.deepEqual(buildFeedItems(cardsOnly), []);
  } finally {
    console.warn = original;
  }
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /no clean product image/);
});

check("a product without variants is still a single row, with no item_group_id", () => {
  const plain: ProductDetail = {
    ...product,
    name: 'Manómetro "R410A" & vacío',
    sku: "MAN-410",
    variants: [],
    variant_axes: null,
    copy_source: "human",
  };
  const items = buildFeedItems(plain);
  assert.equal(items.length, 1);
  assert.equal(tagValue(items[0], "g:id"), "MAN-410");
  assert.ok(!items[0].includes("item_group_id"));
  assert.ok(!items[0].includes("g:size"));
  assert.equal(tagValue(items[0], "g:price"), "120.00 USD");
  // XML-significant characters in catalog text stay escaped.
  assert.equal(tagValue(items[0], "g:title"), "Manómetro &quot;R410A&quot; &amp; vacío");
});

check("a product with neither variants nor a price is skipped silently", () => {
  const priceless: ProductDetail = { ...product, variants: [], variant_axes: null, price: null };
  assert.deepEqual(buildFeedItems(priceless), []);
});

check("a single-axis product keeps label_es as g:size and no product_detail", () => {
  const single: ProductDetail = {
    ...product,
    variant_axes: null,
    variants: [
      {
        id: "v1",
        label_es: "Rollo 45 m",
        sku_suffix: "R45",
        price: "130.00",
        is_default: true,
        sort_order: 0,
      },
    ],
  };
  const items = buildFeedItems(single);
  assert.equal(items.length, 1);
  assert.equal(tagValue(items[0], "g:size"), "Rollo 45 m");
  assert.ok(!items[0].includes("product_detail"));
});

// -------------------------------------------------------- robots / hreflang

console.log("robots and hreflang");

check("the ru shop is noindex, es and en are not", () => {
  assert.deepEqual(tiendaRobots("ru"), { index: false, follow: true });
  assert.deepEqual(tiendaRobots("es"), { index: true, follow: true });
  assert.deepEqual(tiendaRobots("en"), { index: true, follow: true });
});

check("hreflang lists es and en only, x-default is es", () => {
  const alt = tiendaLangAlternates("/product/some-slug");
  assert.deepEqual(Object.keys(alt).sort(), ["en", "es", "x-default"]);
  assert.equal(alt["x-default"], "https://24clima.com/tienda/product/some-slug/");
  assert.equal(alt.es, "https://24clima.com/tienda/product/some-slug/");
  assert.equal(alt.en, "https://24clima.com/en/tienda/product/some-slug/");
  assert.ok(!("ru" in alt));
});

console.log(`\n${checks} checks passed`);
