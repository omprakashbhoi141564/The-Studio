import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
      <section id="about" className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">About Us</h2>
        <p className="mt-3 max-w-3xl text-stone-700">
          We are a creative studio building cinematic worlds, memorable characters, and stories that travel across films, games, and streaming experiences.
        </p>
      </section>
      <section id="news" className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">News</h2>
        <p className="mt-3 max-w-3xl text-stone-700">
          Latest release updates, festival announcements, and behind-the-scenes production notes.
        </p>
      </section>
      <section id="success-stories" className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Success Stories</h2>
        <p className="mt-3 max-w-3xl text-stone-700">
          Discover box office milestones, audience favorites, and award-winning productions.
        </p>
      </section>
      <CardsGrid content={content} />
      <Footer content={content} />
    </main>
  );
}
