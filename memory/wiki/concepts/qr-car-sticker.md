---
type: concept
title: QR-наклейка на авто и роут /qr
updated: 2026-08-28
sources: [PR #64, src/app/qr/route.ts, supabase/migrations/008_qr_scans.sql, ревью Codex 2026-08-27, PROJECT_MEMORY.md]
related: [concepts/portable-ac-business, concepts/supabase-projects, concepts/i18n-dual-route-tree, synthesis/gotchas]
status: current
---

## Суть

Наклейка на заднее стекло авто владельца (Lexus RX350) несёт QR, который
кодирует `https://24clima.com/qr` — серверный 302-редирект в WhatsApp.
Прослойка вместо «голого» wa.me в QR — осознанное решение: напечатанный
винил не переделать, а назначение `/qr` меняется одной строкой, плюс каждый
скан логируется.

## Факты

- **Роут:** `src/app/qr/route.ts` — `force-dynamic`, `runtime nodejs`;
  302 → `wa.me/50768282120?text=…` («Hola, vi el QR del auto de 24clima y
  quiero una cotización»). Телефон в wa.me — только цифры, без «+».
- **Логирование не блокирует редирект:** insert в Supabase выполняется в
  `after()` из `next/server` (Next ≥15.1) — после отправки ответа.
  Fire-and-forget без `after()` на Vercel ненадёжен (функция замораживается),
  а await с таймаутом задерживает редирект — обе альтернативы отклонены
  (Codex, 2026-08-27). Без env-переменных роут — no-op по логам, редирект
  работает всегда.
- **`/qr` исключён из middleware через matcher** (negative lookahead
  `qr/?$`), не через runtime-код: иначе next-intl перепишет путь в
  локализованный, а слэш-нормализация даст лишний 308. Матчер покрывает
  и `/qr`, и `/qr/` (trailingSlash: true).
- **Таблица `qr_scans`** (миграция 008, применена 2026-08-28 через SQL
  editor): scanned_at, user_agent, referrer, country
  (`x-vercel-ip-country`), `source` default `'car-sticker'` — под будущие
  QR-носители (флаеры, визитки). НЕ содержит контактных данных — владелец
  спрашивал явно. RLS включён без политик: пишет только service-role.
- **QR на макете:** 34 см, чёрный на белом (не navy — микроперфорация
  съедает модули), error correction H, quiet zone 4 модуля. До тиража —
  тест-образец на самой плёнке (сканировать с 3–4 м).
- **Дизайн наклейки** (артефакт `9f202ab5-3091-42c8-b14f-884c0527a3c9`,
  JPG `~/Downloads/calcomania-24clima-140x76.jpg`, 1 px = 1 мм): концепция
  «подменный аппарат как герой» — «No te dejamos pasando calor». Выбрана
  из 5 концепций Codex (диагноз v1: «продаёт слишком много сразу; в
  трафике читают бренд + одну идею + телефон»).

## Открытое

- Прод-проверка после деплоя PR #64: скан → WhatsApp, строка в qr_scans.
- Uptime-мониторинг `/qr` (404 на напечатанном виниле не исправить).

## Связи

- [Ниша портативных кондиционеров](portable-ac-business.md) — наклейка продаёт подменный сервис.
- [Supabase-проекты](supabase-projects.md) — qr_scans в базе сайта.
- [Двойное дерево роутов](i18n-dual-route-tree.md) — почему /qr вне [locale].
