import { cookies } from "next/headers";

const SESSION_COOKIE = "studio_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function getSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN || "dev-session-token";
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token === getSessionToken();
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}
