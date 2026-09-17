#!/usr/bin/env node
/**
 * Страховка от «тихого» MISSING_MESSAGE (грабля №10).
 *
 * Корневые layout-ы больше не отдают клиенту ВЕСЬ словарь: там только
 * CLIENT_SHELL_NAMESPACES (src/i18n/client-messages.ts), остальное добавляют
 * вложенные провайдеры в layout-ах конкретных роутов. Значит любой НОВЫЙ
 * `useTranslations("что-то")` в клиентском компоненте может оказаться вне
 * словаря — и упасть в рантайме, а не на билде.
 *
 * Скрипт находит все `useTranslations(...)` в src/**\/*.tsx и требует, чтобы
 * неймспейс был покрыт одним из трёх наборов:
 *
 *   1. CLIENT_SHELL_NAMESPACES — оболочка, едет на КАЖДУЮ страницу;
 *   2. PUBLIC_SITE_CLIENT_NAMESPACES — публичный маркетинговый сайт, едет из
 *      корневых layout-ов. Файлам магазина (`src/features/tienda/**` и
 *      `src/app/**\/tienda/**`) он НЕ достаётся: их провайдер ЗАМЕЩАЕТ словарь
 *      на `[...SHELL, "tienda"]`;
 *   3. ROUTE_SCOPED ниже — вместе с файлом, который неймспейс использует.
 *
 * Добавили новый namespace → заведите вложенный провайдер в layout-е роута
 * (в ОБОИХ деревьях, грабля №2) и опишите его в ROUTE_SCOPED. Дописывать в
 * оболочку или в набор публичного сайта — крайняя мера: оттуда неймспейс едет
 * в HTML каждой страницы.
 *
 * Отдельно проверяется, что в магазин не затащили маркетинговый компонент:
 * для каждого файла поддерева магазина резолвятся его импорты НА ОДИН УРОВЕНЬ
 * (относительные и `@/`), и если импортированный файл читает маркетинговый
 * неймспейс — это ошибка. Так ловится, например, `import Contact from
 * "@/components/Contact"` внутри /tienda: на проде это был бы MISSING_MESSAGE.
 *
 * Без зависимостей, ~50 мс. Висит на `bun run lint`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");

/**
 * Неймспейсы, покрытые вложенным провайдером конкретного роута.
 * Ключ покрывает и вложенные пути: `tienda` → `tienda.cart`, `tienda.product`…
 * Значение — файлы, которым этот неймспейс разрешён.
 */
const ROUTE_SCOPED = {
  // src/app/(es)/servicios/[service]/layout.tsx + [locale]-зеркало
  services: ["src/components/ServiceFAQ.tsx"],
  // src/app/(es)/tienda/layout.tsx + [locale]-зеркало
  tienda: [
    "src/features/tienda/components/TiendaCartLink.tsx",
    "src/features/tienda/components/product/ReviewForm.tsx",
    "src/features/tienda/components/checkout/CheckoutForm.tsx",
    "src/features/tienda/components/cart/CartSummary.tsx",
    "src/features/tienda/components/account/RegisterForm.tsx",
    "src/features/tienda/components/account/AccountView.tsx",
    "src/features/tienda/components/account/LoginForm.tsx",
  ],
  // src/app/(es)/consejos-y-guias/admin/layout.tsx + [locale]-зеркало
  tipsAdmin: ["src/app/[locale]/consejos-y-guias/admin/AdminClient.tsx"],
};

const CLIENT_MESSAGES = join(SRC, "i18n", "client-messages.ts");

/** Читает `export const <name> = [...] as const` из client-messages.ts. */
function readNamespaceList(name) {
  const source = readFileSync(CLIENT_MESSAGES, "utf8");
  const block = source.match(
    new RegExp(`${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`),
  );
  if (!block) {
    throw new Error(
      `check-client-i18n: не найден массив ${name} в src/i18n/client-messages.ts`,
    );
  }
  return [...block[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/** Поддерево магазина: сюда маркетинговый словарь не доезжает. */
const isShopFile = (file) =>
  file.startsWith("src/features/tienda/") ||
  /^src\/app\/.*\/tienda\//.test(file);

/** Расширения, которые дописывает резолвер TS/Next к импорту без расширения. */
const CANDIDATES = [
  "",
  ".tsx",
  ".ts",
  "/index.tsx",
  "/index.ts",
  ".jsx",
  ".js",
];

/**
 * Резолвит спецификатор импорта в путь внутри src — относительный (`./x`,
 * `../x`) или алиас `@/x`. Пакеты из node_modules и всё нерезолвящееся
 * молча пропускаются: это гард, а не сборщик.
 */
function resolveImport(fromAbsolute, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) base = resolve(dirname(fromAbsolute), specifier);
  else return null;

  for (const suffix of CANDIDATES) {
    const candidate = base + suffix;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Все спецификаторы файла: `from "x"`, `import "x"` и `import("x")`. */
function importSpecifiers(source) {
  const out = new Set();
  for (const m of source.matchAll(/\bfrom\s*["']([^"']+)["']/g)) out.add(m[1]);
  for (const m of source.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g))
    out.add(m[1]);
  return [...out];
}

/** Неймспейсы, которые файл читает через `useTranslations("…")`. */
function usedNamespaces(source) {
  return [...source.matchAll(/useTranslations\(\s*["']([^"']+)["']\s*\)/g)].map(
    (m) => m[1],
  );
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".tsx") || full.endsWith(".ts")) out.push(full);
  }
  return out;
}

