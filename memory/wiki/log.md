# Журнал операций над вики

Append-only, новые записи сверху.

## [2026-08-10] ingest | установка Memory Compiler (собственная работа)

Источники: `~/Projects/claude-memory-compiler/{README,AGENTS}.md`, гист
Karpathy, фактическая установка на машине.

Создано: `concepts/memory-architecture`. Обновлено: `index.md`,
`concepts/agent-workflow` (добавлен третий слой памяти).

Примечания:
- В `.claude/settings.json` хуки уже были прописаны, но с чужими путями
  `/Users/user/Projects/...` — то есть **не работали**. Починено на `$HOME`.
- В команды добавлен `export PATH="/opt/homebrew/bin:$PATH"`: при
  урезанном PATH `uv` не находился, а провал хука тихий.
- Проверено: SessionStart отдаёт валидный JSON, SessionEnd корректно
  парсит stdin и логирует SKIP на несуществующем транскрипте.
  Полный проход с вызовом LLM не гонялся — сработает штатно при
  завершении реальной сессии.

## [2026-08-10] ingest | PROJECT_MEMORY.md + CLAUDE.md

Первичное засеивание вики при установке паттерна LLM Wiki.

Создано 11 страниц: `entities/{24clima,ryhor-baranchuk}`,
`concepts/{seo-monitoring-system,protected-seo-elements,i18n-dual-route-tree,service-pricing,mobile-app-like,design-system-package,agent-workflow}`,
`sources/project-memory`, `synthesis/gotchas`, плюс `index.md`.

Примечания:
- Знание взято из журнала сессий (406 строк) и корневого `CLAUDE.md`;
  утверждения про код не перепроверялись построчно — при расхождении
  побеждает проверка в репозитории.
- Не заингещены: `DESIGN.md`, `docs/**`, скиллы `.agents/skills/**` —
  вынесены в раздел «Пробелы» индекса.
- Добавлен факт вне `PROJECT_MEMORY.md`: локальный
  `SUPABASE_SERVICE_ROLE_KEY` пуст (проверено 2026-08-10 при попытке
  прочитать `seo_gsc_daily` по REST — 401 «Invalid API key»).

## 2026-08-11 — ingest локальной памяти Claude (машина 1) + политика памяти

Перенос долговременных проектных фактов из машинно-локальной авто-памяти
Claude Code в вики (решение по консультации codex: repo-память —
единственный источник истины, локальная — не-authoritative кэш):

- `synthesis/gotchas.md`: +6 граблей (№13–18 — Node 25 localStorage-стаб,
  React #482, анимация recharts, `gh pr merge --delete-branch`,
  сквош-мерж прячет merged-ветки, мёртвый лок worktree).
- Новая страница `concepts/hvac-customer-segments.md` — 4+1 сегмент
  «hvac»-поиска + Panamá Oeste (исследование 2026-05-29).
- `concepts/seo-monitoring-system.md`: снято устаревшее «миграция 006 не
  применена»; добавлен фикс тоталов GSC (PR #25, `seo_gsc_totals`).
- В `memory/CLAUDE.md` — политика источника истины + каталог `inbox/`
  (черновики, .gitignore, в вики только через явный ingest).
- Cursor выведен из проекта: `.cursor/rules/` удалён из репо.

Не перенесено сознательно: личные предпочтения владельца и правила
взаимодействия с конкретным агентом — остаются в локальной памяти машин.
