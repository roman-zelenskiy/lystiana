import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "«Листяна» — кімнатні рослини з доставкою",
    short_name: "Листяна",
    description: "Кімнатні рослини, кашпо та догляд з доставкою по Україні",
    start_url: "./",
    display: "standalone",
    background_color: "#fbf5ea",
    theme_color: "#1e4a36",
    lang: "uk",
    icons: [
      { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