const shell = readNamespaceList("CLIENT_SHELL_NAMESPACES");
const publicSite = readNamespaceList("PUBLIC_SITE_CLIENT_NAMESPACES");
const errors = [];

const matches = (list, ns) =>
  list.some((s) => ns === s || ns.startsWith(`${s}.`));

const coveredByShell = (ns) => matches(shell, ns);

/**
 * Маркетинговый набор корневых layout-ов. Файлам магазина он недоступен:
 * их провайдер ЗАМЕЩАЕТ словарь на `[...SHELL, "tienda"]`.
 */
const coveredByPublicSite = (ns, file) => {
  if (!matches(publicSite, ns)) return false;
  if (!isShopFile(file)) return true;
  errors.push(
    `${file}: namespace "${ns}" есть только в PUBLIC_SITE_CLIENT_NAMESPACES, а этот файл лежит в поддереве магазина.\n` +
      "    → провайдер /tienda отдаёт только [...CLIENT_SHELL_NAMESPACES, \"tienda\"], маркетинговый словарь туда не едет — будет MISSING_MESSAGE.\n" +
      "    → уберите компонент из магазина или заведите ему собственный неймспейс внутри `tienda`.",
  );
  return true;
};

const coveredByRoute = (ns, file) => {
  for (const [key, files] of Object.entries(ROUTE_SCOPED)) {
    if (ns !== key && !ns.startsWith(`${key}.`)) continue;
    if (files.includes(file)) return true;
    errors.push(
      `${file}: namespace "${ns}" прописан в ROUTE_SCOPED["${key}"], но этого файла в списке нет.\n` +
        "    → добавьте файл в scripts/check-client-i18n.mjs и убедитесь, что он рендерится только под соответствующим layout-ом.",
    );
    return true;
  }
  return false;
};

for (const absolute of walk(SRC)) {
  const source = readFileSync(absolute, "utf8");
  if (!source.includes("useTranslations(")) continue;
  const file = relative(ROOT, absolute).split(sep).join("/");

  for (const match of source.matchAll(/useTranslations\(\s*([^)]*)\)/g)) {
    const argument = match[1].trim();
    if (argument === "") {
      errors.push(
        `${file}: useTranslations() без неймспейса — требует ВЕСЬ словарь на клиенте. Укажите неймспейс явно.`,
      );
      continue;
    }
    const literal = argument.match(/^["']([^"']+)["']$/);
    if (!literal) {
      errors.push(
        `${file}: useTranslations(${argument}) — неймспейс не строковый литерал, статически проверить нельзя. Используйте литерал.`,
      );
      continue;
    }
    const ns = literal[1];
    if (coveredByShell(ns)) continue;
    if (coveredByPublicSite(ns, file)) continue;
    if (coveredByRoute(ns, file)) continue;
    errors.push(
      `${file}: namespace "${ns}" не покрыт ни CLIENT_SHELL_NAMESPACES, ни PUBLIC_SITE_CLIENT_NAMESPACES, ни ROUTE_SCOPED.\n` +
        "    → заведите вложенный NextIntlClientProvider в layout-е роута (в ОБОИХ деревьях: (es) и [locale]) и опишите его в ROUTE_SCOPED,\n" +
        "    → либо, если компонент рендерится на любой странице сайта, добавьте неймспейс в CLIENT_SHELL_NAMESPACES / PUBLIC_SITE_CLIENT_NAMESPACES (src/i18n/client-messages.ts) — оттуда он поедет в HTML каждой страницы.",
    );
  }
}

/**
 * Магазин не должен напрямую импортировать компоненты маркетингового сайта:
 * под провайдером /tienda их неймспейсов нет. Один уровень импортов — этого
 * хватает, чтобы поймать `import Contact from "@/components/Contact"`, и не
 * требует обхода всего графа.
 */
for (const absolute of walk(SRC)) {
  const file = relative(ROOT, absolute).split(sep).join("/");
  if (!isShopFile(file)) continue;

  const source = readFileSync(absolute, "utf8");
  for (const specifier of importSpecifiers(source)) {
    const target = resolveImport(absolute, specifier);
    if (!target) continue;
    const targetFile = relative(ROOT, target).split(sep).join("/");
    if (isShopFile(targetFile)) continue;

    const targetSource = readFileSync(target, "utf8");
    if (!targetSource.includes("useTranslations(")) continue;

    for (const ns of usedNamespaces(targetSource)) {
      if (!matches(publicSite, ns)) continue;
      errors.push(
        `${file}: импортирует ${targetFile}, а тот читает маркетинговый namespace "${ns}".\n` +
          "    → под провайдером /tienda этого неймспейса нет ([...CLIENT_SHELL_NAMESPACES, \"tienda\"]) — компонент упадёт в MISSING_MESSAGE.\n" +
          "    → не тащите маркетинговые компоненты в магазин; нужен такой же блок — сделайте его в src/features/tienda с неймспейсом внутри `tienda`.",
      );
    }
  }
}

if (errors.length > 0) {
  console.error("\ncheck-client-i18n: найдены непокрытые неймспейсы\n");
  for (const error of errors) console.error(`  • ${error}`);
  console.error(
    `\n${errors.length} проблем(ы). Без правки эти строки дадут MISSING_MESSAGE в браузере.\n`,
  );
  process.exit(1);
}

console.log("check-client-i18n: ok");
