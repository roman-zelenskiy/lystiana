"use client";

import { create } from "zustand";

/** Повідомлення для скрінрідерів (aria-live): «Додано в кошик», «Знайдено 12 рослин» тощо */
export const useAnnounce = create<{ text: string; n: number; say: (text: string) => void }>()((set) => ({
  text: "",
  n: 0,
  say: (text) => set((s) => ({ text, n: s.n + 1 })),
}));
