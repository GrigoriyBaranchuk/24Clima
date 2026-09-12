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
import type { VariantSelection } from "@/features/tienda/lib/variants";

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
/** '7/8"' — a wide tube: no 45 m roll, and never the thinnest insulation. */
const WIDE_T = MOCK_TUBOS[5];
/** A pre-made pair — as constrained as 7/8". */
const PAIR_T = MOCK_TUBOS[MOCK_TUBOS.length - 1];
/** A middle diameter, stocked in every insulation and every presentation. */
const FULL_T = MOCK_TUBOS[2];
const THIN_A = MOCK_AISLAMIENTOS[0];
const MID_A = MOCK_AISLAMIENTOS[1];
const THICK_A = MOCK_AISLAMIENTOS[2];
const [ROLL45, ROLL30, CUT] = MOCK_PRESENTACIONES;
/** 9 x 3 x 3 minus the cells the fixture leaves out. */
const CELLS = MOCK_TUBOS.flatMap((t) =>
  MOCK_AISLAMIENTOS.flatMap((a) => MOCK_PRESENTACIONES.filter((p) => !mockCellMissing(t, a, p)))
).length;

console.log("variants (three axes)");

check("fixture is the 9 x 3 x 3 grid minus the cells that are not stocked", () => {
  assert.equal(product.slug, MOCK_MULTI_AXIS_SLUG);
  assert.deepEqual(
    [MOCK_TUBOS.length, MOCK_AISLAMIENTOS.length, MOCK_PRESENTACIONES.length],
    [9, 3, 3]
  );
  assert.equal(CELLS, 48);
  // Every tube keeps the 30 m roll and the 15 m cut — that is what lets the main
  // axis stay clickable from anywhere.
  for (const tubo of MOCK_TUBOS) {
    for (const presentacion of [ROLL30, CUT]) {
      assert.ok(
        MOCK_AISLAMIENTOS.some((a) => !mockCellMissing(tubo, a, presentacion)),
        `${tubo} has no ${presentacion}`
      );
    }
  }
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
  // A wide tube wears no thin insulation and comes on no 45 m roll; a thin tube
  // never wears the thickest insulation; the thickest is never cut.
  assert.equal(
    resolveVariant(variants, { tubo: PAIR_T, aislamiento: THIN_A, presentacion: ROLL30 }),
    null
  );
  assert.equal(
    resolveVariant(variants, { tubo: WIDE_T, aislamiento: MID_A, presentacion: ROLL45 }),
    null
  );
  assert.equal(
    resolveVariant(variants, { tubo: THIN_T, aislamiento: THICK_A, presentacion: ROLL45 }),
    null
  );
  assert.equal(
    resolveVariant(variants, { tubo: FULL_T, aislamiento: THICK_A, presentacion: CUT }),
    null
  );
  assert.equal(resolveVariant(variants, {}), null);
});

check("the size axis is never crossed out, whatever is picked on the others", () => {
  // From every cell of the grid, all nine tubes stay clickable.
  for (const v of variants) {
    const from = selectionFromVariant(v, axes);
    assert.deepEqual(
      availableValues(variants, axes, from).tubo,
      MOCK_TUBOS,
      `tubes greyed out at ${JSON.stringify(from)}`
    );
  }
  // …and from a partial pick too.
  const partials: VariantSelection[] = [
    {},
    { presentacion: ROLL45 },
    { aislamiento: THICK_A },
    { aislamiento: THICK_A, presentacion: CUT },
  ];
  for (const from of partials) {
    assert.deepEqual(availableValues(variants, axes, from).tubo, MOCK_TUBOS);
  }
  // The relaxation is real, not vacuous: the strict grid IS narrower — only five
  // tubes carry a 45 m roll, and no tube carries the thickest insulation cut.
  const tubesOn45 = new Set(
    variants
      .filter((v) => variantOptions(v).presentacion === ROLL45)
      .map((v) => variantOptions(v).tubo)
  );
  assert.equal(tubesOn45.size, 5);
  assert.equal(
    variants.filter(
      (v) => variantOptions(v).aislamiento === THICK_A && variantOptions(v).presentacion === CUT
    ).length,
    0
  );
});

check("the other axes still grey out, on the tube and on each other", () => {
  const onWide = availableValues(variants, axes, { tubo: WIDE_T });
  assert.deepEqual(onWide.presentacion, [ROLL30, CUT]);
  assert.deepEqual(onWide.aislamiento, [MID_A, THICK_A]);
  const onThin = availableValues(variants, axes, { tubo: THIN_T });
  assert.deepEqual(onThin.aislamiento, [THIN_A, MID_A]);
  assert.deepEqual(onThin.presentacion, MOCK_PRESENTACIONES);
  // Two constraints at once: a non-main axis narrows on the tube AND on the
  // other non-main axis, not just on one of them.
  assert.deepEqual(availableValues(variants, axes, { tubo: FULL_T }).aislamiento, MOCK_AISLAMIENTOS);
  assert.deepEqual(availableValues(variants, axes, { tubo: FULL_T, presentacion: CUT }).aislamiento, [
    THIN_A,
    MID_A,
  ]);
  assert.deepEqual(
    availableValues(variants, axes, { tubo: WIDE_T, aislamiento: THICK_A }).presentacion,
    [ROLL30]
  );
});

