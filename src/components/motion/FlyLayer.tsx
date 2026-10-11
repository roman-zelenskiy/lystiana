"use client";

import { m } from "motion/react";
import { useCart } from "@/store/cart";
import { useFly } from "./fly";
import { photo } from "@/data/photos";

const SIZE = 76;

/**
 * Рослина «стрибає» в кошик: горизонталь іде рівно, вертикаль — спершу вгору, потім униз,
 * тож разом виходить парабола. Горщик у шапці «ловить» її і пускає росток.
 */
export function FlyLayer() {
  const flights = useFly((s) => s.flights);
  const land = useFly((s) => s.land);
  const bump = useCart((s) => s.bump);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {flights.map((f) => {
        const x0 = f.from.left + f.from.width / 2 - SIZE / 2;
        const y0 = f.from.top + f.from.height / 2 - SIZE / 2;
        const dx = f.to.left + f.to.width / 2 - SIZE / 2 - x0;
        const dy = f.to.top + f.to.height / 2 - SIZE / 2 - y0;
        const arc = Math.min(220, Math.max(90, Math.abs(dx) * 0.35));
        return (
          <m.div
            key={f.id}
            className="absolute overflow-hidden rounded-full border-[3px] border-white shadow-[var(--shadow-sticker)]"
            style={{ left: x0, top: y0, width: SIZE, height: SIZE }}
            initial={{ x: 0, y: 0, scale: 0.6, rotate: 0 }}
            animate={{
              x: [0, dx * 0.45, dx],
              y: [0, Math.min(0, dy) - arc, dy],
              scale: [0.6, 1.1, 0.32],
              rotate: [0, -24, 18],
            }}
            transition={{
              duration: 0.8,
              x: { duration: 0.8, ease: "linear", times: [0, 0.45, 1] },
              y: { duration: 0.8, ease: ["easeOut", "easeIn"], times: [0, 0.45, 1] },
              scale: { duration: 0.8, times: [0, 0.3, 1] },
              rotate: { duration: 0.8, times: [0, 0.5, 1] },
            }}
            onAnimationComplete={() => {
              land(f.id);
              bump();
            }}
          >
            {/* маленька мініатюра напряму з CDN: next/image тут зайвий — елемент живе менше секунди */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${photo(f.src)}?w=160&q=60&auto=format&fit=crop`} alt="" className="h-full w-full object-cover" />
          </m.div>
        );
      })}
    </div>
  );
}
