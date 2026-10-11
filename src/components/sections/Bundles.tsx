"use client";

import Image from "next/image";
import { m } from "motion/react";
import { useRef } from "react";
import { bundles } from "@/data/content";
import { photo } from "@/data/photos";
import { productById } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { bundleItemId, resolveItem } from "@/lib/items";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { Icon } from "@/components/ui/Icon";

const tints = ["bg-butter", "bg-sage", "bg-[#ffd9cf]"];

/** Набори подані як «рецепт»: інгредієнти через «+», а підсумок — наліпка зі знижкою */
export function Bundles() {
  return (
    <section id="nabory" aria-labelledby="nabory-title" className="relative py-20 md:py-28">
      <div className="wrap">
        <p className="hand -rotate-2 text-2xl text-coral-deep">рецепт зеленого куточка</p>
        <h2 id="nabory-title" className="display mt-1 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-forest">
          Готові набори: рослина + кашпо + догляд
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Не треба вгадувати, яке кашпо підійде і чим підживлювати. Зібрали комплекти, у яких усе пасує одне до одного, — і зробили їх дешевшими.
        </p>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {bundles.map((b, i) => (
            <BundleCard key={b.id} bundle={b} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function BundleCard({ bundle, index }: { bundle: (typeof bundles)[number]; index: number }) {
  const media = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const item = resolveItem(bundleItemId(bundle.id), "M")!;
  const save = (item.oldPrice ?? item.price) - item.price;

  return (
    <m.li
      className={`relative flex flex-col rounded-[2.25rem] p-6 ${tints[index % 3]}`}
      initial={{ opacity: 0, y: 40, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 140, damping: 16, delay: index * 0.08 }}
    >
      <span className="sticker absolute -top-4 right-6 rotate-6 bg-coral text-ink">−{formatPrice(save)}</span>
      <h3 className="display text-2xl text-forest">{bundle.name}</h3>
      <p className="hand mt-1 text-xl text-ink/80">{bundle.pitch}</p>

      <div ref={media} className="mt-6 flex items-center justify-between gap-1" aria-hidden="true">
        {bundle.items.map((it, j) => {
          const p = productById.get(it.productId)!;
          return (
            <div key={it.productId} className="contents">
              {j > 0 && <span className="display shrink-0 text-2xl text-forest">+</span>}
              <div className={`relative aspect-square w-[28%] shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow-sticker)] ${j === 1 ? "rotate-3" : "-rotate-3"}`}>
                <Image src={photo(p.photos[0])} alt="" fill sizes="110px" className="object-cover" />
              </div>
            </div>
          );
        })}
      </div>

      <ul className="mt-6 grid gap-1.5 text-[0.95rem]">
        {bundle.items.map((it) => {
          const p = productById.get(it.productId)!;
          const v = p.variants.find((x) => x.size === it.size)!;
          return (
            <li key={it.productId} className="flex justify-between gap-3 border-b border-dashed border-ink/20 pb-1.5">
              <span>
                {p.name} <span className="text-muted">({v.label.split(", ")[0]})</span>
              </span>
              <span className="shrink-0 text-muted">{formatPrice(v.price)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <p className="leading-none">
          <span className="block text-sm text-muted line-through">
            <span className="sr-only">Окремо: </span>
            {formatPrice(item.oldPrice ?? 0)}
          </span>
          <span className="display mt-1 block text-3xl whitespace-nowrap text-forest">
            <span className="sr-only">Ціна набору: </span>= {formatPrice(item.price)}
          </span>
        </p>
        <button
          type="button"
          className="btn btn-forest"
          onClick={() => addToCart({ id: item.id, size: "M", name: bundle.name, photo: item.photo, from: media.current })}
        >
          <Icon name="gift" size={20} /> Узяти набір
        </button>
      </div>
    </m.li>
  );
}
