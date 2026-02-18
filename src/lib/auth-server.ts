/**
 * Server-only auth helpers for API routes and server actions.
 * Do not import in client components.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const ADMIN_EMAILS = process.env.ADMIN_EMAILS ?? "";

/** Parse comma-separated admin emails (lowercase, trimmed). */
function getAdminEmails(): string[] {
  return ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

/** Create Supabase client with service_role (server only). Use for admin checks. */
export function createServerSupabaseAdmin(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/** Supabase project ref from URL (e.g. https://abc.supabase.co -> abc). */
function getSupabaseProjectRef(): string {
  try {
    const u = new URL(SUPABASE_URL);
    return u.hostname.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

/**
 * Get access token from request: Authorization Bearer or cookie sb-<ref>-auth-token.
 */
export function getAccessTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim() || null;
  const ref = getSupabaseProjectRef();
  if (!ref) return null;
  const cookieName = `sb-${ref}-auth-token`;
  const cookie = req.cookies.get(cookieName)?.value;
  if (!cookie) return null;
  try {
    const payload = JSON.parse(decodeURIComponent(cookie));
    return payload?.access_token ?? null;
  } catch {
    return null;
  }
}

/**
 * Verify JWT and return user (id, email). Uses anon client.
 */
export async function getUserFromAccessToken(accessToken: string): Promise<{ id: string; email?: string } | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error } = await client.auth.getUser(accessToken);
  if (error || !user) return null;
  return { id: user.id, email: user.email ?? undefined };
}

/**
 * Check if user is admin: by admins table (service_role) or by ADMIN_EMAILS.
 */
export async function isAdmin(userId: string, email?: string): Promise<boolean> {
  const adminClient = createServerSupabaseAdmin();
  if (adminClient) {
    const { data } = await adminClient.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
    if (data) return true;
  }
  const allowed = getAdminEmails();
  if (allowed.length && email) return allowed.includes(email.trim().toLowerCase());
  return false;
}

/**
 * Require authenticated admin for API route. Returns { user } or { error, status }.
 */
export async function requireAdmin(req: NextRequest): Promise<
  | { user: { id: string; email?: string } }
  | { error: string; status: number }
> {
  const token = getAccessTokenFromRequest(req);
  if (!token) return { error: "Unauthorized", status: 401 };
  const user = await getUserFromAccessToken(token);
  if (!user) return { error: "Invalid or expired token", status: 401 };
  const ok = await isAdmin(user.id, user.email);
  if (!ok) return { error: "Forbidden", status: 403 };
  return { user };
}
