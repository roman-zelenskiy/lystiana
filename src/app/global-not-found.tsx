import type { Metadata } from "next";
import { siteUrl } from "@/data/site";
import { tEn, tUk } from "@/data/ui";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: "404 — Листяна · Lystiana",
  robots: { index: false, follow: true },
};

const base = process.env.STATIC === "1" ? process.env.BASE_PATH || "" : "";

/** Мову обирає крихітний скрипт за адресою, обидві версії тексту вже в HTML */
const pickLang = `(function(){var en=/\\/en(\\/|$)/.test(location.pathname);document.documentElement.lang=en?'en':'uk';document.documentElement.dataset.nf=en?'en':'uk'})()`;

function Body({ lang }: { lang: "uk" | "en" }) {
  const t = (lang === "en" ? tEn : tUk).nf;
  return (
    <div data-nf-lang={lang} className="wrap grid min-h-[100svh] place-content-center gap-5 py-20 text-center">
      <p className="hand -rotate-2 text-3xl text-coral-deep">404</p>
      <h1 className="display text-[clamp(2.2rem,6vw,4rem)] text-forest">{t.title}</h1>
      <p className="mx-auto max-w-md text-lg text-muted">{t.text}</p>
      <a href={`${base}/${lang}/`} className="btn btn-forest mx-auto h-14 px-7">
        {t.home}
      </a>
    </div>
  );
}

export default function GlobalNotFound() {
  return (
    <html lang="uk" className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLang }} />
        <style>{`html[data-nf=en] [data-nf-lang=uk],html:not([data-nf=en]) [data-nf-lang=en]{display:none}`}</style>
      </head>
      <body>
        <main id="main">
          <Body lang="uk" />
          <Body lang="en" />
        </main>
      </body>
    </html>
  );
}
