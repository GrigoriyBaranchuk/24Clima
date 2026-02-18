# Отчёт: Enterprise-оптимизация (Performance, Security, Quality)

## 1. Таблица Before / After

### Lighthouse (ручной замер)

Рекомендуется снять метрики вручную до и после деплоя (DevTools → Lighthouse, режим Navigation, главная `/es/`).

| Метрика            | Before (baseline) | After (ожидаемо)     | Примечание |
|--------------------|-------------------|----------------------|------------|
| Performance        | измерить          | не хуже / лучше      | lazyOnload скриптов, один priority image |
| LCP                 | измерить          | не хуже              | Hero: priority + sizes; без unoptimized на Vercel |
| CLS                | измерить          | без регрессии        | next/font уже используется |
| INP / TBT          | измерить          | не хуже              | меньше конкуренции за main thread |
| Transfer Size      | измерить          | не хуже              | next/image optimization на Vercel |

### Next.js build (chunk sizes)

| Сборка  | First Load shared | Biggest chunks              | Страницы (First Load JS)   |
|---------|--------------------|----------------------------|----------------------------|
| Before  | 101 kB             | 53.2 kB, 46.1 kB           | [locale] 184 kB, admin 226 kB |
| After   | 101 kB             | 53.2 kB, 46.1 kB           | без изменений (минимально инвазивно) |

---

## 2. Список проблем P0/P1/P2 (с путями)

| Приоритет | Проблема | Файл / место |
|-----------|----------|--------------|
| P0        | Любой authenticated пользователь мог делать CRUD по статьям | RLS в `001_articles.sql` |
| P0        | API `/api/translate` без проверки прав и лимитов | `src/app/api/translate/route.ts` |
| P0        | Нет security headers и CSP | `next.config.js` |
| P0        | `images.unoptimized: true` отключало оптимизацию на Vercel | `next.config.js` |
| P1        | Два priority-изображения (Header logo + Hero) | `Header.tsx`, `Hero.tsx` |
| P1        | Аналитика загружалась afterInteractive | `GoogleAnalytics.tsx`, `MetaPixel.tsx`, `YandexMetrika.tsx` |
| P1        | Нет явного sizes у LCP-изображения Hero | `Hero.tsx` |
| P2        | ESLint: useEffect missing dependency в админке | `admin/page.tsx` |
| P2        | В репо не зафиксированы output/, deploy.zip, static-site.zip | `.gitignore` |

---

## 3. Список изменений (файл → что сделано → зачем)

| Файл | Что сделано | Зачем |
|------|-------------|--------|
| `.gitignore` | Добавлены `/output/`, `deploy.zip`, `static-site.zip` | Не коммитить артефакты сборки и деплоя |
| `next.config.js` | Удалён `images.unoptimized: true` | Включить next/image optimization на Vercel |
| `next.config.js` | Сокращены `remotePatterns`: только `images.unsplash.com` и `*.supabase.co` (storage) | Только реально используемые домены |
| `next.config.js` | Добавлен `async headers()`: X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP | Безопасность (enterprise) |
| `src/components/Hero.tsx` | У Hero-изображения добавлен `sizes="(max-width: 1024px) 0px, 50vw"` | Корректный sizes для LCP |
| `src/components/Header.tsx` | У логотипа убран `priority` | Один priority только у LCP (Hero) |
| `src/app/[locale]/servicios/[service]/page.tsx` | У hero-изображения добавлен `sizes`, убран `priority` | Не конкурировать с главной за LCP; ниже первого экрана |
| `src/components/GoogleAnalytics.tsx` | `strategy="lazyOnload"` | Не блокировать LCP |
| `src/components/MetaPixel.tsx` | `strategy="lazyOnload"` | То же |
| `src/components/YandexMetrika.tsx` | `strategy="lazyOnload"` | То же |
| `src/app/[locale]/consejos-y-guias/admin/page.tsx` | `fetchArticles` обёрнут в `useCallback`, зависимость в `useEffect` | Убрать предупреждение ESLint react-hooks/exhaustive-deps |
| `src/lib/auth-server.ts` | Новый модуль: `getAccessTokenFromRequest`, `getUserFromAccessToken`, `isAdmin`, `requireAdmin` | Серверная проверка админа для API (cookie/Bearer + admins table / ADMIN_EMAILS) |
| `src/app/api/translate/route.ts` | Проверка `requireAdmin`, лимит тела 8KB, валидация text/target, target только es/en, длина text ≤5000 | Защита платного API и ограничение злоупотреблений |
| `supabase/migrations/002_admins_rls.sql` | Таблица `public.admins`, новые RLS-политики для articles (только admins) | Только явные админы могут менять статьи |
| `.env.example` | Добавлены NEXT_PUBLIC_SUPABASE_*, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS, GOOGLE_TRANSLATE_API_KEY | Документация env без секретов в репо |
| `docs/SETUP_TIPS_ADMIN.md` | Описание миграции 002, шаг «добавить user в admins», рекомендации RLS/Signups, Storage | Корректная настройка админки и Supabase |

