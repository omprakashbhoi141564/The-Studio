import { PublicContentProps } from "@/components/types";

export default function CardsGrid({ content }: PublicContentProps) {
  return (
    <section id="movies" className="mx-auto mt-10 max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-semibold">Characters & Movies</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.cards.map((card) => (
          <article key={card.id} className="overflow-hidden rounded-lg border border-stone-300 bg-white shadow-sm">
            <img src={card.image} alt={card.title} className="h-72 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-stone-700">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
