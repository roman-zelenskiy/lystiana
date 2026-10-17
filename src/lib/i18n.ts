import * as siteUk from "@/data/site";
import * as siteEn from "@/data/en/site";
import * as metaUk from "@/data/catalog-meta";
import * as metaEn from "@/data/en/catalog-meta";
import * as contentUk from "@/data/content";
import * as contentEn from "@/data/en/content";
import * as productsUk from "@/data/products";
import * as productsEn from "@/data/en/products";
import { legal as legalUk } from "@/data/legal";
import { legal as legalEn } from "@/data/en/legal";
import { npCities as npUk } from "@/data/nova-poshta";
import { npCities as npEn } from "@/data/en/nova-poshta";
import { tEn, tUk, type Ui } from "@/data/ui";

export const langs = ["uk", "en"] as const;
export type Lang = (typeof langs)[number];
export const isLang = (v: string): v is Lang => (langs as readonly string[]).includes(v);

export type Dict = {
  lang: Lang;
  t: Ui;
  site: Pick<typeof siteUk, "store" | "seo" | "nav" | "promoCodes">;
  meta: typeof metaUk;
  content: typeof contentUk;
  products: typeof productsUk.products;
  productById: typeof productsUk.productById;
  legal: typeof legalUk;
  np: typeof npUk;
};

const dicts: Record<Lang, Dict> = {
  uk: {
    lang: "uk",
    t: tUk,
    site: siteUk,
    meta: metaUk,
    content: contentUk,
    products: productsUk.products,
    productById: productsUk.productById,
    legal: legalUk,
    np: npUk,
  },
  en: {
    lang: "en",
    t: tEn,
    site: siteEn,
    meta: metaEn,
    content: contentEn,
    products: productsEn.products,
    productById: productsEn.productById,
    legal: legalEn,
    np: npEn,
  },
};

export const getDict = (lang: Lang): Dict => dicts[lang];

export const other = (lang: Lang): Lang => (lang === "uk" ? "en" : "uk");

/**
 * Корінь сайту: мова до першої відмальовки. Ручний вибір (localStorage) має пріоритет,
 * далі часовий пояс України → українська, решта → англійська.
 */
export const detectScript = `(function(){var l='uk';try{var s=localStorage.getItem('lang');if(s==='uk'||s==='en'){l=s}else{var tz=(Intl.DateTimeFormat().resolvedOptions().timeZone||'');l=/^Europe\\/(Kyiv|Kiev|Uzhgorod|Zaporozhye|Simferopol)$/.test(tz)?'uk':'en'}}catch(e){}location.replace(l+'/'+location.search+location.hash)})()`;

export const rememberLang = (l: Lang) => {
  try {
    localStorage.setItem("lang", l);
  } catch {
    // сховище недоступне — вибір просто не запам’ятається
  }
};
