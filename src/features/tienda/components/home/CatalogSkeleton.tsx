/**
 * Заглушка каталога на время стриминга: пока идут запросы к shop-api
 * (товары + категории + бренды), браузер уже получил шапку, H1 и подзаголовок.
 * Повторяет сетку боевого блока (колонка фильтров + грид карточек), чтобы
 * подмена не дёргала макет. Только токены дизайн-системы, без hex.
 */
export function CatalogSkeleton() {
  return (
    <section
      className="flex flex-col gap-8 lg:flex-row lg:gap-10"
      aria-hidden="true"
    >
      <div className="shrink-0 lg:w-64">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-xl bg-muted" />
          <div className="hidden space-y-3 lg:block">
            <div className="h-5 w-24 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
            <div className="h-4 w-4/6 rounded bg-muted" />
            <div className="h-5 w-20 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/5 rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border p-4"
            >
              <div className="aspect-square w-full rounded-lg bg-muted" />
              <div className="mt-4 h-4 w-4/5 rounded bg-muted" />
              <div className="mt-2 h-4 w-3/5 rounded bg-muted" />
              <div className="mt-4 h-6 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
