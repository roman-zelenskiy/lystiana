"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { FREE_SHIPPING_FROM, promoCodes } from "@/data/site";
import type { Size } from "@/data/types";
import { resolveItem } from "@/lib/items";
import { safeStorage } from "@/lib/safe-storage";

export type CartLine = { productId: string; size: Size; qty: number };
export const lineKey = (l: Pick<CartLine, "productId" | "size">) => `${l.productId}:${l.size}`;

export const MAX_QTY = 20;

type CartState = {
  lines: CartLine[];
  promo: string | null;
  /** Останній видалений рядок — для «Скасувати» */
  removed: { line: CartLine; index: number } | null;
  open: boolean;
  /** Лічильник «прильотів» у кошик — іконка реагує анімацією */
  bumps: number;
  add: (productId: string, size: Size, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  undo: () => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  setOpen: (open: boolean) => void;
  bump: () => void;
};

const isSize = (s: unknown): s is Size => s === "S" || s === "M" || s === "L";
const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(n) || 1));

/** Відкидає зіпсовані чи застарілі дані зі сховища: неіснуючі товари, розміри, кількості */
function sanitize(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  const out = new Map<string, CartLine>();
  for (const raw of lines) {
    if (!raw || typeof raw !== "object") continue;
    const { productId, size, qty } = raw as Partial<CartLine>;
    if (typeof productId !== "string" || !isSize(size)) continue;
    if (!resolveItem(productId, size)) continue;
    const line = { productId, size, qty: clampQty(Number(qty)) };
    out.set(lineKey(line), line);
  }
  return [...out.values()];
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,
      removed: null,
      open: false,
      bumps: 0,
      add: (productId, size, qty = 1) =>
        set((s) => {
          const key = lineKey({ productId, size });
          const exists = s.lines.some((l) => lineKey(l) === key);
          return {
            removed: null,
            lines: exists
              ? s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(l.qty + qty) } : l))
              : [...s.lines, { productId, size, qty: clampQty(qty) }],
          };
        }),
      setQty: (key, qty) =>
        set((s) => ({ lines: s.lines.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(qty) } : l)) })),
      remove: (key) =>
        set((s) => {
          const index = s.lines.findIndex((l) => lineKey(l) === key);
          if (index < 0) return s;
          return { lines: s.lines.filter((_, i) => i !== index), removed: { line: s.lines[index], index } };
        }),
      undo: () => {
        const { removed, lines } = get();
        if (!removed) return;
        const next = [...lines];
        next.splice(Math.min(removed.index, next.length), 0, removed.line);
        set({ lines: next, removed: null });
      },
      clear: () => set({ lines: [], promo: null, removed: null }),
      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!promoCodes[normalized]) return false;
        set({ promo: normalized });
        return true;
      },
      removePromo: () => set({ promo: null }),
      setOpen: (open) => set({ open }),
      bump: () => set((s) => ({ bumps: s.bumps + 1 })),
    }),
    {
      name: "lystiana:cart",
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      // У сховище — лише вибір покупця. Ціни завжди беруться з каталогу.
      partialize: (s) => ({ lines: s.lines, promo: s.promo }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Pick<CartState, "lines" | "promo">>;
        return {
          ...current,
          lines: sanitize(p.lines),
          promo: typeof p.promo === "string" && promoCodes[p.promo] ? p.promo : null,
        };
      },
      // Гідратуємо вручну після монтування — сервер і перший рендер клієнта бачать порожній кошик
      skipHydration: true,
    },
  ),
);

const subscribeHydration = (cb: () => void) => useCart.persist.onFinishHydration(cb);

/** true лише після того, як кошик прочитано зі сховища (на сервері — завжди false) */
export function useCartHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export type CartTotals = {
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  toFreeShipping: number;
  freeShipping: boolean;
};

export function cartTotals(lines: CartLine[], promo: string | null): CartTotals {
  let count = 0;
  let subtotal = 0;
  for (const l of lines) {
    const v = resolveItem(l.productId, l.size);
    if (!v) continue;
    count += l.qty;
    subtotal += v.price * l.qty;
  }
  const percent = promo ? (promoCodes[promo]?.percent ?? 0) : 0;
  const discount = Math.round((subtotal * percent) / 100);
  const total = subtotal - discount;
  return {
    count,
    subtotal,
    discount,
    total,
    toFreeShipping: Math.max(0, FREE_SHIPPING_FROM - total),
    freeShipping: total >= FREE_SHIPPING_FROM,
  };
}
