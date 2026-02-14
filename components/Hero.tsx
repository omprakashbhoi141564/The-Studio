import { PublicContentProps } from "@/components/types";

export default function Hero({ content }: PublicContentProps) {
  return (
    <section className="relative mx-auto mt-4 h-[380px] max-w-6xl overflow-hidden rounded-xl sm:h-[470px]">
      <img src={content.hero.image} alt="Hero background" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex h-full items-center px-6 sm:px-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{content.hero.title}</h1>
          <p className="mt-4 text-base text-stone-100 sm:text-lg">{content.hero.subtitle}</p>
        </div>
      </div>
    </section>
  );
}
