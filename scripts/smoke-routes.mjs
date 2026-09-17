#!/usr/bin/env node
/**
 * Дымовой обход всех публичных роутов против локального `next start`.
 *
 * Зачем: корневые layout-ы отдают клиенту урезанный словарь
 * (src/i18n/client-messages.ts), а Lora объявлена только в поддереве блога.
 * Оба изменения ломаются ТИХО — страница отдаёт 200, а пользователь видит
 * «Algo salió mal» или сырой ключ вида `common.services`. Статический
 * `scripts/check-client-i18n.mjs` ловит только то, что видно в коде; здесь
 * проверяется фактический HTML.
 *
 * Источник списка URL — /sitemap.xml (поддерживается и sitemap-index).
 * Каждый URL запрашивается дважды: мобильным и десктопным UA.
 *
 * Запуск:  node scripts/smoke-routes.mjs
 *          BASE_URL=http://localhost:3000 node scripts/smoke-routes.mjs
 *
 * Node 18+, без зависимостей.
 */

const BASE_URL = (process.env.BASE_URL || "http://localhost:3102").replace(
  /\/$/,
  "",
);

const UAS = {
  mobile:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

/** Явные маркеры падения: error.tsx / global-error.tsx и ошибки next-intl. */
const CRASH_MARKERS = [
  "Algo salió mal",
  "Something went wrong",
  "Что-то пошло не так",
  "MISSING_MESSAGE",
];

/** Сырой ключ перевода, просочившийся в видимый текст. */
const KEY_LEAK =
  /\b(common|whatsappMessages|calculator|packages|services|tienda|tips|tipsAdmin|problems|contact|contactForm|whyUs|homeCta|nosotrosCta|hero|footer)\.[a-zA-Z]+(\.[a-zA-Z]+)*\b/;

/**
 * Легитимные совпадения KEY_LEAK в видимом тексте. Пусто — и пусть остаётся
 * пустым: каждая запись здесь ослабляет проверку, поэтому добавлять только с
 * комментарием, почему это не утечка ключа.
 */
const KEY_LEAK_ALLOWLIST = [];

/**
 * Роуты магазина зависят от внешнего shop-api, которого локально может не быть.
 * Для них мы не требуем 200 — только отсутствие маркеров падения.
 */
const SHOP_API_DEPENDENT = /\/tienda(\/|$)/;

/** Всегда проверяем магазин, даже если его нет в sitemap (каталог недоступен). */
const EXTRA_PATHS = [
  "/tienda/",
  "/tienda/cart/",
  "/tienda/checkout/",
  "/tienda/account/",
  "/tienda/account/register/",
  "/tienda/devoluciones/",
  "/tienda/profesional/",
  "/ru/tienda/",
  "/en/tienda/",
];

function stripToText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, " ")
    .replace(/\s+/g, " ");
}

function toLocalUrl(raw) {
  try {
    const parsed = new URL(raw);
    return `${BASE_URL}${parsed.pathname}${parsed.search}`;
  } catch {
    return `${BASE_URL}${raw.startsWith("/") ? raw : `/${raw}`}`;
  }
}

async function fetchText(url, ua) {
  const response = await fetch(url, {
    headers: { "user-agent": ua, accept: "text/html,*/*" },
    redirect: "follow",
  });
  return { status: response.status, body: await response.text() };
}

async function collectSitemapUrls(url, seen = new Set(), depth = 0) {
  if (depth > 3) return [];
  const { status, body } = await fetchText(url, UAS.desktop);
  if (status !== 200) {
    throw new Error(`sitemap ${url} вернул ${status}`);
  }
  const isIndex = /<sitemapindex/i.test(body);
  const locs = [...body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
    (m) => m[1],
  );
  if (!isIndex) return locs;
  const nested = [];
  for (const loc of locs) {
    const local = toLocalUrl(loc);
    if (seen.has(local)) continue;
    seen.add(local);
    nested.push(...(await collectSitemapUrls(local, seen, depth + 1)));
  }
  return nested;
}

function inspect(url, ua, status, body) {
  const problems = [];
  const shopDependent = SHOP_API_DEPENDENT.test(new URL(url).pathname);

  if (status !== 200) {
    if (shopDependent && (status === 404 || status === 503)) {
      problems.push({ level: "note", text: `HTTP ${status} (shop API)` });
    } else {
      problems.push({ level: "fail", text: `HTTP ${status}` });
    }
  }

  for (const marker of CRASH_MARKERS) {
    if (body.includes(marker)) {
      problems.push({ level: "fail", text: `маркер падения: "${marker}"` });
    }
  }

  const text = stripToText(body);
  const leak = text.match(KEY_LEAK);
  if (leak && !KEY_LEAK_ALLOWLIST.includes(leak[0])) {
    const at = Math.max(0, leak.index - 40);
    problems.push({
      level: "fail",
      text: `сырой ключ "${leak[0]}" в тексте: …${text.slice(at, leak.index + 60)}…`,
    });
  }

  return problems;
}

async function main() {
  console.log(`smoke-routes: base=${BASE_URL}`);

  let urls;
  try {
    urls = await collectSitemapUrls(`${BASE_URL}/sitemap.xml`);
  } catch (error) {
    console.error(`smoke-routes: не удалось прочитать sitemap — ${error}`);
    process.exit(1);
  }

  const all = new Set(urls.map(toLocalUrl));
  for (const path of EXTRA_PATHS) all.add(`${BASE_URL}${path}`);
  const list = [...all].sort();

  console.log(`smoke-routes: ${list.length} URL × ${Object.keys(UAS).length} UA`);

  const rows = [];
  let failures = 0;
  let notes = 0;

  for (const url of list) {
    for (const [uaName, ua] of Object.entries(UAS)) {
      let status = 0;
      let problems;
      try {
        const response = await fetchText(url, ua);
        status = response.status;
        problems = inspect(url, ua, status, response.body);
      } catch (error) {
        problems = [{ level: "fail", text: `сетевая ошибка: ${error}` }];
      }
      const failed = problems.filter((p) => p.level === "fail");
      const noted = problems.filter((p) => p.level === "note");
      failures += failed.length > 0 ? 1 : 0;
      notes += noted.length;
      rows.push({
        url: new URL(url).pathname,
        ua: uaName,
        status,
        verdict: failed.length > 0 ? "FAIL" : noted.length > 0 ? "note" : "ok",
        detail: [...failed, ...noted].map((p) => p.text).join("; "),
      });
    }
  }

  const width = Math.max(...rows.map((r) => r.url.length), 4);
  console.log("");
  console.log(
    `${"PATH".padEnd(width)}  ${"UA".padEnd(7)}  ${"CODE".padEnd(4)}  VERDICT`,
  );
  for (const row of rows) {
    if (row.verdict === "ok") continue;
    console.log(
      `${row.url.padEnd(width)}  ${row.ua.padEnd(7)}  ${String(row.status).padEnd(4)}  ${row.verdict}  ${row.detail}`,
    );
  }
  const okCount = rows.filter((r) => r.verdict === "ok").length;
  console.log("");
  console.log(
    `smoke-routes: ${rows.length} проверок — ok ${okCount}, note ${notes}, FAIL ${failures} (${list.length} URL)`,
  );

  process.exit(failures > 0 ? 1 : 0);
}

main();
