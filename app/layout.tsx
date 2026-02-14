import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Website",
  description: "Responsive studio website with admin-managed content"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
