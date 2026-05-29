# AI SEO / AEO / GEO (Generative Engine Optimization)

"AI SEO" is the practice of getting cited by Google AI Overviews, ChatGPT web search, Perplexity, Claude, Gemini. The vocabulary is unsettled — AEO, GEO, LLMO mean roughly the same thing. This file uses **AEO** for the practice and **AI Overviews** for Google's specific surface.

Local Pack rankings and AEO citations are *different distributions*. Optimizing for one doesn't automatically optimize for the other.

## What Google officially says about AI Overviews

Google has not published technical SEO guidance specifically for AI Overviews. The consumer-facing help page covers what they are and where they appear:

> "AI Overviews can take the work out of searching by providing an AI-generated snapshot with key information and links to dig deeper."
> "Google Search is gradually making AI Overviews available to more users, in more languages and regions."
> — [About AI Overviews and AI Mode (Search help)](https://support.google.com/websearch/answer/14901683)

Coverage: 100+ countries, 100+ languages including Spanish (relevant for our Panama traffic), English, Mandarin, etc.

For technical optimization, Google points back to the general guide:

> Focus on "helpful, reliable, people-first content."
> — [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

So our AEO playbook is: do the helpful-content work, ship complete structured data, make authorship visible. There's no "AI Overviews schema" to add.

## What's on the site today for AEO

### `data-ai-summary` sr-only block

In `src/app/[locale]/layout.tsx` and `src/app/(es)/layout.tsx`:

```jsx
<p className="sr-only" aria-hidden="true" data-ai-summary="true">
  24clima — professional air conditioning service in Panama City: installation,
  maintenance, deep cleaning, repair, refrigerant recharge. 24/7. Online cost
  calculator for AC cleaning. Languages: Spanish, English, Russian.
  Contact: WhatsApp +507 6828 2120.
</p>
```

Visually hidden (`sr-only`), but in the rendered DOM. LLMs that ingest the page get a clean factual summary on every render.

Rules:

- Keep this block. The duplication of info is the point — increases the chance LLMs catch the summary.
- Update when business facts change (new service, language, phone).
- Don't translate per-locale — keep in English. English is the common denominator in cross-lingual LLM training corpora.

Caveat from Google: *"Don't mark up content that is not visible to readers."* — [SD policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). The `data-ai-summary` block is **not** structured data; it's plain HTML text inside an `sr-only` element. Screen readers read it, search bots crawl it, sighted users don't see it. This falls outside Google's "structured data must be visible" rule.

### Robots access for AI crawlers

`public/robots.txt` explicitly allows the following user-agents. Vendor-confirmed list:

| Crawler | Purpose | Source |
|---|---|---|
| `Google-Extended` | Controls whether crawled content trains Gemini and supports grounding. Blocking does NOT affect Search inclusion. | [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers) |
| `GPTBot` | OpenAI training crawler | [OpenAI bots docs](https://developers.openai.com/api/docs/bots) **[vendor]** |
| `OAI-SearchBot` | OpenAI ChatGPT search index | same |
| `ChatGPT-User` | On-demand user fetch from ChatGPT | same |
| `ClaudeBot` | Anthropic training | Anthropic help center **[vendor]** |
| `Claude-User` | On-demand user fetch from Claude | same |
| `Claude-SearchBot` | Claude search results | same |
| `PerplexityBot` | Perplexity index | [Perplexity crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) **[vendor]** |
| `Perplexity-User` | User-triggered Perplexity fetch | same |
| `CCBot` | Common Crawl — feeds many LLM training pipelines | [commoncrawl.org](https://commoncrawl.org/ccbot) **[vendor]** |
| `Applebot-Extended` | Apple Intelligence training opt-in | Apple Support **[vendor]** |

**Don't remove any `Allow` lines without explicit instruction**. Blocking trains-only crawlers (`Google-Extended`, `GPTBot`, `ClaudeBot`, `CCBot`) doesn't affect search inclusion; blocking search-facing crawlers (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) means we won't be cited in those products.

OpenAI policy: *"Sites that block this crawler [OAI-SearchBot] won't appear in search results"* — [OpenAI bots docs](https://developers.openai.com/api/docs/bots).

### Schema completeness as AEO signal

LLMs lift facts from JSON-LD. Every facet in schema increases AEO citation likelihood:

- `HVACBusiness` carries phone, area, hours, languages, ratings → surface in answers like *"how can I contact a 24/7 HVAC in Panama City."*
- `Service` per service → surface in *"what's their AC cleaning service."*
- `FAQPage` per service → directly mined as answer candidates (even though Google rich results discontinued — see [json-ld-catalog.md](json-ld-catalog.md) FAQPage section).

This is why [json-ld-catalog.md](json-ld-catalog.md) rules matter for AEO and not just for Google rich results.

## What AEO rewards (operational guidance)

### Factual blocks, not marketing prose

LLMs cite **answerable facts**. *"Premium quality, professional service"* doesn't get quoted. *"Available 24/7 in Costa del Este, response time under 15 minutes"* does.

When writing copy:

- Lead each section with a one-sentence factual claim.
- Put pricing, response time, areas served, languages, service hours in plain text near the top of the relevant section.
- Use numbers, not adjectives. *"+800 hogares"* beats *"many homes."*

This aligns with Google's helpful content guidance:

> "Are you presenting information in a way that makes you want to trust it, such as clear sourcing, evidence of the expertise involved, background about the author?"
> — [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

### Clear page intent

Each page answers one question. URL slug, H1, meta description, and OG title should all be saying the same thing.

| Page | The one question |
|---|---|
| `/` | What does 24clima do and how do I contact them |
| `/servicios/limpieza/` | How does professional AC cleaning in Panama work, what does it cost |
| `/areas-de-servicio/` | Where in Panama City does 24clima operate |
| `/contacto/` | How to reach 24clima |
| `/consejos-y-guias/<slug>` | A specific question (e.g., *"how often clean AC in tropical climate"*) |

### Author and entity signals

`AuthorBio` on every article is non-negotiable for AEO. LLMs weight *who said this*. A `Person` schema with credentials, alumniOf, knowsAbout outperforms anonymous content.

Person schema lives in `src/lib/author-data.ts`. Keep accurate. Don't add fake credentials.

### Stable URLs

Once an LLM indexes a URL as the authoritative source for an answer, breaking that URL = losing the citation until the model retrains (months). Don't rename slugs without a 301 redirect in `middleware.ts`.

## What AEO ignores

- Keyword density. LLMs don't TF-IDF.
- Internal anchor text. (Helpful for traditional SEO, ignored by LLMs.)
- Meta keywords. (Long-dead for traditional SEO too.)
- Backlink counts. (External signals matter for traditional SEO, but LLM citations are content-driven.)

## What can hurt AEO

- **Walls of text without structure** — LLMs sample paragraphs; no signpost = facts diluted.
- **Marketing-only language with no facts** — *"World-class HVAC excellence"* doesn't get cited.
- **Outdated info** — if `aggregateRating` says 11 reviews and Google shows 50, stale signal.
- **Hidden content** via `display: none` on facts — LLMs honor visibility heuristics inconsistently; `sr-only` is the safer pattern.
- **Blocking AI crawlers** via robots.txt or Cloudflare. We don't.

## How to check AEO performance (off-code)

- ChatGPT / Perplexity / Claude: ask *"recomienda un servicio de limpieza de aire acondicionado en Ciudad de Panamá"* and check whether 24clima is cited.
- Google AI Overviews: search the same query (logged in, Panama IP or appropriate VPN) — check whether the answer block cites 24clima.
- Google Search Console: track impressions/clicks for question-shaped queries (*"cómo limpiar aire acondicionado panamá"*) — hints at AI Overview traffic shifts.

When the owner reports *"we got mentioned by [ChatGPT/Perplexity]"* — record it, look at what they cited, double down on that page's facts.

## When you change content

For any meaningful copy change on a page (especially homepage hero, service pages, contact page, FAQ):

- [ ] `data-ai-summary` still accurate (any fact changed in the page also reflected here)
- [ ] H1 / meta title / meta description still aligned
- [ ] Factual claims surfaced near the top of the relevant section
- [ ] Numbers preferred over adjectives
- [ ] No new "premium / world-class / leading" filler
- [ ] FAQ schema Q/A reflect actual customer questions, not marketing
- [ ] `Person` schema on articles still accurate

## Sources used in this file

Google:
- [About AI Overviews and AI Mode (Search help)](https://support.google.com/websearch/answer/14901683)
- [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google common crawlers](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers)

Vendor (non-Google):
- [OpenAI bots docs](https://developers.openai.com/api/docs/bots)
- [Perplexity crawler docs](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Common Crawl CCBot](https://commoncrawl.org/ccbot)
- Anthropic (verify ClaudeBot user-agent on Anthropic's official help page before each robots.txt edit — the public docs URL changes periodically)
