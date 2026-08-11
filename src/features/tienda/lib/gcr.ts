/**
 * Google Customer Reviews («Google Отзывы клиентов») — конфиг и передача данных
 * с чекаута на страницу подтверждения заказа.
 *
 * Модуль запроса согласия обязателен для участия в программе: без него Google не
 * предлагает покупателю оценить компанию. Он рендерится на странице подтверждения
 * и требует order_id, email, delivery_country и estimated_delivery_date.
 *
 * Бэкенд (/v1/orders/{ref}) email и дату доставки не возвращает, поэтому CheckoutForm
 * кладёт их в sessionStorage сразу после создания заказа, а OrderPage читает оттуда.
 * Данные живут только во вкладке покупателя и только до её закрытия — ровно то окно,
 * в котором показывается запрос согласия.
 */

/** Идентификатор продавца в Merchant Center. Публичный, попадает в HTML страницы. */
export const GCR_MERCHANT_ID = 5828751614;

/** Магазин отгружает только по Панаме. ISO 3166-1 alpha-2. */
export const GCR_DELIVERY_COUNTRY = "PA";

/**
 * Ожидаемый срок доставки в днях. Google присылает опрос после этой даты, поэтому
 * заниженное значение даёт опрос до получения товара. Уточнить под реальный SLA.
 */
export const GCR_DELIVERY_ESTIMATE_DAYS = 5;

export type GcrOptInHandoff = {
  email: string;
  /** YYYY-MM-DD — формат, которого ждёт surveyoptin.render. */
  estimatedDeliveryDate: string;
};

function handoffKey(orderId: string): string {
  return `gcr:optin:${orderId}`;
}

/** Дата в формате YYYY-MM-DD через GCR_DELIVERY_ESTIMATE_DAYS дней от `from`. */
export function estimatedDeliveryDate(from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + GCR_DELIVERY_ESTIMATE_DAYS);
  return d.toISOString().slice(0, 10);
}

export function saveOptInHandoff(orderId: string, data: GcrOptInHandoff): void {
  try {
    sessionStorage.setItem(handoffKey(orderId), JSON.stringify(data));
  } catch {
    // Приватный режим или переполненное хранилище — молча пропускаем запрос согласия.
  }
}

export function readOptInHandoff(orderId: string): GcrOptInHandoff | null {
  try {
    const raw = sessionStorage.getItem(handoffKey(orderId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<GcrOptInHandoff>;
    if (!parsed.email || !parsed.estimatedDeliveryDate) return null;
    return {
      email: parsed.email,
      estimatedDeliveryDate: parsed.estimatedDeliveryDate,
    };
  } catch {
    return null;
  }
}
