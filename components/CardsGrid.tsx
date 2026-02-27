import { PublicContentProps } from "@/components/types";

export default function CardsGrid({ content }: PublicContentProps) {
  return (
    <section id="movies" className="mx-auto mt-8 max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
      <h2 className="mb-5 text-center text-2xl font-semibold tracking-wide text-stone-800 sm:text-3xl">
        ... Characters ...
      </h2>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {content.cards.map((card) => (
          <article key={card.id} className="overflow-hidden rounded-md border border-stone-300 bg-white shadow-sm">
            <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100">
              <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
            </div>
            <div className="p-2">
              <h3 className="truncate text-[12px] font-medium text-stone-700 sm:text-sm">{card.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
