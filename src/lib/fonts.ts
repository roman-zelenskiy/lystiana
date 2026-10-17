import localFont from "next/font/local";

/*
 * Шрифти self-hosted і обрізані під символи сайту (українська, латиниця, цифри, ₴, №, лапки):
 * Dela Gothic One — 13 КБ замість 2,5 МБ, Nunito (змінна вага 400–900) — 47 КБ, Caveat 600 — 37 КБ.
 * Джерело: github.com/google/fonts (OFL), обрізка — fontTools.
 */
export const dela = localFont({
  src: "../app/fonts/dela-gothic-one.woff2",
  weight: "400",
  variable: "--font-dela",
  // optional: файл крихітний і предзавантажений — встигає на звичайному з’єднанні,
  // а на повільному лишається підігнаний запасний шрифт без перемальовування (LCP/CLS)
  display: "optional",
  fallback: ["Arial Black", "sans-serif"],
});

export const nunito = localFont({
  src: "../app/fonts/nunito.woff2",
  weight: "400 900",
  variable: "--font-nunito",
  display: "optional",
  fallback: ["system-ui", "sans-serif"],
});

// рукописні примітки не критичні для першого екрана — без preload
export const caveat = localFont({
  src: "../app/fonts/caveat.woff2",
  weight: "600",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});

export const fontVars = `${dela.variable} ${caveat.variable} ${nunito.variable}`;
