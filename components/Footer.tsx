import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from "react-icons/fa";
import { PublicContentProps } from "@/components/types";

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#movies", label: "Characters" },
  { href: "#movies", label: "Movies" },
  { href: "#contact", label: "Contact" }
];

export default function Footer({ content }: PublicContentProps) {
  return (
    <footer id="contact" className="border-t border-blue-950/70 bg-[#02072a] py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-stone-300">
            <img src={content.logo} alt="Footer logo" className="h-full w-full object-cover object-center" />
          </div>
          <div className="mt-5 flex items-center gap-3">
            <a href={content.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-500 p-2 hover:bg-slate-800">
              <FaFacebookF />
            </a>
            <a href={content.socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-500 p-2 hover:bg-slate-800">
              <FaInstagram />
            </a>
            <a href={content.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-slate-500 p-2 hover:bg-slate-800">
              <FaLinkedinIn />
            </a>
            <a href={content.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-full border border-slate-500 p-2 hover:bg-slate-800">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="text-center">
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-slate-200">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
