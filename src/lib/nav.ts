/** Hash-навигация (якорь на текущей или другой странице) — там и только там
 *  next/link нужен `scroll={false}`, иначе браузер уедет к верху вместо якоря. */
export function isHashNav(href: string): boolean {
  return href.startsWith("#") || href.includes("#");
}
