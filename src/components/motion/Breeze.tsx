"use client";

import { m, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, useRef, type CSSProperties, type ReactNode } from "react";

const BreezeContext = createContext<MotionValue<number> | null>(null);

/**
 * Зона «вітерцю». Рух курсора — це порив: листя нахиляється в бік руху і пружно повертається.
 * На сенсорних екранах порив дає дотик до листка. Постійне легке погойдування — CSS-анімація.
 */
export function BreezeArea({ children, className }: { children: ReactNode; className?: string }) {
  const gust = useSpring(0, { stiffness: 70, damping: 7, mass: 0.9 });
  const reduce = useReducedMotion();
  const last = useRef<{ x: number; t: number } | null>(null);
  const calm = useRef<ReturnType<typeof setTimeout>>(undefined);

  const blow = (strength: number) => {
    gust.set(Math.max(-12, Math.min(12, strength)));
    clearTimeout(calm.current);
    calm.current = setTimeout(() => gust.set(0), 140);
  };

  return (
    <BreezeContext.Provider value={gust}>
      <div
        className={className}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const now = performance.now();
          const prev = last.current;
          last.current = { x: e.clientX, t: now };
          if (!prev || now - prev.t > 100) return;
          const speed = (e.clientX - prev.x) / Math.max(1, now - prev.t);
          if (Math.abs(speed) > 0.15) blow(speed * 7);
        }}
        onPointerDown={(e) => {
          if (reduce || e.pointerType === "mouse") return;
          // дотик — коротке «смикування» листя
          blow(e.clientX > window.innerWidth / 2 ? -9 : 9);
        }}
      >
        {children}
      </div>
    </BreezeContext.Provider>
  );
}

type SwayProps = {
  children: ReactNode;
  className?: string;
  /** Наскільки сильно елемент відгукується на порив (градусів на одиницю) */
  weight?: number;
  /** Паралакс при скролі: 0 — нерухомо, 1 — помітно */
  depth?: number;
  /** Амплітуда і тривалість постійного погойдування */
  amplitude?: number;
  duration?: number;
  delay?: number;
  origin?: string;
  style?: CSSProperties;
};

export function Sway({
  children,
  className = "",
  weight = 1,
  depth = 0,
  amplitude = 2,
  duration = 5,
  delay = 0,
  origin = "50% 100%",
  style,
}: SwayProps) {
  const gust = useContext(BreezeContext);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const rotate = useTransform(() => (gust ? gust.get() * weight : 0));
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -depth * 90]);

  return (
    <m.div className={className} style={{ ...style, rotate, y, transformOrigin: origin }}>
      <div
        className="sway h-full w-full"
        style={
          {
            "--sway-a": `${amplitude}deg`,
            "--sway-d": `${duration}s`,
            "--sway-delay": `${-delay}s`,
            "--sway-origin": origin,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </m.div>
  );
}
