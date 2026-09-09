/**
 * Assertions for the pure tienda logic that has no other guard: which variant a
 * set of axes resolves to, what a Merchant feed row looks like, and the robots
 * / hreflang rules for the shop.
 *
 * The repo has no test runner (and adding one would mean a new toolchain in a
 * project whose CI is just lint + Vercel build), so this is a plain script:
 *   bun run check:feed
 * It exits non-zero on the first failed assertion.
 */

import assert from "node:assert/strict";
import type { ProductDetail, ProductVariant } from "@/features/tienda/lib/api-client";
import {
  MOCK_AISLAMIENTOS,
  MOCK_MULTI_AXIS_SLUG,
  MOCK_PRESENTACIONES,
  MOCK_TUBOS,
  mockCellMissing,
  mockMultiAxisProduct,
} from "@/features/tienda/lib/dev-mock-product";
import { buildFeedItems, feedImages } from "@/features/tienda/lib/merchant-feed";
import { tiendaLangAlternates, tiendaRobots } from "@/features/tienda/lib/tienda-url";
import {
  availableValues,
  axisLabel,
  reconcileSelection,
  resolveVariant,
  selectionFromVariant,
  sizeAxisOf,
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

const product = mockMultiAxisProduct();
const variants = sortVariants(product.variants);
const axes = usableAxes(product.variant_axes, variants);
/** '1/4"' — a thin tube: not stocked with the thickest insulation. */
const THIN_T = MOCK_TUBOS[0];
/** A pre-made pair: sold on the roll only, never cut. */
const PAIR_T = MOCK_TUBOS[MOCK_TUBOS.length - 1];
/** A plain single diameter, stocked in every insulation and both presentations. */
const FULL_T = MOCK_TUBOS[2];
const THIN_A = MOCK_AISLAMIENTOS[0];
const MID_A = MOCK_AISLAMIENTOS[1];
const THICK_A = MOCK_AISLAMIENTOS[2];
const [ROLL, CUT] = MOCK_PRESENTACIONES;
/** 9 x 3 x 2 minus the cells the fixture leaves out. */
const CELLS = MOCK_TUBOS.flatMap((t) =>
  MOCK_AISLAMIENTOS.flatMap((a) => MOCK_PRESENTACIONES.filter((p) => !mockCellMissing(t, a, p)))
).length;

console.log("variants (three axes)");

check("fixture is the 9 x 3 x 2 grid minus the cells that are not stocked", () => {
  assert.equal(product.slug, MOCK_MULTI_AXIS_SLUG);
  assert.deepEqual(
    [MOCK_TUBOS.length, MOCK_AISLAMIENTOS.length, MOCK_PRESENTACIONES.length],
    [9, 3, 2]
  );
  assert.equal(CELLS, 41);
  assert.equal(variants.length, CELLS);
  // Three axes, in the order the backend declared them — that is the order the
  // picker renders its radiogroups in.
  assert.deepEqual(
    axes.map((a) => a.key),
    ["tubo", "aislamiento", "presentacion"]
  );
  for (const v of variants) {
    assert.deepEqual(Object.keys(variantOptions(v)).sort(), [
      "aislamiento",
      "presentacion",
      "tubo",
    ]);
  }
});

check("sizeAxisOf follows the is_size flag, then diametro, then the first axis", () => {
  assert.equal(sizeAxisOf(axes)?.key, "tubo");
  // The flag wins over both the legacy key and the position.
  assert.equal(
    sizeAxisOf([
      { key: "diametro", label_es: "Diámetro", values: ["a"] },
      { key: "presentacion", label_es: "Presentación", values: ["b"], is_size: true },
    ])?.key,
    "presentacion"
  );
  // An older backend sends no flag: the diameter is still the size…
  assert.equal(
    sizeAxisOf([
      { key: "presentacion", label_es: "Presentación", values: ["b"] },
      { key: "diametro", label_es: "Diámetro", values: ["a"] },
    ])?.key,
    "diametro"
  );
  // …and with neither flag nor diameter, the first axis is.
  assert.equal(
    sizeAxisOf([
      { key: "color", label_es: "Color", values: ["b"] },
      { key: "largo", label_es: "Largo", values: ["a"] },
    ])?.key,
    "color"
  );
  assert.equal(sizeAxisOf([]), null);
});

check("usableAxes ignores axes the variants do not carry", () => {
  const stripped: ProductVariant[] = variants.map((v) => ({ ...v, options: null }));
  assert.deepEqual(usableAxes(product.variant_axes, stripped), []);
  assert.deepEqual(usableAxes(null, variants), []);
  assert.deepEqual(usableAxes(product.variant_axes, []), []);
});

check("axisLabel falls back to Spanish", () => {
  assert.equal(axisLabel(axes[0], "es"), "Tubo");
  assert.equal(axisLabel(axes[0], "en"), "Tube");
  assert.equal(axisLabel(axes[0], "ru"), "Труба");
  assert.equal(axisLabel({ key: "x", label_es: "Eje", values: ["a"] }, "en"), "Eje");
});

check("resolveVariant matches on all three axes, and is null for an empty cell", () => {
  const selection = { tubo: THIN_T, aislamiento: THIN_A, presentacion: CUT };
  const hit = resolveVariant(variants, selection);
  assert.ok(hit);
  assert.deepEqual(variantOptions(hit), selection);
  // A pair is never cut, and a thin tube never wears the thickest insulation.
  assert.equal(
    resolveVariant(variants, { tubo: PAIR_T, aislamiento: THIN_A, presentacion: CUT }),
    null
  );
  assert.equal(
    resolveVariant(variants, { tubo: THIN_T, aislamiento: THICK_A, presentacion: ROLL }),
    null
  );
  assert.equal(resolveVariant(variants, {}), null);
});

check("availableValues greys out per axis, given the pick on the other two", () => {
  const onPair = availableValues(variants, axes, { tubo: PAIR_T });
  assert.deepEqual(onPair.presentacion, [ROLL]);
  assert.deepEqual(onPair.aislamiento, MOCK_AISLAMIENTOS);
  const onThin = availableValues(variants, axes, { tubo: THIN_T });
  assert.deepEqual(onThin.aislamiento, [THIN_A, MID_A]);
  assert.deepEqual(onThin.presentacion, MOCK_PRESENTACIONES);
  // One constraint at a time: cuts drop the three pairs, thick insulation drops
  // the two thin tubes.
  assert.equal(availableValues(variants, axes, { presentacion: CUT }).tubo.length, 6);
  assert.equal(availableValues(variants, axes, { aislamiento: THICK_A }).tubo.length, 7);
  // Both at once — the third axis narrows on the other TWO, not just one.
  const both = availableValues(variants, axes, { aislamiento: THICK_A, presentacion: CUT });
  assert.deepEqual(both.tubo, MOCK_TUBOS.slice(2, 6));
  assert.equal(availableValues(variants, axes, { presentacion: ROLL }).tubo.length, 9);
});

check("switching to a pair slides the presentation to the roll and keeps the rest", () => {
  const from = { tubo: FULL_T, aislamiento: THICK_A, presentacion: CUT };
  const next = reconcileSelection(variants, axes, from, "tubo", PAIR_T);
  assert.deepEqual(next, { tubo: PAIR_T, aislamiento: THICK_A, presentacion: ROLL });
  assert.ok(resolveVariant(variants, next));
});

check("switching to a thin tube slides the insulation, leaving the presentation alone", () => {
  const from = { tubo: FULL_T, aislamiento: THICK_A, presentacion: CUT };
  const next = reconcileSelection(variants, axes, from, "tubo", THIN_T);
  assert.deepEqual(next, { tubo: THIN_T, aislamiento: THIN_A, presentacion: CUT });
});

check("switching keeps still-valid values on both other axes", () => {
  const from = { tubo: FULL_T, aislamiento: MID_A, presentacion: CUT };
  const next = reconcileSelection(variants, axes, from, "tubo", MOCK_TUBOS[3]);
  assert.deepEqual(next, { tubo: MOCK_TUBOS[3], aislamiento: MID_A, presentacion: CUT });
});

check("no click on any axis can land on an empty cell", () => {
  for (const v of variants) {
    const from = selectionFromVariant(v, axes);
    for (const axis of axes) {
      for (const value of axis.values) {
        const next = reconcileSelection(variants, axes, from, axis.key, value);
        // The clicked value always sticks; the other two repair themselves.
        assert.equal(next[axis.key], value);
        assert.equal(Object.keys(next).length, axes.length);
        assert.ok(
          resolveVariant(variants, next),
          `${axis.key}=${value} from ${JSON.stringify(from)} resolved to nothing`
        );
      }
    }
  }
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
  assert.equal(aiItems.length, CELLS);
  const ids = aiItems.map((i) => tagValue(i, "g:id"));
  assert.equal(new Set(ids).size, CELLS);
  assert.ok(ids.every((id) => id?.startsWith("TUB-AISL-")));
  for (const item of aiItems) {
    assert.equal(tagValue(item, "g:item_group_id"), "TUB-AISL");
    assert.equal(tagValue(item, "g:mpn"), tagValue(item, "g:id"));
    assert.match(tagValue(item, "g:link") ?? "", /\/tienda\/product\/.+\/\?variant=mock-v\d+$/);
  }
});

check("g:size is the is_size axis; each of the other two rides in g:product_detail", () => {
  const first = aiItems[0];
  assert.equal(tagValue(first, "g:size"), THIN_T.replace(/"/g, "&quot;"));
  // Three axes → exactly TWO product_detail blocks, in the backend's axis order,
  // and the size axis is never repeated as one of them.
  assert.deepEqual(tagValues(first, "g:section_name"), ["Aislamiento", "Presentación"]);
  assert.deepEqual(tagValues(first, "g:attribute_name"), ["Aislamiento", "Presentación"]);
  assert.deepEqual(tagValues(first, "g:attribute_value"), [
    THIN_A.replace(/"/g, "&quot;"),
    ROLL,
  ]);
  assert.ok(!tagValues(first, "g:section_name").includes("Tubo"));
  for (const item of aiItems) assert.equal(tagValues(item, "g:attribute_value").length, 2);
});

check("g:size follows the is_size flag, not the axis order", () => {
  const flipped: ProductDetail = {
    ...product,
    variant_axes: (product.variant_axes ?? []).map((a) => ({
      ...a,
      is_size: a.key === "presentacion",
    })),
  };
  const first = buildFeedItems(flipped)[0];
  assert.equal(tagValue(first, "g:size"), ROLL);
  assert.deepEqual(tagValues(first, "g:section_name"), ["Tubo", "Aislamiento"]);
  assert.deepEqual(tagValues(first, "g:attribute_value"), [
    THIN_T.replace(/"/g, "&quot;"),
    THIN_A.replace(/"/g, "&quot;"),
  ]);
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
  assert.equal(items.length, CELLS);
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
