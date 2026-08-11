// Разовый backfill таблицы seo_gsc_totals: дневные тоталы GSC (dimensions=["date"],
// без query-дименсии — эти цифры совпадают с UI Search Console) за последние
// 16 месяцев (максимум, который хранит GSC API). Идемпотентен: upsert по date.
//
// Запуск локально из корня репо (нужны .env.local с GOOGLE_SA_KEY_BASE64,
// GSC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY):
//   node scripts/backfill-gsc-totals.mjs
import { readFileSync } from "node:fs";
import { JWT } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

const env = { ...process.env };
try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
} catch {
  /* нет .env.local — полагаемся на process.env */
}

for (const key of [
  "GOOGLE_SA_KEY_BASE64",
  "GSC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
]) {
  if (!env[key]) {
    console.error(`Missing env: ${key}`);
    process.exit(1);
  }
}

const sa = JSON.parse(Buffer.from(env.GOOGLE_SA_KEY_BASE64, "base64").toString("utf8"));
const jwt = new JWT({
  email: sa.client_email,
  key: sa.private_key,
  scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
});
const { token } = await jwt.getAccessToken();

const ymd = (d) => d.toISOString().slice(0, 10);
const today = new Date();
const end = new Date(today);
end.setUTCDate(end.getUTCDate() - 2); // свежее не бывает в dataState=final
const start = new Date(today);
start.setUTCMonth(start.getUTCMonth() - 16);

const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
  env.GSC_SITE_URL,
)}/searchAnalytics/query`;
const res = await fetch(endpoint, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    startDate: ymd(start),
    endDate: ymd(end),
    dimensions: ["date"],
    dataState: "final",
    rowLimit: 25000, // 16 месяцев = ~490 строк, одна страница
  }),
});
if (!res.ok) {
  console.error(`GSC HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
const rows = (await res.json()).rows ?? [];
console.log(`GSC вернул ${rows.length} дней (${ymd(start)}..${ymd(end)})`);

const now = new Date().toISOString();
const mapped = rows.map((r) => ({
  date: r.keys[0],
  clicks: Math.round(r.clicks ?? 0),
  impressions: Math.round(r.impressions ?? 0),
  ctr: r.ctr ?? 0,
  position: r.position ?? 0,
  updated_at: now,
}));

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
for (let i = 0; i < mapped.length; i += 500) {
  const chunk = mapped.slice(i, i + 500);
  const { error } = await supabase
    .from("seo_gsc_totals")
    .upsert(chunk, { onConflict: "date", ignoreDuplicates: false });
  if (error) {
    console.error(`upsert failed at chunk ${i}: ${error.message}`);
    process.exit(1);
  }
  console.log(`upserted ${i + chunk.length}/${mapped.length}`);
}
const totalClicks = mapped.reduce((s, r) => s + r.clicks, 0);
const totalImpr = mapped.reduce((s, r) => s + r.impressions, 0);
console.log(`Готово: ${mapped.length} строк, суммарно ${totalClicks} кликов / ${totalImpr} показов.`);
