# Настройка раздела «Советы и Руководства» и админки

## 1. Создание проекта Supabase

1. Зайдите на [supabase.com](https://supabase.com) и создайте проект.
2. В **Settings → API** скопируйте:
   - **Project URL** (например, `https://xxxx.supabase.co`)
   - **anon public** key

## 2. Переменные окружения

Добавьте в `.env.local` (локально) и в Vercel (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 3. База данных

В Supabase откройте **SQL Editor** и выполните по порядку:

1. `supabase/migrations/001_articles.sql`
2. `supabase/migrations/002_admins_rls.sql` (ограничение прав: только пользователи из таблицы `admins` могут создавать/редактировать/удалять статьи)

## 4. Storage для изображений

1. В Supabase: **Storage** → **New bucket**
2. Имя: `article-images`
3. **Public bucket**: включить (чтобы картинки отображались на сайте)
4. **Storage → Policies** для bucket `article-images`:
   - После миграции **002_admins_rls** рекомендуется ограничить загрузку только админами. В **SQL Editor** можно создать политику (если управляете политиками через SQL):
     - Удалите старую политику с `auth.role() = 'authenticated'`.
     - Создайте политику: `bucket_id = 'article-images'` и `exists (select 1 from public.admins a where a.user_id = auth.uid())` для INSERT/UPDATE.
   - Или в Dashboard: Policy с условием, что `auth.uid()` есть в `public.admins` (через RPC или вручную).

## 5. Администратор

1. В Supabase: **Authentication** → **Users** → **Add user**
2. Укажите **Email** и **Password** (логин и пароль для входа в админку)
3. **Create user**
4. **Обязательно после миграции 002:** добавьте этого пользователя в таблицу админов. В **SQL Editor** выполните (подставьте реальный UUID пользователя из **Authentication → Users**):
   ```sql
   insert into public.admins (user_id) values ('uuid-пользователя-из-auth-users');
   ```

Пароль хранится только в Supabase, в коде проекта его нет. Без строки в `public.admins` пользователь не сможет сохранять или удалять статьи (RLS).

**Рекомендуемые настройки Supabase:**
- **Authentication → Providers → Email:** при необходимости отключите публичную регистрацию (Disable sign ups) или используйте Invite only.
- **RLS:** включён для `articles` и `admins`; политики описаны в миграциях.

## 6. Перевод статей (опционально)

Для автоматического перевода RU → ES/EN при сохранении статьи:

1. Включите [Google Cloud Translation API](https://console.cloud.google.com/apis/library/translate.googleapis.com)
2. Создайте API-ключ
3. Добавьте переменную окружения:
   ```
   GOOGLE_TRANSLATE_API_KEY=ваш_ключ
   ```

Без ключа статья сохраняется только на русском; переводы можно добавить вручную позже.

## 7. Страницы

- **Советы и Руководства (публичная):** `/es/consejos-y-guias/`, `/en/consejos-y-guias/`, `/ru/consejos-y-guias/`
- **Админка:** `/es/consejos-y-guias/admin/`, `/en/consejos-y-guias/admin/`, `/ru/consejos-y-guias/admin/`

## 8. Важно

- **output: 'export'** отключён: проект использует сервер (API routes, динамические страницы).
- Деплой на Vercel — обычный `next build`, API routes и страницы tips будут работать.
