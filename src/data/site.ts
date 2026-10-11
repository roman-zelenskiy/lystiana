/** Домен для canonical, OG і sitemap (замініть на свій) */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://lystiana.com.ua").replace(/\/$/, "");

export const store = {
  name: "Листяна",
  legalName: "ФОП Коваленко О. М.",
  phone: "+380 50 412 77 30",
  phoneHref: "tel:+380504127730",
  email: "hello@lystiana.com.ua",
  telegram: "https://t.me/lystiana",
  instagram: "https://instagram.com/lystiana.plants",
  tiktok: "https://www.tiktok.com/@lystiana",
  city: "Київ",
  street: "вул. Ярославська, 21",
  postalCode: "04071",
  /** Шоурум і точка самовивозу */
  hours: "Пн–Сб 10:00–19:00",
  rating: { value: 4.9, count: 1240 },
};

export const FREE_SHIPPING_FROM = 1500;
export const GUARANTEE_DAYS = 14;

export const promoCodes: Record<string, { percent: number; label: string }> = {
  LISTYANA10: { percent: 10, label: "−10% на все замовлення" },
};

export const seo = {
  title: "Купити кімнатні рослини з доставкою по Україні — «Листяна»",
  description:
    "Купити кімнатні рослини з доставкою Новою Поштою: невибагливі, безпечні для котів, кашпо та догляд. Гарантія приживлення 14 днів.",
  keywords: [
    "купити кімнатні рослини",
    "кімнатні рослини з доставкою",
    "кашпо для рослин купити",
    "невибагливі рослини",
    "рослини безпечні для котів",
    "інтернет-магазин рослин",
  ],
};

export const nav = [
  { id: "kimnata", label: "Підбір" },
  { id: "katalog", label: "Каталог" },
  { id: "nabory", label: "Набори" },
  { id: "dohliad", label: "Догляд" },
  { id: "dostavka", label: "Доставка" },
  { id: "faq", label: "Питання" },
] as const;
