"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useCart } from "@/store/cart";

const loadFeatures = () => import("@/components/motion/features").then((r) => r.default);

/**
 * LazyMotion: у стартовому JS лише легкі m-компоненти, рушій анімацій підвантажується окремо.
 * reducedMotion="user": при prefers-reduced-motion Motion вимикає рух transform, лишаючи прозорість.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // кошик читаємо зі сховища лише після монтування — без розбіжностей із серверним HTML
    void useCart.persist.rehydrate();
  }, []);
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
