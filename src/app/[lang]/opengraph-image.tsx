import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { photo } from "@/data/photos";
import { langs } from "@/lib/i18n";

export const dynamic = "force-static";
export const alt = "«Листяна» · Lystiana — кімнатні рослини з доставкою по Україні · houseplants delivered across Ukraine";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

const og = {
  uk: { name: "Листяна", title: "Рослини, які виживуть навіть у тебе", a: "Гарантія 14 днів", b: "Нова Пошта по Україні" },
  en: { name: "Lystiana", title: "Plants that will survive even with you", a: "14-day guarantee", b: "Delivery across Ukraine" },
};
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const t = og[(await params).lang === "en" ? "en" : "uk"];
  const [dela, nunito] = await Promise.all([
    readFile(join(process.cwd(), "assets/dela-og.ttf")),
    readFile(join(process.cwd(), "assets/nunito-og.ttf")),
  ]);
  const pic = (key: string, w: number, h: number) => `${photo(key)}?w=${w * 2}&h=${h * 2}&fit=crop&q=70&fm=jpg`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbf5ea", fontFamily: "Nunito", position: "relative" }}>
        <div style={{ position: "absolute", right: 70, top: 40, width: 330, height: 330, borderRadius: 999, background: "#ffe08a" }} />
        <div style={{ position: "absolute", left: 600, bottom: -60, width: 220, height: 220, borderRadius: 999, background: "#ff7a63" }} />
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 0 0 72px", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: "#8db87c" }} />
            <div style={{ fontFamily: "Dela", fontSize: 36, color: "#1e4a36" }}>{t.name}</div>
          </div>
          <div style={{ fontFamily: "Dela", fontSize: 70, lineHeight: 1.04, color: "#1e4a36", marginTop: 40, display: "flex", flexWrap: "wrap" }}>
            {t.title}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            <div style={{ display: "flex", background: "#ffe08a", border: "4px solid #fff", borderRadius: 999, padding: "10px 22px", fontSize: 26, fontWeight: 700, color: "#1a2b22", transform: "rotate(-3deg)" }}>
              {t.a}
            </div>
            <div style={{ display: "flex", background: "#dbe8cf", border: "4px solid #fff", borderRadius: 999, padding: "10px 22px", fontSize: 26, fontWeight: 700, color: "#1e4a36", transform: "rotate(2deg)" }}>
              {t.b}
            </div>
          </div>
        </div>
        <img src={pic("hero-main", 330, 470)} width={330} height={470} alt="" style={{ position: "absolute", right: 150, top: 80, borderRadius: "999px 999px 36px 36px", border: "10px solid #fff", objectFit: "cover", transform: "rotate(-3deg)" }} />
        <img src={pic("monstera", 220, 220)} width={220} height={220} alt="" style={{ position: "absolute", right: 46, bottom: 50, borderRadius: 999, border: "8px solid #fff", objectFit: "cover" }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Dela", data: dela, weight: 400, style: "normal" },
        { name: "Nunito", data: nunito, weight: 700, style: "normal" },
      ],
    },
  );
}
