import { promises as fs } from "fs";
import path from "path";
import { SiteContent } from "@/lib/types";

export async function readFallbackContent(): Promise<SiteContent> {
  const filePath = path.join(process.cwd(), "data", "content.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as SiteContent;
  data.cards = [...data.cards]
    .sort((a, b) => a.order - b.order)
    .map((card, index) => ({
      ...card,
      section: card.section || (index < 3 ? "poster" : "character"),
      linkUrl: card.linkUrl || ""
    }));
  return data;
}
