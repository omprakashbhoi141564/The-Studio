"use client";

import Link from "next/link";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { href: "#home", label: "Home" },
  { href: "#news", label: "News" },
  { href: "#success-stories", label: "Success Stories" },
  { href: "#about", label: "About Us" },
  { href: "#contact", label: "Contact Us" },
  { href: "/admin/login", label: "Admin Login" }
];

export default function SidePanel({ open, onClose }: SidePanelProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        id="mobile-side-panel"
        className={`fixed right-0 top-0 z-50 h-full w-[320px] overflow-y-auto border-l border-stone-700 bg-stone-950 p-5 text-stone-100 shadow-2xl transition-all duration-300 ${
          open ? "visible translate-x-0 opacity-100" : "invisible translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-wide text-white">Menu</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-white/10" aria-label="Close menu">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-2 rounded border border-stone-700 bg-stone-900 px-3 py-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-stone-100 placeholder:text-stone-500"
            aria-label="Search"
          />
        </div>

        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block border-b border-stone-700 pb-2 text-base text-stone-100 hover:text-orange-300"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
