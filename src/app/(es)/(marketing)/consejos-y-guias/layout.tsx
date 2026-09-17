import { Lora } from "next/font/google";

/**
 * Lora живёт ТОЛЬКО здесь, в поддереве блога.
 *
 * Сериф применяется в двух местах, и оба — под /consejos-y-guias:
 *   • TipsList — `font-serif` (preset дизайн-системы: `var(--font-lora, Lora)`);
 *   • ArticleRenderer — `.article-content` (globals.css) и `prose-*:font-serif`.
 * Раньше Lora объявлялась в корневом layout, поэтому КАЖДАЯ страница сайта
 * тянула два лишних woff2 (~79 КБ) ради шрифта, которого на ней нет.
 *
 * Только latin: это дерево роутов — испанское.
 * Имя переменной `--font-lora` менять нельзя: его читает tailwind-preset пакета
 * `@24clima/design` (`serif: ["var(--font-lora, Lora)", ...]`) и globals.css.
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export default function TipsFontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `contents` (display: contents) — обёртка не создаёт бокса, поэтому вёрстка
  // и каскад остаются прежними, а CSS-переменная --font-lora наследуется вниз.
  return <div className={`${lora.variable} contents`}>{children}</div>;
}
