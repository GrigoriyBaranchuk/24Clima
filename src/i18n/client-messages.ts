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
 * ЧТО ЗДЕСЬ. Неймспейсы, которые нужны компонентам «оболочки» — тем, что могут
 * отрендериться на ЛЮБОЙ странице (шапка, нижняя навигация, футер-CTA,
 * калькулятор, формы). Всё, что живёт на одном роуте, добавляется вложенным
 * провайдером в layout этого роута — см. ROUTE_SCOPED в
 * `scripts/check-client-i18n.mjs`.
 *
 * ВАЖНО (проверено в use-intl/dist/esm/production/react.js): вложенный
 * `NextIntlClientProvider` с пропом `messages` ЗАМЕЩАЕТ родительский словарь,
 * а не сливается с ним (`messages: i === undefined ? parent.messages : i`).
 * Поэтому route-провайдер обязан получить `[...CLIENT_SHELL_NAMESPACES, <своё>]`.
 *
 * Список поддерживается в актуальном состоянии проверкой
 * `node scripts/check-client-i18n.mjs` (висит на `bun run lint`).
 */
export const CLIENT_SHELL_NAMESPACES = [
  "common", // Header, BottomNav, ProblemsContent
  "whatsappMessages", // Header, BottomNav, Contact, CleaningPackages, NosotrosCTA, ProblemsContent, DesktopWhatsAppFab
  "calculator", // CalculatorMobile / CalculatorDesktop
  "packages", // CalculatorMobile / CalculatorDesktop, CleaningPackages
  "contact", // Contact
  "contactForm", // ContactForm
  "whyUs", // WhyUs
  "problems", // ProblemsContent
  "homeCta", // HomeCtaBlocks
  "nosotrosCta", // NosotrosCTA
  "tips", // TipsList
  "tienda.cart", // TiendaCartLink — рендерится в шапке магазина
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
