import * as ukContent from "@/data/content";
import { productById as ukProducts } from "@/data/products";
import type { Size } from "@/data/types";

/** Позиція кошика: звичайний товар у певному розмірі або готовий набір (id з префіксом "nabir-") */
export type ResolvedItem = {
  id: string;
  name: string;
  sizeLabel: string;
  size: Size;
  price: number;
  oldPrice?: number;
  photo: string;
  alt: string;
};

export const bundleItemId = (id: string) => `nabir-${id}`;

/** Каталог мови для назв і підписів; ціни, наявність і склад наборів — спільні */
type Source = { productById: typeof ukProducts; content: Pick<typeof ukContent, "bundles"> };

export function resolveItem(
  productId: string,
  size: Size,
  { productById, content }: Source = { productById: ukProducts, content: ukContent },
): ResolvedItem | null {
  const { bundles } = content;
  if (productId.startsWith("nabir-")) {
    const b = bundles.find((x) => bundleItemId(x.id) === productId);
    if (!b || size !== "M") return null;
    const parts = b.items.map((i) => ({ p: productById.get(i.productId)!, size: i.size }));
    const full = parts.reduce((s, { p, size }) => s + (p.variants.find((v) => v.size === size)?.price ?? 0), 0);
    return {
      id: productId,
      name: b.name,
      sizeLabel: parts.map(({ p }) => p.name.split(" «")[0]).join(" + "),
      size,
      price: b.price,
      oldPrice: full,
      photo: parts[0].p.photos[0],
      alt: parts[0].p.alt,
    };
  }
  const p = productById.get(productId);
  const v = p?.variants.find((x) => x.size === size);
  if (!p || !v || p.stock === "out") return null;
  return {
    id: p.id,
    name: p.name,
    sizeLabel: v.label,
    size,
    price: v.price,
    oldPrice: v.oldPrice,
    photo: p.photos[0],
    alt: p.alt,
  };
}
