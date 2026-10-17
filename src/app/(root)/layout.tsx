import type { Metadata } from "next";
import { siteUrl } from "@/data/site";
import { fontVars } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: "Листяна · Lystiana — кімнатні рослини · houseplants",
  robots: { index: false, follow: true },
  alternates: { languages: { uk: "/uk/", en: "/en/", "x-default": "/uk/" } },
};

/** Корінь сайту — лише вибір мови */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
