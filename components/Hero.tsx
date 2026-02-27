"use client";

import { useEffect, useState } from "react";
import { PublicContentProps } from "@/components/types";

export default function Hero({ content }: PublicContentProps) {
  const [heroSrc, setHeroSrc] = useState(content.hero.image || "/uploads/sample-hero.svg");

  useEffect(() => {
    setHeroSrc(content.hero.image || "/uploads/sample-hero.svg");
  }, [content.hero.image]);

  return (
    <section className="mx-auto mt-2 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative h-[260px] overflow-hidden rounded-2xl bg-white sm:h-[380px]">
        <img
          src={heroSrc}
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={() => setHeroSrc("/uploads/sample-hero.svg")}
        />
        <div className="relative z-10 flex h-full items-end px-5 pb-5 sm:px-8 sm:pb-8">
          <div className="max-w-[65%] rounded-md bg-black/30 p-2 text-white backdrop-blur-[1px] sm:max-w-[55%] sm:p-3">
            <h1 className="text-2xl font-bold leading-tight sm:text-5xl">{content.hero.title}</h1>
            <p className="mt-2 text-sm text-stone-100 sm:mt-3 sm:text-2xl">{content.hero.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
