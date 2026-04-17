import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CRON_SECRET = process.env.CRON_SECRET;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  time?: number; // seconds since epoch
  relative_time_description?: string;
  profile_photo_url?: string;
};

type PlaceDetailsResponse = {
  result?: {
    reviews?: GoogleReview[];
  };
  status?: string;
  error_message?: string;
};

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = req.headers.get("x-cron-secret");
  const secret = bearer ?? headerSecret ?? null;
  return !!CRON_SECRET && secret === CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
    return NextResponse.json(
      { error: "GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set" },
      { status: 503 }
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 }
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", GOOGLE_PLACE_ID);
  url.searchParams.set("fields", "name,reviews");
  url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

  let res: Response;
  try {
    res = await fetch(url.toString());
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to fetch Place Details", details: String(e) },
      { status: 502 }
    );
  }

  const data = (await res.json()) as PlaceDetailsResponse;
  if (data.status !== "OK" || !data.result?.reviews?.length) {
    return NextResponse.json({
      ok: true,
      synced: 0,
      message: data.error_message || "No reviews in response",
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const rows = data.result.reviews.map((r) => ({
    author_name: r.author_name || "Anonymous",
    author_photo_url: r.profile_photo_url || null,
    text: r.text || "",
    rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
    time: r.time ? new Date(r.time * 1000).toISOString() : new Date().toISOString(),
  }));

  let upserted = 0;
  for (const row of rows) {
    const { error } = await supabase.from("reviews").upsert(row, {
      onConflict: "author_name,time",
      ignoreDuplicates: false,
    });
    if (!error) upserted++;
  }

  return NextResponse.json({ ok: true, synced: upserted, total: rows.length });
}
