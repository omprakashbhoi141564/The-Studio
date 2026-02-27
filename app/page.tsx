import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PosterCarousel from "@/components/PosterCarousel";
import CardsGrid from "@/components/CardsGrid";
import Footer from "@/components/Footer";
import { readContent } from "@/lib/content-store";
import { readFallbackContent } from "@/lib/fallback-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let content;

  try {
    content = await readContent();
  } catch (error) {
    console.error("Failed to load DB content on home page. Falling back to local JSON.", error);
    content = await readFallbackContent();
  }

  return (
    <main className="min-h-screen">
      <Header content={content} />
      <Hero content={content} />
      <PosterCarousel cards={content.cards} />
      <CardsGrid content={content} />
      <Footer content={content} />
    </main>
  );
}
