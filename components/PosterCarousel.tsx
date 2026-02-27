"use client";

import { useEffect, useMemo, useState } from "react";
import { StudioCard } from "@/lib/types";

type PosterCarouselProps = {
  cards: StudioCard[];
};

function normalizeCards(cards: StudioCard[]): StudioCard[] {
  if (cards.length === 0) {
    return [
      { id: "placeholder_1", title: "Poster 1", description: "", image: "/uploads/sample-card-1.svg", order: 1 },
      { id: "placeholder_2", title: "Poster 2", description: "", image: "/uploads/sample-card-2.svg", order: 2 },
      { id: "placeholder_3", title: "Poster 3", description: "", image: "/uploads/sample-card-3.svg", order: 3 }
    ];
  }

  if (cards.length === 1) {
    return [cards[0], cards[0], cards[0]];
  }

  if (cards.length === 2) {
    return [cards[0], cards[1], cards[0]];
  }

  return cards;
}

export default function PosterCarousel({ cards }: PosterCarouselProps) {
  const baseCards = useMemo(() => normalizeCards(cards), [cards]);
  const slides = useMemo(() => [...baseCards, ...baseCards.slice(0, 3)], [baseCards]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const transitionClass = animate ? "transition-transform duration-700 ease-in-out" : "";

  return (
    <section className="mx-auto mt-5 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <div
          className={`flex ${transitionClass}`}
          style={{ transform: `translateX(-${index * (100 / 3)}%)` }}
          onTransitionEnd={() => {
            if (index >= baseCards.length) {
              setAnimate(false);
              setIndex(0);
              requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimate(true));
              });
            }
          }}
        >
          {slides.map((card, i) => (
            <article key={`${card.id}_${i}`} className="w-1/3 shrink-0 px-2">
              <div className="h-[210px] overflow-hidden rounded-lg border border-stone-300 bg-stone-100 sm:h-[280px]">
                <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
