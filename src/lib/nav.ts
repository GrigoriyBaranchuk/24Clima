/** Hash-навигация (якорь на текущей или другой странице) — там и только там
 *  next/link нужен `scroll={false}`, иначе браузер уедет к верху вместо якоря. */
export function isHashNav(href: string): boolean {
  return href.startsWith("#") || href.includes("#");
}

/** Приводит внутренний href к канонической форме со слэшем на конце
 *  (`trailingSlash: true` в next.config.js + 308 в middleware — ссылки должны
 *  вести сразу на конечный URL, без лишнего хопа).
 *
 *  Таблица случаев:
 *  - `https://…`, `mailto:…`, `tel:…`, `//host/…` — внешние, не трогаем;
 *  - `#calculadora`, `?x=1` — без ведущего `/`, не трогаем;
 *  - `/api/…`, `/_next/…` — не страницы, не трогаем;
 *  - `/sitemap.xml` (точка в последнем сегменте) — файл, не трогаем;
 *  - `/servicios` → `/servicios/`; `/en` → `/en/`;
 *  - `/tienda/cart?add=1` → `/tienda/cart/?add=1` (слэш ДО query);
 *  - `/servicios#x` → `/servicios/#x` (слэш ДО hash);
 *  - `/en?add=1` → `/en/?add=1`;
 *  - идемпотентно: `/path/` → `/path/`, `/` → `/`, `/#servicios` → `/#servicios`.
 */
export function ensureTrailingSlash(href: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//") || !href.startsWith("/")) return href;
  const hashIdx = href.indexOf("#");
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : "";
  const beforeHash = hashIdx >= 0 ? href.slice(0, hashIdx) : href;
  const qIdx = beforeHash.indexOf("?");
  const query = qIdx >= 0 ? beforeHash.slice(qIdx) : "";
  let path = qIdx >= 0 ? beforeHash.slice(0, qIdx) : beforeHash;
  if (path.startsWith("/api/") || path.startsWith("/_next/")) return href;
  const last = path.slice(path.lastIndexOf("/") + 1);
  if (!path.endsWith("/") && !last.includes(".")) path += "/";
  return path + query + hash;
}
