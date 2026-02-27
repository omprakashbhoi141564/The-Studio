import { PublicContentProps } from "@/components/types";

export default function CardsGrid({ content }: PublicContentProps) {
  const topPicks = content.cards.slice(0, 6);
  const deals = content.cards.slice(0, 3);

  return (
    <section id="movies" className="mx-auto mt-6 max-w-6xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-pink-200 bg-gradient-to-br from-sky-100 to-pink-200 p-4 sm:p-6">
        <h2 className="mb-4 text-2xl font-bold text-stone-800 sm:mb-5 sm:text-5xl">
          {content.studioName}, still looking for these?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4">
          {topPicks.map((card) => (
            <article key={card.id} className="min-w-[145px] rounded-2xl border border-stone-200 bg-white p-2 shadow-sm sm:min-w-[190px]">
              <div className="aspect-square overflow-hidden rounded-xl bg-stone-100">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
              </div>
              <p className="mt-2 truncate text-lg text-stone-700 sm:text-3xl">{card.title}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((card) => (
          <article key={card.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="aspect-[4/5] w-full overflow-hidden bg-[#f4e9fb]">
              <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
            </div>
            <div className="bg-sky-500 px-4 py-2 text-white">
              <p className="text-base font-semibold sm:text-lg">Limited time deal</p>
            </div>
            <div className="p-3">
              <h3 className="truncate text-lg font-semibold sm:text-2xl">{card.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
