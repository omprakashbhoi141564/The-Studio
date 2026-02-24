"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import SidePanel from "@/components/SidePanel";
import { PublicContentProps } from "@/components/types";

export default function Header({ content }: PublicContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header id="home" className="sticky top-0 z-30 border-b border-stone-300 bg-studio-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={content.logo} alt={`${content.studioName} logo`} className="h-12 w-12 rounded-full object-cover" />
          <p className="text-xl font-semibold tracking-wide">{content.studioName}</p>
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
      <SidePanel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
