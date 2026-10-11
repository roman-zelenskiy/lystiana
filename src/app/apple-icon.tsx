import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e4a36" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path d="M32 10c13 6 19 16 18 26-1 9-8 15-18 15S15 45 14 36c-1-10 5-20 18-26Z" fill="#8db87c" />
          <path d="M32 18v28M32 28l-7-5M32 35l8-6M32 41l-6-4" stroke="#1e4a36" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="16" r="5" fill="#ff7a63" />
        </svg>
      </div>
    ),
    size,
  );
}
