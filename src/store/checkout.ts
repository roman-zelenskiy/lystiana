"use client";

import { create } from "zustand";

/** Відкрите/закрите оформлення замовлення (саме замовлення живе в стані діалогу) */
export const useCheckout = create<{ open: boolean; start: () => void; close: () => void }>()((set) => ({
  open: false,
  start: () => set({ open: true }),
  close: () => set({ open: false }),
}));
