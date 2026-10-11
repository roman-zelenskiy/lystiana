"use client";

import { useAnnounce } from "./announce";

export function LiveRegion() {
  const { text, n } = useAnnounce();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {/* ключ змінюється — однаковий текст оголошується вдруге */}
      <span key={n}>{text}</span>
    </div>
  );
}
