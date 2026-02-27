"use client";

import { useEffect, useState } from "react";
import { PublicContentProps } from "@/components/types";

export default function Hero({ content }: PublicContentProps) {
  const [heroSrc, setHeroSrc] = useState(content.hero.image || "/uploads/sample-hero.svg");

  useEffect(() => {
    setHeroSrc(content.hero.image || "/uploads/sample-hero.svg");
  }, [content.hero.image]);

  return (
    <section className="mt-0 w-full">
      <div className="relative h-[260px] w-full overflow-hidden bg-white sm:h-[420px]">
        <img
          src={heroSrc}
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          onError={() => setHeroSrc("/uploads/sample-hero.svg")}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-5 sm:px-6 sm:pb-8 lg:px-8">
          <div className="max-w-[65%] rounded-md bg-black/20 p-2 text-white sm:max-w-[55%] sm:p-3">
            <h1 className="text-2xl font-bold leading-tight sm:text-5xl">{content.hero.title}</h1>
            <p className="mt-2 text-sm text-stone-100 sm:mt-3 sm:text-2xl">{content.hero.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
