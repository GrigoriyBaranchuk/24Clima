import { Lora } from "next/font/google";

/**
 * Зеркало `(es)/consejos-y-guias/layout.tsx` для en/ru (грабля №2: два дерева
 * роутов). Lora объявлена только в поддереве блога — единственном месте, где
 * используется сериф (TipsList `font-serif`, ArticleRenderer `.article-content`).
 *
 * Здесь нужны оба подмножества: ru-статьи набраны кириллицей.
 * Имя переменной `--font-lora` менять нельзя: его читает tailwind-preset пакета
 * `@24clima/design` (`serif: ["var(--font-lora, Lora)", ...]`) и globals.css.
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
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
