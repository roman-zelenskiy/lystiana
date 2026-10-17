import type { Metadata, Viewport } from "next";
import { lang as rootLang } from "next/root-params";
import { Providers } from "@/components/Providers";
import { I18nProvider } from "@/components/I18n";
import { siteUrl } from "@/data/site";
import { fontVars } from "@/lib/fonts";
import { getDict, isLang, langs, type Lang } from "@/lib/i18n";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

async function current(): Promise<Lang> {
  const l = await rootLang();
  return isLang(l) ? l : "uk";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await current();
  const { site, t } = getDict(lang);
  const { seo, store } = site;
  return {
    metadataBase: new URL(`${siteUrl}/`),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    applicationName: store.name,
    category: "shopping",
    alternates: {
      canonical: `/${lang}/`,
      languages: { uk: "/uk/", en: "/en/", "x-default": "/uk/" },
    },
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      alternateLocale: lang === "uk" ? "en_US" : "uk_UA",
      url: `/${lang}/`,
      siteName: t.meta.siteName(store.name),
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.ogTitle,
      description: t.meta.twDescription,
    },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf5ea",
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await current();
  return (
    // suppressHydrationWarning — лише для атрибутів самого <html>: розширення браузера
    // (LanguageTool, Grammarly, перекладачі) дописують сюди свої data-атрибути до гідратації
    <html lang={lang} className={fontVars} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <I18nProvider lang={lang}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
