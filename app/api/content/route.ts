import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content-store";
import { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await readContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as SiteContent;

  const normalized = {
    ...body,
    cards: [...body.cards]
      .sort((a, b) => a.order - b.order)
      .map((card, index) => ({ ...card, order: index + 1 }))
  };

  await writeContent(normalized);
  return NextResponse.json({ content: normalized });
}
