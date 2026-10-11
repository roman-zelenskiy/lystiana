import type { CategoryId, Light, RoomId } from "./types";

export const categories: { id: CategoryId; label: string; lead: string }[] = [
  { id: "nevybahlyvi", label: "Невибагливі", lead: "Невибагливі рослини, які пробачать пропущений полив" },
  { id: "velyki", label: "Великі рослини", lead: "Великі кімнатні рослини для вітальні та офісу" },
  { id: "dlia-tini", label: "Для тіні", lead: "Тіньовитривалі рослини для кімнат далеко від вікна" },
  { id: "pet-friendly", label: "Pet-friendly", lead: "Рослини, безпечні для котів і собак" },
  { id: "kvituchi", label: "Квітучі", lead: "Квітучі кімнатні рослини" },
  { id: "kashpo", label: "Кашпо", lead: "Кашпо для рослин: кераміка, ротанг, бетон, макраме" },
  { id: "dohliad", label: "Догляд", lead: "Засоби догляду: добрива, ґрунт, лійки, обприскувачі" },
];

export const lightLabel: Record<Light, string> = {
  shade: "Тінь",
  diffused: "Розсіяне",
  bright: "Яскраве",
};

export const lightHint: Record<Light, string> = {
  shade: "Вікно на північ або рослина далеко від вікна",
  diffused: "Світло, але без прямого сонця на листі",
  bright: "Сонячне підвіконня на південь чи захід",
};

export const difficultyLabel = ["", "Легкий догляд", "Середній догляд", "Для досвідчених"] as const;

export const rooms: { id: RoomId; label: string; note: string }[] = [
  { id: "spalnia", label: "Спальня", note: "Тихі рослини, що не потребують щоденної уваги" },
  { id: "kukhnia", label: "Кухня", note: "Компактні — для підвіконня й полиць" },
  { id: "vitalnia", label: "Вітальня", note: "Великі акценти й зелені куточки" },
  { id: "ofis", label: "Офіс", note: "Витримують кондиціонер і вихідні без поливу" },
  { id: "vanna", label: "Ванна", note: "Люблять вологе повітря і м’яке світло" },
];

export type SortId = "popular" | "cheap" | "expensive" | "new";

export const sorts: { id: SortId; label: string }[] = [
  { id: "popular", label: "Популярні" },
  { id: "cheap", label: "Спершу дешевші" },
  { id: "expensive", label: "Спершу дорожчі" },
  { id: "new", label: "Нові" },
];

export const priceRanges = [
  { id: "all", label: "Будь-яка ціна", min: 0, max: Infinity },
  { id: "to500", label: "до 500 грн", min: 0, max: 500 },
  { id: "500-1000", label: "500–1000 грн", min: 500, max: 1000 },
  { id: "from1000", label: "від 1000 грн", min: 1000, max: Infinity },
] as const;

export type PriceRangeId = (typeof priceRanges)[number]["id"];

/** Скільки карток показувати одразу і скільки додавати кнопкою «Показати ще» */
export const PAGE_SIZE = 12;
