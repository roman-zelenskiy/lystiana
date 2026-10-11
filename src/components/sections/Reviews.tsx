"use client";

import Image from "next/image";
import { m, useReducedMotion } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";
import { reviews } from "@/data/content";
import { photo } from "@/data/photos";
import { productById } from "@/data/products";
import { store } from "@/data/site";
import { formatNumber } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

const fine = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(fine);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const baseTilts = [-4, 3, -2, 5, -5, 2];
const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${months[m - 1]} ${y}`;
};

/**
 * Відгуки — полароїди, приколоті до дошки. Мишею їх можна перетягувати;
 * «Перемішати» розкладає їх заново (для клавіатури й дотику — та сама дія кнопкою).
 */
export function Reviews() {
  const board = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const draggable = useSyncExternalStore(subscribe, () => window.matchMedia(fine).matches, () => false) && !reduce;
  const [order, setOrder] = useState(() => reviews.map((_, i) => i));
  const [round, setRound] = useState(0);

  const shuffle = () => {
    setOrder((o) => {
      const next = [...o];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setRound((r) => r + 1);
  };

  return (
    <section id="vidguky" aria-labelledby="vidguky-title" className="relative overflow-hidden bg-paper py-20 md:py-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="hand -rotate-2 text-2xl text-coral-deep">фото від покупців</p>
            <h2 id="vidguky-title" className="display mt-1 text-[clamp(2.2rem,5vw,4rem)] text-forest">
              Відгуки покупців
            </h2>
            <p className="mt-3 flex items-center gap-2 font-bold">
              <span className="flex text-[#c98a00]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={18} fill="currentColor" />
                ))}
              </span>
              {store.rating.value} з 5 · {formatNumber(store.rating.count)} відгуків
            </p>
          </div>
          <button type="button" onClick={shuffle} className="btn btn-ghost">
            <Icon name="sparkle" size={20} /> Перемішати
          </button>
        </div>

        <ul ref={board} className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {order.map((idx, pos) => {
            const r = reviews[idx];
            const product = productById.get(r.productId);
            const tilt = baseTilts[(pos + round) % baseTilts.length];
            return (
              <m.li
                key={`${r.id}-${round}`}
                layout
                drag={draggable}
                dragConstraints={board}
                dragElastic={0.15}
                whileDrag={{ scale: 1.05, rotate: 0, zIndex: 20, cursor: "grabbing" }}
                initial={{ opacity: 0, y: 30, rotate: tilt * 2 }}
                animate={{ opacity: 1, y: 0, rotate: tilt }}
                transition={{ type: "spring", stiffness: 200, damping: 18, delay: pos * 0.05 }}
                className={`relative rounded-md bg-white p-3 pb-5 shadow-[var(--shadow-card)] ${draggable ? "cursor-grab touch-none" : ""}`}
              >
                <span className="absolute -top-2 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-coral shadow-[inset_-2px_-2px_0_rgb(0_0_0/0.15)]" aria-hidden="true" />
                <figure>
                  <div className="relative aspect-square overflow-hidden bg-paper">
                    <Image src={photo(r.photo)} alt={r.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw" className="pointer-events-none object-cover" draggable={false} />
                  </div>
                  <figcaption className="mt-3 px-1">
                    <span className="hand block text-2xl text-forest">
                      {r.name}, {r.city}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <span className="flex text-[#c98a00]" role="img" aria-label={`Оцінка ${r.rating} з 5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Icon key={n} name="star" size={14} fill={n <= r.rating ? "currentColor" : "none"} />
                        ))}
                      </span>
                      · {product?.name} · <time dateTime={r.date}>{formatDate(r.date)}</time>
                    </span>
                  </figcaption>
                  <blockquote className="mt-2 px-1 text-[0.98rem]">«{r.text}»</blockquote>
                </figure>
              </m.li>
            );
          })}
        </ul>
        {draggable && <p className="hand mt-8 text-center text-xl text-muted">пс-с… полароїди можна перетягувати</p>}
      </div>
    </section>
  );
}
