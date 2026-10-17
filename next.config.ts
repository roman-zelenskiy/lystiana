import type { NextConfig } from "next";

// Статична збірка для GitHub Pages: STATIC=1, базовий шлях — BASE_PATH (напр. /lystiana)
const isStatic = process.env.STATIC === "1";
const basePath = isStatic ? process.env.BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  // два кореневі layout (/[lang] і корінь вибору мови) → одна глобальна 404
  experimental: { globalNotFound: true },
  ...(isStatic && { output: "export", trailingSlash: true, basePath }),
  images: {
    // Фото з CDN Unsplash: розмір і формат (AVIF/WebP) підбирає сам CDN — однаково для next start і статики
    loader: "custom",
    loaderFile: "./src/lib/unsplash-loader.ts",
    qualities: [70, 80],
    // меньше ширин — коротший srcset у кожного з ~70 зображень і краще влучання в кеш CDN
    deviceSizes: [480, 640, 828, 1080, 1440, 1920],
    imageSizes: [64, 96, 160, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
