import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// потрібно для статичного експорту (GitHub Pages)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { uk: `${siteUrl}/uk/`, en: `${siteUrl}/en/` };
  return (["uk", "en"] as const).map((l) => ({
    url: `${siteUrl}/${l}/`,
    lastModified: "2026-10-17",
    changeFrequency: "weekly",
    priority: l === "uk" ? 1 : 0.9,
    alternates: { languages },
  }));
}
