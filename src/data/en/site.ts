/** English store data. Same shape as ../site.ts */
import * as uk from "../site";

export const store: typeof uk.store = {
  ...uk.store,
  name: "Lystiana",
  legalName: "Sole trader O. M. Kovalenko",
  city: "Kyiv",
  street: "21 Yaroslavska St",
  hours: "Mon–Sat 10:00–19:00",
};

export const promoCodes: typeof uk.promoCodes = {
  LISTYANA10: { percent: 10, label: "−10% on your whole order" },
};

export const seo: typeof uk.seo = {
  title: "Buy houseplants with delivery across Ukraine — Lystiana",
  description:
    "Buy houseplants with Nova Poshta delivery: easy-care plants, cat-safe plants, pots and care supplies. 14-day settling-in guarantee.",
  keywords: [
    "buy houseplants",
    "houseplants delivery Ukraine",
    "plant pots",
    "easy-care plants",
    "cat-safe plants",
    "online plant shop",
  ],
};

export const nav: typeof uk.nav = [
  { id: "kimnata", label: "Plant finder" },
  { id: "katalog", label: "Shop" },
  { id: "nabory", label: "Bundles" },
  { id: "dohliad", label: "Care" },
  { id: "dostavka", label: "Delivery" },
  { id: "faq", label: "FAQ" },
] as unknown as typeof uk.nav;
