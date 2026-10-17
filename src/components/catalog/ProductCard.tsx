"use client";

import Image from "next/image";
import { useFormat, useI18n } from "@/components/I18n";
import { AnimatePresence, m } from "motion/react";
import { useId, useRef, useState } from "react";
import { photo } from "@/data/photos";
import type { Product, Size } from "@/data/types";
import { discountPercent } from "@/lib/format";
import { useCatalog } from "@/store/catalog";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { CareIcons } from "@/components/ui/CareIcons";
import { Icon } from "@/components/ui/Icon";

/** Стартовий розмір: середній, якщо є, інакше перший */
export const defaultSize = (p: Product): Size => (p.variants.find((v) => v.size === "M") ?? p.variants[0]).size;

export function Badges({ product, size }: { product: Product; size: Size }) {
  const t = useI18n().t.card;
  const v = product.variants.find((x) => x.size === size)!;
  const off = discountPercent(v.price, v.oldPrice);
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
      {product.badges.includes("hit") && <span className="sticker -rotate-6 bg-butter text-ink">{t.hit}</span>}
      {product.badges.includes("new") && <span className="sticker rotate-3 bg-sage text-forest">{t.new}</span>}
      {off > 0 && <span className="sticker -rotate-3 bg-coral text-ink">−{off}%</span>}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const t = useI18n().t.card;
  const { formatPrice } = useFormat();
  const id = useId();
  const [size, setSize] = useState<Size>(defaultSize(product));
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const media = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const openQuickView = useCatalog((s) => s.openQuickView);
  const v = product.variants.find((x) => x.size === size)!;
  const out = product.stock === "out";
  const titleId = `${id}-t`;

  return (
    <article
      aria-labelledby={titleId}
      className="group flex h-full flex-col rounded-[2rem] bg-cream p-3 shadow-[var(--shadow-card)] ring-1 ring-line/60"
    >
      <div
        ref={media}
        className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] rounded-tr-[4rem] bg-paper"
        onPointerEnter={() => setHovered(true)}
      >
        <Image
          src={photo(product.photos[0])}
          alt={`${product.name} — ${product.alt.charAt(0).toLowerCase()}${product.alt.slice(1)}`}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
          className={`object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04] ${out ? "grayscale-[60%]" : ""}`}
        />
        {/* друге фото вантажимо лише після першого наведення */}
        {hovered && (
          <Image
            src={photo(product.photos[1])}
            alt=""
            fill
            sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <Badges product={product} size={size} />
        {product.stock === "low" && (
          <span className="sticker absolute right-3 bottom-3 z-10 rotate-2 bg-cream text-coral-deep">{t.low}</span>
        )}
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="absolute inset-x-3 bottom-3 z-10 translate-y-2 rounded-full bg-milk/95 py-2.5 text-sm font-extrabold text-forest opacity-0 shadow-[var(--shadow-sticker)] transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-md:sr-only max-md:focus:not-sr-only"
          aria-label={t.quickAria(product.name)}
        >
          {t.quick}
        </button>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3.5 pb-1">
        <h3 id={titleId} className="text-lg leading-snug font-black">
          <button type="button" onClick={() => openQuickView(product.id)} className="text-left hover:text-forest hover:underline">
            {product.name}
          </button>
        </h3>
        {product.latin && <p className="text-sm text-muted italic">{product.latin}</p>}
        <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-muted">{product.blurb}</p>

        {product.care && (
          <div className="mt-3">
            <CareIcons care={product.care} compact />
          </div>
        )}

        <div className="mt-auto pt-4">
          {product.variants.length > 1 ? (
            <fieldset>
              <legend className="sr-only">{t.size}</legend>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((x) => (
                  <label key={x.size} className="size-chip" title={x.label}>
                    <input
                      type="radio"
                      name={`${id}-size`}
                      value={x.size}
                      checked={size === x.size}
                      onChange={() => setSize(x.size)}
                      className="sr-only"
                    />
                    <span aria-hidden="true">{x.size}</span>
                    <span className="sr-only">
                      {x.size}: {x.label}, {formatPrice(x.price)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <p className="mt-1.5 min-h-[1.3em] text-xs text-muted">{v.label}</p>

          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="leading-none">
              {v.oldPrice && (
                <span className="mb-1 block text-sm text-muted line-through">
                  <span className="sr-only">{t.oldPrice}</span>
                  {formatPrice(v.oldPrice)}
                </span>
              )}
              <span className={`text-xl font-black ${v.oldPrice ? "text-coral-deep" : ""}`}>
                {v.oldPrice && <span className="sr-only">{t.newPrice}</span>}
                {formatPrice(v.price)}
              </span>
            </p>
            <button
              type="button"
              disabled={out}
              onClick={() => {
                addToCart({ id: product.id, size, name: product.name, sizeLabel: t.sizeLabel(size), photo: product.photos[0], from: media.current });
                setAdded(true);
                setTimeout(() => setAdded(false), 1400);
              }}
              className="btn btn-coral relative h-11 min-w-[8.5rem] overflow-hidden px-4 text-[0.95rem]"
              aria-label={out ? t.outAria(product.name) : t.addAria(product.name, size)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={out ? "out" : added ? "added" : "add"}
                  className="flex items-center gap-1.5"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {out ? (
                    t.out
                  ) : added ? (
                    <>
                      <Icon name="check" size={18} /> {t.added}
                    </>
                  ) : (
                    <>
                      <Icon name="pot" size={18} /> {t.add}
                    </>
                  )}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Полегшена картка для прихованих позицій: той самий зміст для пошуковиків
 * (назва, опис, фото, ціни розмірів), але без інтерактиву — доки картку не показано.
 */
export function ProductCardLight({ product }: { product: Product }) {
  const t = useI18n().t.card;
  const { formatPrice } = useFormat();
  return (
    <article className="rounded-[2rem] bg-cream p-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] rounded-tr-[4rem] bg-paper">
        <Image
          src={photo(product.photos[0])}
          alt={`${product.name} — ${product.alt.charAt(0).toLowerCase()}${product.alt.slice(1)}`}
          fill
          sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-3 text-lg font-black">{product.name}</h3>
      {product.latin && <p className="text-sm text-muted italic">{product.latin}</p>}
      <p className="mt-1.5 text-muted">{product.blurb}</p>
      <p className="mt-2 text-sm">
        {product.variants.map((v) => `${v.size}: ${v.label} — ${formatPrice(v.price)}`).join("; ")}
        {product.stock === "out" ? t.outFull : ""}
      </p>
    </article>
  );
}
