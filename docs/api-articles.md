# Articles Publishing API

Server-to-server API for a partner SaaS to publish articles to 24clima.com.
Articles are stored in the `articles` table and rendered at
`/consejos-y-guias/<slug>` (and `/en/...`, `/ru/...`).

## Authentication

All requests must include a static shared secret as a Bearer token:

```
Authorization: Bearer <ARTICLES_API_SECRET>
```

The secret is configured server-side via the `ARTICLES_API_SECRET` environment
variable. Without a valid token the API returns `401`.

## Content format

`content_*` fields are **GitHub-flavored Markdown — not HTML.**

- Raw HTML is **not** rendered; it is escaped and shown as plain text.
- Headings (`## ...`, `### ...`) split the article into visual sections.
- To place an uploaded image inside the body, use the placeholder `[[IMAGE_n]]`,
  where `n` is **1-based** and maps to `image_urls[n-1]`. Any images not
  referenced by a placeholder are appended in a gallery at the end.

> **Trailing slash:** the canonical path is `/api/articles/` (with a trailing
> slash). A request to `/api/articles` returns a `308` redirect to it — send the
> request directly to `/api/articles/`, or follow redirects preserving the method/body.

## `POST /api/articles/`

Creates or updates an article. **Idempotent upsert by `slug`** — calling it
again with the same `slug` overwrites the existing article.

> **Full replacement:** the request body represents the complete article. Any
> optional field you omit (`title_ru`, `title_en`, `content_en`, `image_urls`)
> is reset to its default and **clears** the previous value. Always send the
> full article, not a partial patch.

### Body (JSON)

| Field         | Type       | Required | Notes                                                        |
|---------------|------------|----------|--------------------------------------------------------------|
| `slug`        | string     | yes      | Normalized to `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 3–120 chars       |
| `title_es`    | string     | yes      | ≤ 200 chars (Spanish — the site's primary language)          |
| `content_es`  | string     | yes      | Markdown, ≤ 200 000 chars                                    |
| `title_ru`    | string     | no       | ≤ 200 chars; defaults to `title_es` if omitted               |
| `content_ru`  | string     | no       | Markdown, ≤ 200 000 chars; defaults to `content_es` if omitted |
| `title_en`    | string     | no       | ≤ 200 chars                                                  |
| `content_en`  | string     | no       | Markdown, ≤ 200 000 chars                                    |
| `image_urls`  | string[]   | no       | ≤ 20 items, each an `https://` URL                          |

Total request body is limited to ~1 MB.

> **Why Spanish is required:** 24clima.com is a Spanish-language site. An article
> only appears on the main site (and its listing) when `title_es`/`content_es`
> are present. If you omit the Russian fields they are filled with the Spanish
> text so the `/ru/` version falls back to Spanish.

### Responses

- `200` — `{ "ok": true, "slug": "<slug>" }`
- `400` — validation error: `{ "error": "..." }`
- `401` — missing/invalid token
- `413` — payload too large
- `500` — storage not configured / database error

### Example

```bash
curl -X POST https://24clima.com/api/articles/ \
  -H "Authorization: Bearer $ARTICLES_API_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "como-elegir-aire-acondicionado",
    "title_es": "Cómo elegir un aire acondicionado",
    "content_es": "## Introducción\n\nContenido del artículo.\n\n[[IMAGE_1]]",
    "image_urls": ["https://24clima.com/uploads/page1-opt.webp"]
  }'
```

## `DELETE /api/articles/:slug/`

Deletes an article by slug. **Idempotent** — deleting a non-existent slug also
returns `200`.

### Responses

- `200` — `{ "ok": true, "slug": "<slug>" }`
- `400` — invalid slug
- `401` — missing/invalid token
- `500` — storage not configured / database error

### Example

```bash
curl -X DELETE https://24clima.com/api/articles/como-elegir-aire-acondicionado \
  -H "Authorization: Bearer $ARTICLES_API_SECRET"
```

## Notes

- Writes use the Supabase `service_role` key on the server and bypass RLS; the
  shared secret is the only authorization layer, so keep it secret.
- SEO metadata, JSON-LD, canonical URLs and sitemap for each article are
  generated automatically by the article page from the stored fields.
