import { NextResponse } from "next/server";
import { getAdminPassword, getSessionCookieName, getSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };

  if (!body.password || body.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(getSessionCookieName(), getSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return res;
}
