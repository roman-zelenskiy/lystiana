import type { SVGProps } from "react";

/** Набір іконок «Листяни»: контур 2px, округлі кінці, viewBox 24 */
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M5 12h13m-5-6 6 6-6 6" />,
  "arrow-left": <path d="M19 12H6m5-6-6 6 6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: <><path d="M4 7h16M10 7V4.5h4V7M6.5 7l1 12.5h9l1-12.5" /><path d="M10.5 11v5M13.5 11v5" /></>,
  undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></>,
  pot: <><path d="M5 10h14l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3L5 10Z" /><path d="M4 10h16" /></>,
  sprout: <><path d="M12 10V6" /><path d="M12 7c0-2.2-1.8-4-4-4 0 2.2 1.8 4 4 4Z" /><path d="M12 6c0-1.7 1.3-3 3-3 0 1.7-1.3 3-3 3Z" /></>,
  truck: <><path d="M3 6.5h11v9H3zM14 9.5h3.8l3.2 3.4v2.6h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.3 3 7.8 7 9.5 4-1.7 7-5.2 7-9.5V6l-7-3Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  chat: <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />,
  drop: <path d="M12 3.5c3.5 4.2 5.5 7.4 5.5 10a5.5 5.5 0 0 1-11 0c0-2.6 2-5.8 5.5-10Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5" /></>,
  shade: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z" />,
  diffused: <><path d="M7 17.5h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 7 10a3.8 3.8 0 0 0 0 7.5Z" /><path d="M16 4.5l.8-1.5M20.3 7.2l1.5-.7" /></>,
  paw: <><ellipse cx="12" cy="16" rx="4" ry="3.3" /><circle cx="6.5" cy="10.5" r="1.7" /><circle cx="17.5" cy="10.5" r="1.7" /><circle cx="9.3" cy="6.5" r="1.7" /><circle cx="14.7" cy="6.5" r="1.7" /></>,
  leaf: <><path d="M5 19C5 10 10 5 20 4c0 9-5 15-13 15H5Z" /><path d="M5 19c3-4 6-7 10-9" /></>,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h4" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.6" /></>,
  box: <><path d="M3.5 8 12 4l8.5 4v8L12 20l-8.5-4V8Z" /><path d="M3.5 8 12 12l8.5-4M12 12v8" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  locker: <><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M12 3.5v17M4 9.5h8M4 15h8M12 12h8" /></>,
  courier: <><circle cx="12" cy="6.5" r="3" /><path d="M5.5 20.5c.7-4 3.3-6.5 6.5-6.5s5.8 2.5 6.5 6.5" /></>,
  phone: <path d="M6.6 3.5h3l1.4 4.2-2 1.3a11 11 0 0 0 6 6l1.3-2 4.2 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  telegram: <path d="m21 4.5-3 15-5.5-4-3 3v-4.5L18 6.5l-10 6.5-5-1.8L21 4.5Z" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" /></>,
  tiktok: <path d="M14 3.5v11a3.8 3.8 0 1 1-3.8-3.8M14 3.5c.4 2.6 2.4 4.6 5 4.8" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  gift: <><rect x="3.5" y="8" width="17" height="4" rx="1" /><path d="M5 12v8.5h14V12M12 8v12.5M12 8C10.5 4 7 4.5 7.5 6.5S12 8 12 8Zm0 0c1.5-4 5-3.5 4.5-1.5S12 8 12 8Z" /></>,
  sparkle: <path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7Z" />,
  bag: <><path d="M5 8h14l-1 12.5H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  ruler: <><rect x="3" y="8" width="18" height="8" rx="1.5" /><path d="M7 8v3M11 8v4M15 8v3M19 8v4" /></>,
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 22, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
