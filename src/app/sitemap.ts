import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

// потрібно для статичного експорту (GitHub Pages)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, lastModified: "2026-10-11", changeFrequency: "weekly", priority: 1 }];
}
