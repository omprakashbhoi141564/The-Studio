"use client";

import { useEffect, useState } from "react";
import { PublicContentProps } from "@/components/types";

export default function Hero({ content }: PublicContentProps) {
  const [heroSrc, setHeroSrc] = useState(content.hero.image || "/uploads/sample-hero.svg");

  useEffect(() => {
    setHeroSrc(content.hero.image || "/uploads/sample-hero.svg");
  }, [content.hero.image]);

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative h-[260px] overflow-hidden rounded-2xl border border-stone-200 bg-white sm:h-[380px]">
        <img
          src={heroSrc}
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={() => setHeroSrc("/uploads/sample-hero.svg")}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent" />
        <div className="relative z-10 flex h-full items-center px-5 sm:px-8">
          <div className="max-w-[60%] text-stone-900 sm:max-w-[50%]">
            <h1 className="text-2xl font-bold leading-tight sm:text-5xl">{content.hero.title}</h1>
            <p className="mt-3 text-sm text-stone-700 sm:mt-4 sm:text-2xl">{content.hero.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4">
        <span className="h-1.5 w-6 rounded-full bg-stone-300" />
        <span className="h-1.5 w-6 rounded-full bg-stone-300" />
        <span className="h-1.5 w-12 rounded-full bg-black" />
        <span className="h-1.5 w-6 rounded-full bg-stone-300" />
        <span className="h-1.5 w-6 rounded-full bg-stone-300" />
      </div>
    </section>
  );
}
