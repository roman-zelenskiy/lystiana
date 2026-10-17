"use client";

import Image from "next/image";
import { useFormat, useI18n } from "@/components/I18n";
import { m } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { photo } from "@/data/photos";
import { products } from "@/data/products";
import type { Product } from "@/data/types";
import { useCatalog } from "@/store/catalog";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { Icon } from "@/components/ui/Icon";
import { defaultSize } from "@/components/catalog/ProductCard";

/** Хіти однакові для обох мов: беремо id, назви — зі словника поточної мови */
const hitIds = [...products]
  .filter((p) => p.badges.includes("hit") && p.stock !== "out")
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 6)
  .map((p) => p.id);

/**
 * «Полиця бестселерів»: рослини стоять на дерев’яних полицях, а на кожній висить
 * рукописний цінник на мотузці — він гойдається, як маятник, коли до нього торкаєшся.
 */
export function Bestsellers() {
  const { productById, t: ui } = useI18n();
  const t = ui.best;
  const hits = hitIds.map((id) => productById.get(id)!);
  return (
    <section id="khity" aria-labelledby="khity-title" className="relative overflow-hidden bg-forest py-20 text-milk md:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hand -rotate-2 text-2xl text-butter">{t.note}</p>
            <h2 id="khity-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)]">
              {t.title}
            </h2>
          </div>
          <p className="max-w-sm text-milk/80">{t.lead}</p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-y-16 lg:grid-cols-3">
          {hits.map((p, i) => (
            <ShelfItem key={p.id} product={p} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShelfItem({ product, index }: { product: Product; index: number }) {
  const { t: ui } = useI18n();
  const { formatPrice } = useFormat();
  // кожен «поштовх» перезапускає CSS-анімацію маятника: класи swing-a/swing-b чергуються
  const [swings, setSwings] = useState(0);
  const media = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const openQuickView = useCatalog((s) => s.openQuickView);
  const size = defaultSize(product);
  const v = product.variants.find((x) => x.size === size)!;

  const swing = () => setSwings((n) => n + 1);

  return (
    <li className="relative flex flex-col items-center px-2 sm:px-6">
      <m.div
        ref={media}
        className="relative z-10 aspect-[3/4] w-[78%] overflow-hidden rounded-t-full border-[5px] border-milk bg-paper"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: (index % 3) * 0.08 }}
      >
        <Image src={photo(product.photos[0])} alt={product.alt} fill sizes="(min-width: 1024px) 280px, 38vw" className="object-cover" />
      </m.div>

      {/* дошка полиці: сусідні елементи стикуються в одну суцільну полицю */}
      <div className="relative z-10 h-3.5 w-[calc(100%+1rem)] rounded-sm bg-[#c8955f] shadow-[0_7px_0_#8f5f33] sm:w-[calc(100%+3rem)]" aria-hidden="true" />

      {/* цінник на мотузці */}
      <div
        className={`relative z-20 mt-1.5 flex origin-top flex-col items-center ${swings ? (swings % 2 ? "swing-a" : "swing-b") : ""}`}
        style={{ "--swing-dir": index % 2 ? -1 : 1 } as CSSProperties}
        onPointerEnter={(e) => e.pointerType === "mouse" && swing()}
      >
        <span className="block h-6 w-0.5 bg-butter/80" aria-hidden="true" />
        <div className={`w-[min(13rem,100%)] rounded-2xl bg-cream p-3 text-ink shadow-[var(--shadow-sticker)] ${index % 2 ? "rotate-2" : "-rotate-2"}`}>
          <span className="mx-auto -mt-1 mb-1 block h-2.5 w-2.5 rounded-full border-2 border-line bg-milk" aria-hidden="true" />
          <h3 className="hand mt-1 text-[1.6rem] leading-none text-forest">
            <button type="button" onClick={() => openQuickView(product.id)} className="text-left hover:underline">
              {product.name.split(" «")[0]}
            </button>
          </h3>
          {product.rating && (
            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-muted">
              <Icon name="star" size={13} fill="currentColor" className="text-[#c98a00]" /> {product.rating.value} · {ui.card.reviews(product.rating.count)}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-black">{formatPrice(v.price)}</span>
            <button
              type="button"
              onClick={() => {
                swing();
                addToCart({ id: product.id, size, name: product.name, sizeLabel: ui.card.sizeLabel(size), photo: product.photos[0], from: media.current });
              }}
              className="grid h-11 w-11 place-items-center rounded-full bg-coral text-ink transition-transform duration-300 ease-[var(--ease-bounce)] hover:scale-110 active:scale-90"
              aria-label={ui.card.addAriaPrice(product.name, size, formatPrice(v.price))}
            >
              <Icon name="plus" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
