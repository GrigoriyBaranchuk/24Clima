# Sitemap & robots.txt

How our sitemap and robots are shaped, what Google's current limits are, and the AI-crawler user-agents we're allowing — with vendor-confirmed citations.

## Sitemap

### Google's limits

> "All formats limit a single sitemap to **50MB (uncompressed) or 50,000 URLs**."
> — [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

> "Google uses the `<lastmod>` value if it's consistently and verifiably (for example by comparing to the last modification of the page) accurate."
> — same source

Google **ignores**:

> "`<changefreq>` ... Google ignores this attribute."
> "`<priority>` ... ignored by Google."
> — same source

### Sitemap index limits

> "A sitemap index file allows you to include multiple sitemap files in one. ... The size of a single sitemap file must be less than 50MB ... The number of sitemap files referenced in a sitemap index file must be less than 50,000."
> — [Large sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)

We have one sitemap. We're nowhere near the limits and shouldn't be in the foreseeable future (the site has ~30–50 URLs across services, areas, blog).

### Our setup

`src/app/sitemap.ts` is dynamic. Per URL it emits:

- `url` — localized absolute URL with trailing slash
- `lastModified` — from Supabase for articles (`updated_at`), `new Date()` for static pages
- `alternates.languages` — full hreflang map (es/en/ru + x-default)

Per Google: hreflang inside the sitemap is fully supported:

> "You can use an XML sitemap to tell Google all of the language and region variants for each URL."
> — [Localized versions docs](https://developers.google.com/search/docs/specialty/international/localized-versions)

### Rules for changes

- Don't introduce `<priority>` or `<changefreq>` — Google ignores them.
- `<lastmod>` must be truthful. Don't update it as "now" on every build for pages that haven't actually changed — Google may de-weight `<lastmod>` if it sees it constantly updated without content change.
- Trailing slash on every URL (matches `trailingSlash: true` in `next.config.js`).
- All URLs `https://24clima.com/...` — never `http://`, never bare `24clima.com`.
- When you add a new route, add it to `sitemap.ts` *and* make sure `generateMetadata()` on that route emits matching `alternates`.

## robots.txt

> "The robots.txt file must be located at the root of the site host."
> "Each group begins with a `User-agent` line that specifies the target of the groups."
> "Rules are case-sensitive."
> — [Create a robots.txt file](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt)

Location: `public/robots.txt` → served at `https://24clima.com/robots.txt`.

### Google's own crawlers

From [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers):

| User-agent token | Purpose |
|---|---|
| `Googlebot` | Desktop + smartphone (post-mobile-first the smartphone variant is primary) |
| `Googlebot-Image` | Image Search |
| `Googlebot-Video` | Video Search |
| `Googlebot-News` | Google News |
| `Storebot-Google` | Shopping surfaces |
| `Google-InspectionTool` | Search Console URL Inspection — doesn't affect ranking |
| `GoogleOther` / `GoogleOther-Image` / `GoogleOther-Video` | General-purpose internal use |
| `Google-Extended` | "Controls whether crawled content trains Gemini models and supports grounding; doesn't impact Search inclusion" |
| `Google-CloudVertexBot` | Vertex AI Agent platform |

**Key point**: blocking `Google-Extended` does NOT remove the site from Google Search. It only opts out of Gemini training and grounding. Same applies for `OAI-SearchBot` vs `GPTBot` (search vs training).

### AI crawlers we allow

The current `robots.txt` allows these user-agents explicitly. Vendor-confirmed list (re-verify before robots.txt edits — some vendors rotate UAs):

| User-agent | Vendor | Purpose | Source |
|---|---|---|---|
| `GPTBot` | OpenAI | Training | [OpenAI bots docs](https://developers.openai.com/api/docs/bots) **[vendor]** |
| `OAI-SearchBot` | OpenAI | ChatGPT search index. **Blocking removes site from ChatGPT search results.** | same |
| `ChatGPT-User` | OpenAI | On-demand user fetch from ChatGPT (robots.txt rules may not apply per OpenAI policy) | same |
| `ClaudeBot` | Anthropic | Training | Anthropic help center **[vendor]** |
| `Claude-User` | Anthropic | On-demand user fetch from Claude | same |
| `Claude-SearchBot` | Anthropic | Claude search results | same |
| `PerplexityBot` | Perplexity | Index | [Perplexity crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) **[vendor]** |
| `Perplexity-User` | Perplexity | On-demand user fetch | same |
| `CCBot` | Common Crawl | Feeds many downstream LLM training pipelines | [commoncrawl.org](https://commoncrawl.org/ccbot) **[vendor]** |
| `Google-Extended` | Google | Gemini training opt-in | [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers) |
| `Applebot-Extended` | Apple | Apple Intelligence training opt-in | Apple Support **[vendor]** |

> "Sites that block this crawler [OAI-SearchBot] won't appear in search results."
> — [OpenAI bots docs](https://developers.openai.com/api/docs/bots)

Equivalent statements exist (in different wording) from Anthropic and Perplexity for their search-facing bots.

### Why we allow all of them

- **Trains-only bots** (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`): allowing them increases the chance that the next generation of LLMs has accurate facts about 24clima in its training corpus. Cost: the operator allows our content to be used for AI training. Owner has explicitly opted into this.
- **Search-facing bots** (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`): blocking these removes us from those products' search results. We don't want that — those products refer real customer traffic.
- **On-demand fetch bots** (`ChatGPT-User`, `Claude-User`, `Perplexity-User`): these fetch a single URL when a user pastes it into the LLM or asks the LLM to look at it. Blocking them prevents users from getting accurate, up-to-date summaries — bad UX.

### When you'd block one

- An LLM vendor publicly misrepresents 24clima's services or pricing despite accurate on-site facts → consider blocking that vendor's training bot.
- A bot is hammering the origin and bypassing crawl budget controls → use `Crawl-delay` (note Google doesn't honor this; most AI bots do).
- The owner explicitly requests opt-out for one vendor.

Don't unilaterally remove `Allow` lines. Flag to the owner first.

### Sitemap discovery

> "Sitemap location can be specified in robots.txt using the `Sitemap:` directive."
> — [Build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

Our `robots.txt` declares:

```
Sitemap: https://24clima.com/sitemap.xml
```

Don't remove. Google Search Console submission is a separate channel.

## Pre-merge sitemap/robots checklist

- [ ] No `<priority>` or `<changefreq>` introduced
- [ ] `<lastmod>` reflects real page modification time (not build time)
- [ ] New routes added to `sitemap.ts`
- [ ] All sitemap URLs `https://`, trailing slash
- [ ] No `Disallow` lines added without explicit owner instruction
- [ ] AI crawler `Allow` lines intact
- [ ] `Sitemap:` directive in `robots.txt` intact
- [ ] Sitemap renders: `curl https://24clima.com/sitemap.xml` returns valid XML

## Sources used in this file

Google:
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Large sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Create a robots.txt file](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt)
- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)

Vendor:
- [OpenAI bots docs](https://developers.openai.com/api/docs/bots) — GPTBot, OAI-SearchBot, ChatGPT-User
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) — PerplexityBot, Perplexity-User
- [Common Crawl](https://commoncrawl.org/ccbot) — CCBot
- Anthropic & Apple — official URLs change periodically; verify before edits
