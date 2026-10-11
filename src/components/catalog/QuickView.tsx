"use client";

import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState } from "react";
import { categories, lightHint, lightLabel } from "@/data/catalog-meta";
import { photo } from "@/data/photos";
import { productById } from "@/data/products";
import type { Product, Size } from "@/data/types";
import { formatPrice } from "@/lib/format";
import { MAX_QTY } from "@/store/cart";
import { useCatalog } from "@/store/catalog";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { CareIcons } from "@/components/ui/CareIcons";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Badges, defaultSize } from "./ProductCard";

export function QuickView() {
  const id = useCatalog((s) => s.quickView);
  const close = useCatalog((s) => s.openQuickView);
  const product = id ? productById.get(id) : undefined;
  // останній показаний товар лишається на екрані під час анімації закриття
  const [last, setLast] = useState<Product | undefined>(product);
  if (product && product !== last) setLast(product);
  const shown = product ?? last;

  return (
    <Modal open={!!product} onClose={() => close(null)} labelledBy="qv-title" className="sm:max-w-4xl">
      {shown && <QuickViewBody key={shown.id} product={shown} onDone={() => close(null)} />}
    </Modal>
  );
}

function QuickViewBody({ product, onDone }: { product: Product; onDone: () => void }) {
  const [size, setSize] = useState<Size>(defaultSize(product));
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const media = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const v = product.variants.find((x) => x.size === size)!;
  const out = product.stock === "out";
  const cats = product.categories.map((c) => categories.find((x) => x.id === c)?.label).filter(Boolean);

  return (
    <div className="grid overflow-y-auto md:grid-cols-[1fr_1.1fr]">
      <div className="p-3 md:p-4">
        <div ref={media} className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] rounded-tr-[4rem] bg-paper">
          <AnimatePresence initial={false} mode="popLayout">
            <m.div
              key={img}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={photo(product.photos[img])}
                alt={img === 0 ? product.alt : `${product.name}: ще одне фото`}
                fill
                sizes="(min-width: 768px) 420px, 100vw"
                className="object-cover"
              />
            </m.div>
          </AnimatePresence>
          <Badges product={product} size={size} />
        </div>
        <div className="mt-3 flex gap-2" role="group" aria-label="Фото товару">
          {product.photos.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => setImg(i)}
              aria-label={`Фото ${i + 1} з ${product.photos.length}`}
              aria-pressed={img === i}
              className={`relative h-16 w-16 overflow-hidden rounded-2xl transition ${img === i ? "ring-3 ring-forest" : "opacity-70 hover:opacity-100"}`}
            >
              <Image src={photo(key)} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col p-5 pt-2 md:p-8 md:pl-4">
        <p className="text-sm font-bold text-muted">{cats.join(" · ")}</p>
        <h2 id="qv-title" className="display mt-1 pr-10 text-3xl text-forest md:text-4xl">
          {product.name}
        </h2>
        {product.latin && <p className="text-muted italic">{product.latin}</p>}
        {product.rating && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
            <Icon name="star" size={16} className="text-[#e0a400]" fill="currentColor" />
            {product.rating.value.toFixed(1)}
            <span className="font-normal text-muted">· {product.rating.count} відгуків</span>
          </p>
        )}
        <p className="mt-4">{product.description}</p>

        {product.care && (
          <div className="mt-5 rounded-3xl bg-paper p-4">
            <p className="mb-2 font-extrabold">Догляд</p>
            <CareIcons care={product.care} />
            <p className="mt-2 text-sm text-muted">
              {lightLabel[product.care.light[0]]} світло: {lightHint[product.care.light[0]].toLowerCase()}.
            </p>
          </div>
        )}

        {product.variants.length > 1 && (
          <fieldset className="mt-5">
            <legend className="mb-2 font-extrabold">Розмір</legend>
            <div className="grid gap-2">
              {product.variants.map((x) => (
                <label key={x.size} className="variant-row">
                  <input type="radio" name="qv-size" className="sr-only" checked={size === x.size} onChange={() => setSize(x.size)} />
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-milk font-black">{x.size}</span>
                  <span className="flex-1">{x.label}</span>
                  <span className="font-black">{formatPrice(x.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <div className="flex items-center rounded-full bg-paper p-1" role="group" aria-label="Кількість">
            <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Менше">
              <Icon name="minus" size={18} />
            </button>
            <output className="w-10 text-center font-black" aria-live="polite" aria-label={`Кількість: ${qty}`}>
              {qty}
            </output>
            <button type="button" className="qty-btn" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Більше">
              <Icon name="plus" size={18} />
            </button>
          </div>
          <button
            type="button"
            className="btn btn-coral h-13 flex-1 text-lg"
            disabled={out}
            onClick={() => {
              addToCart({ id: product.id, size, qty, name: product.name, sizeLabel: `розмір ${size}`, photo: product.photos[0], from: media.current });
              onDone();
            }}
          >
            {out ? (
              "Немає в наявності"
            ) : (
              <>
                <Icon name="pot" /> У кошик · {formatPrice(v.price * qty)}
              </>
            )}
          </button>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted">
          <Icon name="shield" size={18} className="text-forest" /> Гарантія приживлення 14 днів
        </p>
      </div>
    </div>
  );
}