check("clicking a tube keeps the insulation and the length whenever they fit", () => {
  // The owner's case: 7/8" x 30 m, click 1/4" — both other axes survive.
  const from = { tubo: WIDE_T, aislamiento: MID_A, presentacion: ROLL30 };
  const next = reconcileSelection(variants, axes, from, "tubo", THIN_T);
  assert.deepEqual(next, { tubo: THIN_T, aislamiento: MID_A, presentacion: ROLL30 });
  assert.ok(resolveVariant(variants, next));
});

check("clicking a tube slides only the axes that no longer fit", () => {
  const from = { tubo: FULL_T, aislamiento: THICK_A, presentacion: ROLL45 };
  // 1/4" carries no 3/4" insulation → slides to 3/8"; the 45 m roll survives.
  assert.deepEqual(reconcileSelection(variants, axes, from, "tubo", THIN_T), {
    tubo: THIN_T,
    aislamiento: THIN_A,
    presentacion: ROLL45,
  });
  // 7/8" keeps the 3/4" insulation but has no 45 m roll → slides to 30 m.
  assert.deepEqual(reconcileSelection(variants, axes, from, "tubo", WIDE_T), {
    tubo: WIDE_T,
    aislamiento: THICK_A,
    presentacion: ROLL30,
  });
  // A pair behaves like 7/8" — same shelf, same holes.
  assert.deepEqual(reconcileSelection(variants, axes, from, "tubo", PAIR_T), {
    tubo: PAIR_T,
    aislamiento: THICK_A,
    presentacion: ROLL30,
  });
});

check("clicking a non-main axis leaves the tube alone", () => {
  const from = { tubo: WIDE_T, aislamiento: THICK_A, presentacion: ROLL30 };
  const next = reconcileSelection(variants, axes, from, "aislamiento", MID_A);
  assert.deepEqual(next, { tubo: WIDE_T, aislamiento: MID_A, presentacion: ROLL30 });
  // Only the pills the picker actually offers: a value greyed out on a non-main
  // axis is not clickable, so the tube is never dragged along by one.
  for (const v of variants) {
    const start = selectionFromVariant(v, axes);
    const enabled = availableValues(variants, axes, start);
    for (const axis of axes) {
      if (axis.key === "tubo") continue;
      for (const value of enabled[axis.key]) {
        assert.equal(
          reconcileSelection(variants, axes, start, axis.key, value).tubo,
          start.tubo,
          `${axis.key}=${value} moved the tube away from ${start.tubo}`
        );
      }
    }
  }
});

check("every tube is clickable from every cell and lands on a real variant", () => {
  const sizeAxis = sizeAxisOf(axes);
  assert.ok(sizeAxis);
  for (const v of variants) {
    const from = selectionFromVariant(v, axes);
    for (const value of sizeAxis.values) {
      const next = reconcileSelection(variants, axes, from, sizeAxis.key, value);
      assert.equal(next[sizeAxis.key], value);
      assert.ok(
        resolveVariant(variants, next),
        `tubo=${value} from ${JSON.stringify(from)} resolved to nothing`
      );
    }
  }
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
    ROLL45,
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
  assert.equal(tagValue(first, "g:size"), ROLL45);
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

check("every row carries the Google category as its id and our own product_type", () => {
  for (const item of aiItems) {
    assert.equal(tagValue(item, "g:google_product_category"), "2216");
    assert.equal(
      tagValue(item, "g:product_type"),
      "Materiales e insumos &gt; Tubería y aislamiento"
    );
  }
});

check("without an id the English taxonomy path is sent instead", () => {
  const pathOnly: ProductDetail = { ...product, google_product_category_id: null };
  const item = buildFeedItems(pathOnly)[0];
  assert.equal(
    tagValue(item, "g:google_product_category"),
    "Hardware &gt; Plumbing &gt; Plumbing Pipes"
  );
});

check("an old backend sends neither tag rather than an empty one", () => {
  const legacyCategory: ProductDetail = {
    ...product,
    product_type: null,
    google_product_category: null,
    google_product_category_id: null,
  };
  const item = buildFeedItems(legacyCategory)[0];
  assert.ok(!item.includes("g:google_product_category"));
  assert.ok(!item.includes("g:product_type"));
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
