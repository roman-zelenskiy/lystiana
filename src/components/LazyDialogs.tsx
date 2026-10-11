"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { useCatalog } from "@/store/catalog";
import { useCheckout } from "@/store/checkout";

const loaders = {
  quickView: () => import("@/components/catalog/QuickView").then((r) => r.QuickView),
  cart: () => import("@/components/cart/CartDrawer").then((r) => r.CartDrawer),
  checkout: () => import("@/components/checkout/CheckoutDialog").then((r) => r.CheckoutDialog),
};

const QuickView = dynamic(loaders.quickView, { ssr: false });
const CartDrawer = dynamic(loaders.cart, { ssr: false });
const CheckoutDialog = dynamic(loaders.checkout, { ssr: false });

/**
 * Діалоги (швидкий перегляд, кошик, оформлення) не потрібні для першого екрана:
 * їхній код вантажиться у вільний час після завантаження, а монтуються вони при першому відкритті.
 */
export function LazyDialogs() {
  const quickView = useCatalog((s) => s.quickView);
  const cartOpen = useCart((s) => s.open);
  const checkoutOpen = useCheckout((s) => s.open);
  const [mounted, setMounted] = useState({ quickView: false, cart: false, checkout: false });

  if ((quickView && !mounted.quickView) || (cartOpen && !mounted.cart) || (checkoutOpen && !mounted.checkout)) {
    setMounted({
      quickView: mounted.quickView || !!quickView,
      cart: mounted.cart || cartOpen,
      checkout: mounted.checkout || checkoutOpen,
    });
  }

  useEffect(() => {
    const preload = () => Object.values(loaders).forEach((load) => void load());
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 2500);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {mounted.quickView && <QuickView />}
      {mounted.cart && <CartDrawer />}
      {mounted.checkout && <CheckoutDialog />}
    </>
  );
}
