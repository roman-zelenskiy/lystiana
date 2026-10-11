import { priceRanges, type SortId } from "@/data/catalog-meta";
import type { Product } from "@/data/types";
import type { CatalogFilters } from "@/store/catalog";

/** Нижня ціна товару (найменший доступний розмір) */
export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’ʼ'`]/g, "")
    .replace(/ё/g, "е")
    .trim();

export function matchesQuery(p: Product, query: string) {
  const q = normalize(query);
  if (!q) return true;
  const hay = normalize(`${p.name} ${p.latin ?? ""} ${p.blurb}`);
  return q.split(/\s+/).every((w) => hay.includes(w));
}

export function matches(p: Product, f: CatalogFilters) {
  if (f.category !== "all" && !p.categories.includes(f.category)) return false;
  if (f.room && !p.rooms.includes(f.room)) return false;
  // фільтри догляду стосуються лише рослин
  if (f.light !== "all" && !p.care?.light.includes(f.light)) return false;
  if (f.difficulty < 3 && (!p.care || p.care.difficulty > f.difficulty)) return false;
  if (f.petSafe && !p.care?.petSafe) return false;
  const range = priceRanges.find((r) => r.id === f.price)!;
  const price = fromPrice(p);
  if (price < range.min || price >= range.max) return false;
  return matchesQuery(p, f.query);
}

const sorters: Record<SortId, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  cheap: (a, b) => fromPrice(a) - fromPrice(b),
  expensive: (a, b) => fromPrice(b) - fromPrice(a),
  new: (a, b) => b.added.localeCompare(a.added),
};

/** Товари без наявності завжди в кінці списку */
export function sortProducts(list: Product[], sort: SortId) {
  return [...list].sort((a, b) => Number(a.stock === "out") - Number(b.stock === "out") || sorters[sort](a, b));
}

export function activeFilterCount(f: CatalogFilters) {
  return (
    Number(f.light !== "all") +
    Number(f.difficulty < 3) +
    Number(f.petSafe) +
    Number(f.price !== "all") +
    Number(!!f.room) +
    Number(!!f.query.trim())
  );
}
