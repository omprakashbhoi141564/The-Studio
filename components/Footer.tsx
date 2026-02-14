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
  { href: "#about", label: "About" },
  { href: "#movies", label: "Movies" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" }
];

export default function Footer({ content }: PublicContentProps) {
  return (
    <footer id="contact" className="border-t border-stone-300 bg-studio-surface py-10">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <img src={content.logo} alt="Footer logo" className="h-16 w-16 rounded-full object-cover" />
          <div className="mt-5 flex items-center gap-3">
            <a href={content.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 p-2">
              <FaFacebookF />
            </a>
            <a href={content.socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 p-2">
              <FaInstagram />
            </a>
            <a href={content.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 p-2">
              <FaLinkedinIn />
            </a>
            <a href={content.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 p-2">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-stone-700">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-studio-accent">
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
