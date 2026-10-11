import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/Providers";
import { seo, siteUrl, store } from "@/data/site";
import "./globals.css";

/*
 * Шрифти self-hosted і обрізані під символи сайту (українська, латиниця, цифри, ₴, №, лапки):
 * Dela Gothic One — 13 КБ замість 2,5 МБ, Nunito (змінна вага 400–900) — 47 КБ, Caveat 600 — 37 КБ.
 * Джерело: github.com/google/fonts (OFL), обрізка — fontTools.
 */
const dela = localFont({
  src: "./fonts/dela-gothic-one.woff2",
  weight: "400",
  variable: "--font-dela",
  // optional: файл крихітний і предзавантажений — встигає на звичайному з’єднанні,
  // а на повільному лишається підігнаний запасний шрифт без перемальовування (LCP/CLS)
  display: "optional",
  fallback: ["Arial Black", "sans-serif"],
});

const nunito = localFont({
  src: "./fonts/nunito.woff2",
  weight: "400 900",
  variable: "--font-nunito",
  display: "optional",
  fallback: ["system-ui", "sans-serif"],
});

// рукописні примітки не критичні для першого екрана — без preload
const caveat = localFont({
  src: "./fonts/caveat.woff2",
  weight: "600",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  applicationName: store.name,
  category: "shopping",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: `«${store.name}» — кімнатні рослини`,
    title: "Рослини, які виживуть навіть у тебе — «Листяна»",
    description:
      "Кімнатні рослини, кашпо та догляд з доставкою Новою Поштою по Україні. Гарантія приживлення 14 днів.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Рослини, які виживуть навіть у тебе — «Листяна»",
    description: "Кімнатні рослини з доставкою по Україні. Гарантія приживлення 14 днів.",
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export const viewport: Viewport = {
  themeColor: "#fbf5ea",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning — лише для атрибутів самого <html>: розширення браузера
    // (LanguageTool, Grammarly, перекладачі) дописують сюди свої data-атрибути до гідратації
    <html lang="uk" className={`${dela.variable} ${caveat.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
