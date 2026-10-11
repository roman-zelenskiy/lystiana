export type Light = "shade" | "diffused" | "bright";
export type Size = "S" | "M" | "L";
export type Difficulty = 1 | 2 | 3;
export type Badge = "hit" | "new";
export type Stock = "in" | "low" | "out";

export type CategoryId =
  | "nevybahlyvi"
  | "velyki"
  | "dlia-tini"
  | "pet-friendly"
  | "kvituchi"
  | "kashpo"
  | "dohliad";

export type RoomId = "spalnia" | "kukhnia" | "vitalnia" | "ofis" | "vanna";

export type Variant = {
  size: Size;
  /** Що саме отримає покупець: висота, діаметр горщика, об’єм */
  label: string;
  price: number;
  oldPrice?: number;
};

export type Care = {
  light: Light[];
  difficulty: Difficulty;
  /** Коротко, як часто поливати */
  water: string;
  petSafe: boolean;
};

export type Product = {
  id: string;
  kind: "plant" | "pot" | "care";
  name: string;
  latin?: string;
  categories: CategoryId[];
  /** Одне речення для картки */
  blurb: string;
  description: string;
  care?: Care;
  rooms: RoomId[];
  variants: Variant[];
  badges: Badge[];
  stock: Stock;
  /** Для сортування «Популярні» — продажі за останні 30 днів */
  popularity: number;
  /** Дата надходження (ISO) — для сортування «Нові» */
  added: string;
  photos: readonly [string, string];
  alt: string;
  rating?: { value: number; count: number };
};
