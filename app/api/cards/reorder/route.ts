import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content-store";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { cardId?: string; direction?: "up" | "down" };
  if (!body.cardId || !body.direction) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const content = await readContent();
  const cards = [...content.cards].sort((a, b) => a.order - b.order);
  const index = cards.findIndex((card) => card.id === body.cardId);

  if (index === -1) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const swapIndex = body.direction === "up" ? index - 1 : index + 1;

  if (swapIndex < 0 || swapIndex >= cards.length) {
    return NextResponse.json({ content });
  }

  [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  content.cards = cards.map((card, i) => ({ ...card, order: i + 1 }));
  await writeContent(content);

  return NextResponse.json({ content });
}
