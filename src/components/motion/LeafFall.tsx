"use client";

import { m, useReducedMotion } from "motion/react";
import { LittleLeaf } from "./Leaves";

const colors = ["text-moss", "text-forest", "text-coral", "text-butter", "text-[#6fa060]"];

/** Детермінований «випадок»: однаковий для кожного показу, без Math.random у рендері */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Святковий листопад: листки злітають і, гойдаючись, опускаються вниз */
export function LeafFall({ count = 26 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const left = rand(i, 1) * 100;
        const size = 14 + rand(i, 2) * 22;
        const sway = (rand(i, 3) - 0.5) * 160;
        const delay = rand(i, 4) * 0.5;
        const duration = 2.4 + rand(i, 5) * 1.8;
        const spin = (rand(i, 6) - 0.5) * 720;
        return (
          <m.span
            key={i}
            className={`absolute top-0 ${colors[i % colors.length]}`}
            style={{ left: `${left}%`, width: size, height: size }}
            initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 0 }}
            animate={{
              y: ["-10vh", "15vh", "60vh", "105vh"],
              x: [0, sway, -sway * 0.6, sway * 0.4],
              rotate: [0, spin * 0.3, spin * 0.7, spin],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration, delay, ease: "easeIn", times: [0, 0.2, 0.6, 1] }}
          >
            <LittleLeaf className="h-full w-full" />
          </m.span>
        );
      })}
    </div>
  );
}
