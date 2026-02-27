"use client";

import { useEffect, useMemo, useState } from "react";
import { StudioCard } from "@/lib/types";

type PosterCarouselProps = {
  cards: StudioCard[];
};

function getPosterCards(cards: StudioCard[]): StudioCard[] {
  const explicit = cards.filter((card) => card.section === "poster");
  if (explicit.length >= 3) return explicit;

  const fallback = cards.slice(0, 6);
  if (fallback.length === 0) {
    return [
      { id: "placeholder_1", title: "Poster 1", description: "", image: "/uploads/sample-card-1.svg", order: 1, section: "poster" },
      { id: "placeholder_2", title: "Poster 2", description: "", image: "/uploads/sample-card-2.svg", order: 2, section: "poster" },
      { id: "placeholder_3", title: "Poster 3", description: "", image: "/uploads/sample-card-3.svg", order: 3, section: "poster" }
    ];
  }

  if (fallback.length === 1) return [fallback[0], fallback[0], fallback[0]];
  if (fallback.length === 2) return [fallback[0], fallback[1], fallback[0]];

  return fallback;
}

export default function PosterCarousel({ cards }: PosterCarouselProps) {
  const baseCards = useMemo(() => getPosterCards(cards), [cards]);
  const visibleCount = 3;
  const slides = useMemo(() => [...baseCards, ...baseCards.slice(0, visibleCount)], [baseCards]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const transitionClass = animate ? "transition-transform duration-700 ease-in-out" : "";
  const activeDot = index % baseCards.length;

  return (
    <section className="mx-auto mt-5 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <div
          className={`flex ${transitionClass}`}
          style={{ transform: `translateX(-${index * (100 / visibleCount)}%)` }}
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
              <a
                href={card.linkUrl || "#"}
                target={card.linkUrl ? "_blank" : undefined}
                rel={card.linkUrl ? "noreferrer" : undefined}
                className="block transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="h-[210px] overflow-hidden rounded-lg border border-stone-300 bg-stone-100 sm:h-[280px]">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover object-center" />
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        {baseCards.map((card, dotIndex) => (
          <span
            key={`dot_${card.id}_${dotIndex}`}
            className={`h-1.5 rounded-full transition-all ${activeDot === dotIndex ? "w-10 bg-black" : "w-6 bg-stone-300"}`}
          />
        ))}
      </div>
    </section>
  );
}
