"use client";

import { useReducedMotion } from "motion/react";
import { useI18n } from "@/components/I18n";
import type { Size } from "@/data/types";
import { useCart } from "@/store/cart";
import { useFly } from "@/components/motion/fly";
import { useAnnounce } from "@/components/ui/announce";

/** Додає товар у кошик: рослина летить до іконки кошика, скрінрідер чує підтвердження */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const bump = useCart((s) => s.bump);
  const launch = useFly((s) => s.launch);
  const say = useAnnounce((s) => s.say);
  const reduce = useReducedMotion();
  const t = useI18n().t.cart;

  return (opts: { id: string; size: Size; qty?: number; name: string; sizeLabel?: string; photo: string; from?: Element | null }) => {
    const qty = opts.qty ?? 1;
    add(opts.id, opts.size, qty);
    if (opts.from && !reduce) launch(opts.photo, opts.from.getBoundingClientRect());
    else bump();
    say(t.added(opts.name, opts.sizeLabel ?? "", qty));
  };
}
