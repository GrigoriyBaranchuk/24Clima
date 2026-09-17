import type { AbstractIntlMessages } from "next-intl";

/**
 * Какие неймспейсы словаря реально доезжают до браузера.
 *
 * ЗАЧЕМ. `NextIntlClientProvider messages={messages}` сериализует ВЕСЬ словарь
 * в RSC-payload внутри HTML. Для es это 59 КБ из 233 КБ мобильной главной —
 * при том что клиентские компоненты читают оттуда десяток неймспейсов.
 * Серверные `getTranslations()` к этому отношения не имеют: они резолвятся на
 * сервере и в payload не попадают.
 *
 * ПРАВИЛО. Каждая страница везёт ровно те неймспейсы, которые нужны ЕЁ
 * клиентским компонентам. Новая фича заводит СВОЙ неймспейс и СВОЙ вложенный
 * провайдер в layout своего роута — оболочку она не расширяет. Оболочка растёт
 * только если компонент реально рендерится на каждой странице сайта.
 *
 * ВАЖНО (проверено в use-intl/dist/esm/production/react.js): вложенный
 * `NextIntlClientProvider` с пропом `messages` ЗАМЕЩАЕТ родительский словарь,
 * а не сливается с ним (`messages: i === undefined ? parent.messages : i`).
 * Поэтому route-провайдер обязан получить `[...CLIENT_SHELL_NAMESPACES, <своё>]`.
 *
 * Списки поддерживаются в актуальном состоянии проверкой
 * `node scripts/check-client-i18n.mjs` (висит на `bun run lint`).
 */

/**
 * Оболочка: неймспейсы компонентов, которые рендерятся на ЛЮБОЙ странице —
 * Header, BottomNav, DesktopWhatsAppFab. Ровно два; третьего быть не должно,
 * пока в шапку/подвал не приедет новый клиентский компонент.
 *
 * `tienda.cart` здесь НЕТ намеренно: TiendaCartLink рендерится в шапке только
 * под `showCartLink`, а его передаёт один лишь TiendaShell — то есть только
 * внутри /tienda/**, где действует провайдер с полным неймспейсом `tienda`.
 */
export const CLIENT_SHELL_NAMESPACES = [
  "common", // Header, BottomNav
  "whatsappMessages", // Header, BottomNav, DesktopWhatsAppFab
] as const;

/**
 * Клиентские неймспейсы ПУБЛИЧНОГО МАРКЕТИНГОВОГО САЙТА — того, что отдают
 * корневые layout-ы `(es)/layout.tsx` и `[locale]/layout.tsx`: главная,
 * /contacto, /problemas, /nosotros, /consejos-y-guias и прочие страницы без
 * собственного провайдера.
 *
 * ЭТО НЕ СВАЛКА. Список закрыт набором компонентов ниже. Новый клиентский
 * компонент маркетинга — это повод завести ему свой неймспейс и вложенный
 * провайдер в layout его роута, а не дописать строку сюда: всё, что здесь,
 * едет в HTML КАЖДОЙ маркетинговой страницы.
 *
 * Поддерево /tienda/** этот набор НЕ получает и получать не должно: вложенный
 * провайдер магазина ЗАМЕЩАЕТ словарь на `[...CLIENT_SHELL_NAMESPACES,
 * "tienda"]`. Ради этого сужения всё и затевалось — маркетинговые тексты на
 * страницах магазина не рендерятся. Импорт любого из перечисленных компонентов
 * внутрь `src/features/tienda/**` или `src/app/**\/tienda/**` — ошибка, её
 * ловит `scripts/check-client-i18n.mjs`.
 */
export const PUBLIC_SITE_CLIENT_NAMESPACES = [
  "calculator", // CalculatorMobile / CalculatorDesktop
  "packages", // CalculatorMobile / CalculatorDesktop, CleaningPackages
  "contact", // Contact
  "contactForm", // ContactForm
  "whyUs", // WhyUs
  "problems", // ProblemsContent
  "homeCta", // HomeCtaBlocks
  "nosotrosCta", // NosotrosCTA
  "tips", // TipsList
] as const;

type Mutable = Record<string, unknown>;

/** Объекты, созданные этой функцией: в них можно дописывать, не портя словарь. */
const owned = new WeakSet<object>();

function isPlainObject(value: unknown): value is Mutable {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Собирает подсловарь из перечисленных неймспейсов.
 *
 * Поддерживает точечные пути: `"tienda.cart"` → `{ tienda: { cart: … } }`.
 * Отсутствующие ключи молча пропускаются — это не место для падений: словари
 * трёх языков не всегда синхронны, а `MISSING_MESSAGE` и так поймает
 * next-intl в месте использования.
 *
 * Исходный словарь не мутируется: промежуточные узлы, пришедшие из messages,
 * копируются поверхностно перед дозаписью.
 */
export function pickMessages(
  messages: AbstractIntlMessages,
  namespaces: readonly string[],
): AbstractIntlMessages {
  const out: Mutable = {};
  owned.add(out);

  for (const namespace of namespaces) {
    const parts = namespace.split(".");

    // 1. Достаём значение из исходного словаря.
    let source: unknown = messages;
    for (const part of parts) {
      if (!isPlainObject(source) || !(part in source)) {
        source = undefined;
        break;
      }
      source = source[part];
    }
    if (source === undefined) continue;

    // 2. Кладём его в результат по тому же пути.
    let target = out;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const existing = target[part];
      if (isPlainObject(existing) && owned.has(existing)) {
        target = existing;
      } else {
        const next: Mutable = isPlainObject(existing) ? { ...existing } : {};
        owned.add(next);
        target[part] = next;
        target = next;
      }
    }
    target[parts[parts.length - 1]] = source;
  }

  return out as AbstractIntlMessages;
}
