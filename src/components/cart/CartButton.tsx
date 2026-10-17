"use client";

import { AnimatePresence, m } from "motion/react";
import { useI18n } from "@/components/I18n";
import { cartTotals, useCart, useCartHydrated } from "@/store/cart";

/**
 * Кошик-горщик. Коли рослина «прилітає», горщик пружно присідає, з нього виростає паросток,
 * а цифра лічильника перевертається.
 */
export function CartButton() {
  const t = useI18n().t.cart;
  const hydrated = useCartHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const bumps = useCart((s) => s.bumps);
  const setOpen = useCart((s) => s.setOpen);
  const count = hydrated ? cartTotals(lines, promo).count : 0;

  return (
    <button
      type="button"
      id="cart-target"
      onClick={() => setOpen(true)}
      className="relative grid h-11 w-11 place-items-center sm:h-12 sm:w-12 rounded-full bg-forest text-milk transition-transform duration-300 ease-[var(--ease-bounce)] hover:-rotate-6"
      aria-label={t.aria(count)}
    >
      <m.svg
        key={`pot-${bumps}`}
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        initial={bumps ? { scaleY: 0.72, scaleX: 1.2 } : false}
        animate={{ scaleY: 1, scaleX: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 12 }}
        style={{ originY: 1 }}
      >
        <path d="M5 12h14l-1.5 7.6a1.5 1.5 0 0 1-1.5 1.2H8a1.5 1.5 0 0 1-1.5-1.2L5 12Z" />
        <path d="M4 12h16" />
        {/* паросток: виростає з ґрунту при кожному «прильоті» */}
        <m.g
          initial={bumps ? { scaleY: 0, opacity: 0 } : false}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 11, delay: 0.08 }}
          style={{ originX: 0.5, originY: 1, transformBox: "fill-box" }}
        >
          <path d="M12 12V7" />
          <path d="M12 8.5c0-2.2-1.8-4-4-4 0 2.2 1.8 4 4 4Z" fill="var(--color-moss)" stroke="var(--color-moss)" />
          <path d="M12 7.2c0-1.8 1.4-3.2 3.2-3.2 0 1.8-1.4 3.2-3.2 3.2Z" fill="var(--color-moss)" stroke="var(--color-moss)" />
        </m.g>
      </m.svg>

      <AnimatePresence>
        {count > 0 && (
          <m.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute -top-1 -right-1 grid h-6 min-w-6 place-items-center overflow-hidden rounded-full border-2 border-milk bg-coral px-1 text-xs font-black text-ink"
            aria-hidden="true"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={count}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                {count}
              </m.span>
            </AnimatePresence>
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}
