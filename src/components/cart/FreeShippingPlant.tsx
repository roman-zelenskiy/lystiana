"use client";

import { m } from "motion/react";
import { FREE_SHIPPING_FROM } from "@/data/site";
import { formatPrice } from "@/lib/format";

const spring = { type: "spring", stiffness: 160, damping: 13 } as const;

/**
 * Прогрес до безкоштовної доставки — рослина в горщику.
 * Стебло росте разом із сумою, на 25/50/75% розгортаються листки, на 100% розквітає квітка.
 */
export function FreeShippingPlant({ total }: { total: number }) {
  const progress = Math.min(1, total / FREE_SHIPPING_FROM);
  const left = Math.max(0, FREE_SHIPPING_FROM - total);
  const leaf = (at: number) => ({ scale: progress >= at ? 1 : 0, opacity: progress >= at ? 1 : 0 });

  return (
    <div className="flex items-center gap-4 rounded-3xl bg-sage p-3 pr-4">
      <svg viewBox="0 0 60 80" className="h-20 w-[3.75rem] shrink-0" aria-hidden="true">
        {/* стебло: масштаб по вертикалі від ґрунту */}
        <m.rect x="28.5" y="14" width="3" height="46" rx="1.5" fill="var(--color-forest)" initial={false} animate={{ scaleY: 0.08 + progress * 0.92 }} transition={spring} style={{ originY: 1, transformBox: "fill-box" }} />
        <m.path d="M30 52c-2-7-8-10-13-10 1 6 6 10 13 10Z" fill="var(--color-moss)" initial={false} animate={leaf(0.25)} transition={spring} style={{ originX: 1, originY: 1, transformBox: "fill-box" }} />
        <m.path d="M30 42c2-7 8-10 13-10-1 6-6 10-13 10Z" fill="var(--color-forest)" initial={false} animate={leaf(0.5)} transition={spring} style={{ originX: 0, originY: 1, transformBox: "fill-box" }} />
        <m.path d="M30 31c-2-7-8-10-13-10 1 6 6 10 13 10Z" fill="var(--color-moss)" initial={false} animate={leaf(0.75)} transition={spring} style={{ originX: 1, originY: 1, transformBox: "fill-box" }} />
        <m.g initial={false} animate={leaf(1)} transition={{ ...spring, stiffness: 220, damping: 9 }} style={{ originX: 0.5, originY: 0.5, transformBox: "fill-box" }}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="30" cy="8" rx="3.6" ry="6" fill="var(--color-coral)" transform={`rotate(${r} 30 14)`} />
          ))}
          <circle cx="30" cy="14" r="3.4" fill="var(--color-butter)" />
        </m.g>
        <path d="M14 60h32l-4 18H18Z" fill="var(--color-coral-deep)" />
        <rect x="12" y="57" width="36" height="6" rx="3" fill="var(--color-coral)" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">
          {left > 0 ? (
            <>
              Ще {formatPrice(left)} — і доставка <span className="whitespace-nowrap">безкоштовна</span>
            </>
          ) : (
            "Доставка безкоштовна!"
          )}
        </p>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-milk"
          role="progressbar"
          aria-label="До безкоштовної доставки"
          aria-valuemin={0}
          aria-valuemax={FREE_SHIPPING_FROM}
          aria-valuenow={Math.min(total, FREE_SHIPPING_FROM)}
          aria-valuetext={left > 0 ? `Залишилось ${formatPrice(left)}` : "Безкоштовна доставка"}
        >
          <m.div className="h-full w-full origin-left rounded-full bg-forest" initial={false} animate={{ scaleX: progress }} transition={spring} />
        </div>
      </div>
    </div>
  );
}
