/** English legal pages. Same shape as ../legal.ts */
import type { legal as uk } from "../legal";

export const legal = {
  privacy: {
    title: "Privacy policy",
    updated: "1 September 2026",
    sections: [
      {
        h: "This is a demo website",
        p: "Lystiana is a portfolio project. Orders, payments and subscriptions are only simulated: no data is sent to a server, and card details aren’t stored even in your browser.",
      },
      {
        h: "What is stored in your browser",
        p: "Your cart (items, sizes, quantities) and any promo code are kept in your browser’s localStorage so the cart survives a reload. You can clear them by removing items from the cart or clearing site data in your browser settings.",
      },
      { h: "Cookies and analytics", p: "The site uses no advertising cookies or analytics." },
      {
        h: "A real shop",
        p: "A real shop would list the personal data controller, the purpose of processing (fulfilling orders, Nova Poshta delivery), retention periods and the buyer’s rights under the Law of Ukraine “On Personal Data Protection”.",
      },
    ],
  },
  returns: {
    title: "Returns",
    updated: "1 September 2026",
    sections: [
      {
        h: "14-day settling-in guarantee",
        p: "If a plant dies or noticeably declines within 14 days of receipt, send a photo by email or on Telegram. We’ll replace the plant for free or refund you — your choice.",
      },
      {
        h: "Damage in transit",
        p: "Check the parcel at the branch. If the plant or pot is damaged, photograph it in the packaging and we’ll send a replacement at our own cost.",
      },
      {
        h: "Pots and care supplies",
        p: "Can be returned within 14 days if unused and in their original packaging. The buyer pays for return shipping unless the reason is our mistake.",
      },
      { h: "Refunds", p: "We refund to your card within 3 working days of confirming the replacement or return." },
    ],
  },
} as unknown as typeof uk;
