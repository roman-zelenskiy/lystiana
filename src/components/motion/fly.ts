"use client";

import { create } from "zustand";

export type Flight = { id: number; src: string; from: DOMRect; to: DOMRect };

type FlyState = { flights: Flight[]; launch: (src: string, from: DOMRect) => void; land: (id: number) => void };

let seq = 0;

/** Політ мініатюри рослини по дузі в іконку кошика */
export const useFly = create<FlyState>()((set) => ({
  flights: [],
  launch: (src, from) => {
    const target = document.getElementById("cart-target");
    if (!target) return;
    const to = target.getBoundingClientRect();
    set((s) => ({ flights: [...s.flights, { id: ++seq, src, from, to }] }));
  },
  land: (id) => set((s) => ({ flights: s.flights.filter((f) => f.id !== id) })),
}));
