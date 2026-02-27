import { NextResponse } from "next/server";
import { createCardId, readContent, writeContent } from "@/lib/content-store";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    title?: string;
    description?: string;
    image?: string;
  };

  if (!body.title || !body.description || !body.image) {
    return NextResponse.json({ error: "Missing required card fields" }, { status: 400 });
  }

  const content = await readContent();

  content.cards.push({
    id: createCardId(),
    title: body.title,
    description: body.description,
    image: body.image,
    order: content.cards.length + 1
  });

  await writeContent(content);

  return NextResponse.json({ content });
}

export async function DELETE(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing card id" }, { status: 400 });
  }

  const content = await readContent();
  content.cards = content.cards
    .filter((card) => card.id !== id)
    .map((card, index) => ({ ...card, order: index + 1 }));

  await writeContent(content);

  return NextResponse.json({ content });
}
