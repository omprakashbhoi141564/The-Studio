"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import SidePanel from "@/components/SidePanel";
import { PublicContentProps } from "@/components/types";

export default function Header({ content }: PublicContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(content.logo || "/uploads/sample-logo.svg");

  useEffect(() => {
    setLogoSrc(content.logo || "/uploads/sample-logo.svg");
  }, [content.logo]);

  return (
    <>
      <header id="home" className="sticky top-0 z-30 border-b border-stone-200 bg-studio-surface/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-stone-200">
              <img
                src={logoSrc}
                alt={`${content.studioName} logo`}
                className="h-full w-full object-cover object-center"
                onError={() => setLogoSrc("/uploads/sample-logo.svg")}
              />
            </div>
            <p className="max-w-[180px] truncate text-lg font-semibold tracking-wide sm:max-w-none sm:text-xl">{content.studioName}</p>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-side-panel"
            className="rounded-md p-2 hover:bg-black/5"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        </div>
      </header>
      <SidePanel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