---

## 4. Supabase: изменения и рекомендации

### SQL (таблица admins и RLS)

Выполнить в Supabase **SQL Editor** после `001_articles.sql`:

- Файл: `supabase/migrations/002_admins_rls.sql`

Кратко:

1. Создаётся таблица `public.admins (user_id uuid primary key references auth.users(id) on delete cascade)`.
2. Включается RLS на `admins`.
3. Удаляются старые политики на `articles` (Admin insert/update/delete).
4. Создаются новые политики: insert/update/delete только при `exists (select 1 from public.admins a where a.user_id = auth.uid())`.

### Добавление первого админа

После создания пользователя в **Authentication → Users** выполнить (подставить реальный UUID):

```sql
insert into public.admins (user_id) values ('uuid-пользователя-из-auth-users');
```

### Рекомендации по Dashboard

- **RLS:** включён для `articles` и `admins` (миграции).
- **Signups:** в **Authentication → Providers → Email** при необходимости отключить публичную регистрацию или использовать Invite only.
- **Storage (article-images):** после 002 политику загрузки лучше ограничить админами (условие через `public.admins`), см. комментарии в `002_admins_rls.sql` и `docs/SETUP_TIPS_ADMIN.md`.

---

## 5. .env.example (без секретов)

Актуальный список переменных — в корне проекта файл `.env.example`. В репозитории не должны попадать:

- `.env`, `.env.local`, `SUPABASE_SERVICE_ROLE_KEY`, реальные ключи и пароли.

---

## 6. Ручной тест-план (5–10 шагов)

1. **Главная**  
   Открыть `/{locale}/` (es/en/ru). Убедиться: логотип, Hero, блоки услуг, контакты, футер отображаются без ошибок.

2. **Советы и руководства**  
   Открыть `/{locale}/consejos-y-guias/`. Список статей загружается (или пустой, если БД пуста).

3. **Статья**  
   Открыть любую статью по slug. Контент и изображения (если есть) отображаются.

4. **Сервисы**  
   Открыть `/{locale}/servicios/cleaning/` (и при необходимости другие услуги). Hero и контент без ошибок.

5. **Админка — вход**  
   Открыть `/{locale}/consejos-y-guias/admin/`. Войти под пользователем, чей `user_id` добавлен в `public.admins`. Убедиться, что список статей и форма доступны.

6. **Админка — сохранение**  
   Создать/изменить статью и сохранить. Проверить, что запись появляется/обновляется в списке и на публичной странице статьи.

7. **Админка — без прав**  
   Войти под пользователем, которого **нет** в `public.admins`. Убедиться, что сохранение/удаление статей запрещено (ошибка от Supabase/RLS).

8. **API translate**  
   Вызвать `POST /api/translate` без заголовка Authorization: ответ 401. С заголовком `Authorization: Bearer <access_token>` админа и телом `{"text":"тест","target":"es"}`: ответ 200 и поле `translated`.

9. **Security headers**  
   В DevTools → Network открыть главную, проверить ответ: заголовки `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Content-Security-Policy` присутствуют.

10. **Lighthouse**  
    Запустить Lighthouse по главной `/es/`. Сравнить Performance, LCP, CLS с baseline (см. п. 1 отчёта).
