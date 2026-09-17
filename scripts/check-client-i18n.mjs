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
 * неймспейс был либо в оболочке, либо в ROUTE_SCOPED ниже — вместе с файлом,
 * который его использует. Добавили новый namespace → добавьте его сюда и
 * заведите вложенный провайдер в layout-е роута (в ОБОИХ деревьях, грабля №2).
 *
 * Без зависимостей, ~50 мс. Висит на `bun run lint`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
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

function readShellNamespaces() {
  const source = readFileSync(join(SRC, "i18n", "client-messages.ts"), "utf8");
  const block = source.match(
    /CLIENT_SHELL_NAMESPACES\s*=\s*\[([\s\S]*?)\]\s*as const/,
  );
  if (!block) {
    throw new Error(
      "check-client-i18n: не найден массив CLIENT_SHELL_NAMESPACES в src/i18n/client-messages.ts",
    );
  }
  return [...block[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
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

const shell = readShellNamespaces();
const errors = [];

const coveredByShell = (ns) =>
  shell.some((s) => ns === s || ns.startsWith(`${s}.`));

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
    if (coveredByRoute(ns, file)) continue;
    errors.push(
      `${file}: namespace "${ns}" не покрыт ни CLIENT_SHELL_NAMESPACES, ни ROUTE_SCOPED.\n` +
        "    → либо добавьте его в CLIENT_SHELL_NAMESPACES (src/i18n/client-messages.ts), если компонент рендерится на любой странице,\n" +
        "    → либо заведите вложенный NextIntlClientProvider в layout-е роута (в ОБОИХ деревьях: (es) и [locale]) и опишите его в ROUTE_SCOPED.",
    );
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
