/** English catalog labels. Same shape as ../catalog-meta.ts */
import * as uk from "../catalog-meta";
import type { CategoryId, Light, RoomId } from "../types";

const cat: Record<CategoryId, { label: string; lead: string }> = {
  nevybahlyvi: { label: "Easy care", lead: "Forgiving plants that won’t mind a missed watering" },
  velyki: { label: "Large plants", lead: "Large houseplants for living rooms and offices" },
  "dlia-tini": { label: "Low light", lead: "Shade-tolerant plants for rooms far from the window" },
  "pet-friendly": { label: "Pet-friendly", lead: "Plants that are safe for cats and dogs" },
  kvituchi: { label: "Flowering", lead: "Flowering houseplants" },
  kashpo: { label: "Pots", lead: "Plant pots: ceramic, rattan, concrete, macramé" },
  dohliad: { label: "Care", lead: "Care supplies: fertiliser, soil, watering cans, misters" },
};

export const categories: typeof uk.categories = uk.categories.map((c) => ({ ...c, ...cat[c.id] }));

export const lightLabel: Record<Light, string> = { shade: "Shade", diffused: "Indirect", bright: "Bright" };

export const lightHint: Record<Light, string> = {
  shade: "A north-facing window or far from any window",
  diffused: "Bright, but no direct sun on the leaves",
  bright: "A sunny south- or west-facing sill",
};

export const difficultyLabel = ["", "Easy care", "Moderate care", "For experienced growers"] as unknown as typeof uk.difficultyLabel;

const rm: Record<RoomId, { label: string; note: string }> = {
  spalnia: { label: "Bedroom", note: "Quiet plants that don’t need daily attention" },
  kukhnia: { label: "Kitchen", note: "Compact ones for sills and shelves" },
  vitalnia: { label: "Living room", note: "Big statement plants and green corners" },
  ofis: { label: "Office", note: "They handle air conditioning and weekends without water" },
  vanna: { label: "Bathroom", note: "They love humid air and soft light" },
};

export const rooms: typeof uk.rooms = uk.rooms.map((r) => ({ ...r, ...rm[r.id] }));

export const sorts: typeof uk.sorts = [
  { id: "popular", label: "Popular" },
  { id: "cheap", label: "Price: low to high" },
  { id: "expensive", label: "Price: high to low" },
  { id: "new", label: "Newest" },
];

const pr: Record<string, string> = { all: "Any price", to500: "under 500 UAH", "500-1000": "500–1,000 UAH", from1000: "from 1,000 UAH" };

export const priceRanges = uk.priceRanges.map((r) => ({ ...r, label: pr[r.id] })) as unknown as typeof uk.priceRanges;

export const PAGE_SIZE = uk.PAGE_SIZE;
