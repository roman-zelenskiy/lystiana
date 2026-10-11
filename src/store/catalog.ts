"use client";

import { create } from "zustand";
import { PAGE_SIZE, type PriceRangeId, type SortId } from "@/data/catalog-meta";
import type { CategoryId, Difficulty, Light, RoomId } from "@/data/types";

export type CatalogFilters = {
  category: CategoryId | "all";
  light: Light | "all";
  /** Максимально допустима складність догляду */
  difficulty: Difficulty;
  petSafe: boolean;
  price: PriceRangeId;
  sort: SortId;
  query: string;
  room: RoomId | null;
};

export const defaultFilters: CatalogFilters = {
  category: "all",
  light: "all",
  difficulty: 3,
  petSafe: false,
  price: "all",
  sort: "popular",
  query: "",
  room: null,
};

type CatalogState = CatalogFilters & {
  limit: number;
  /** Товар у швидкому перегляді */
  quickView: string | null;
  set: (patch: Partial<CatalogFilters>) => void;
  reset: () => void;
  more: () => void;
  openQuickView: (id: string | null) => void;
};

export const useCatalog = create<CatalogState>()((set) => ({
  ...defaultFilters,
  limit: PAGE_SIZE,
  quickView: null,
  // будь-яка зміна фільтрів повертає «сторінку» до початку
  set: (patch) => set({ ...patch, limit: PAGE_SIZE }),
  reset: () => set({ ...defaultFilters, limit: PAGE_SIZE }),
  more: () => set((s) => ({ limit: s.limit + PAGE_SIZE })),
  openQuickView: (id) => set({ quickView: id }),
}));
