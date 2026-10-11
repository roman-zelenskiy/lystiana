import { categories } from "@/data/catalog-meta";
import { faq } from "@/data/content";
import { photo } from "@/data/photos";
import { products } from "@/data/products";
import { FREE_SHIPPING_FROM, GUARANTEE_DAYS, seo, siteUrl, store } from "@/data/site";
import type { Product } from "@/data/types";

const img = (key: string) => `${photo(key)}?w=1200&q=80&auto=format&fit=crop`;
const availability = { in: "InStock", low: "LimitedAvailability", out: "OutOfStock" } as const;

const ids = {
  store: `${siteUrl}/#store`,
  website: `${siteUrl}/#website`,
  shipping: `${siteUrl}/#shipping`,
  returns: `${siteUrl}/#returns`,
};

function productNode(p: Product) {
  const cat = categories.find((c) => c.id === p.categories[0])?.label;
  return {
    "@type": "Product",
    "@id": `${siteUrl}/#product-${p.id}`,
    sku: p.id,
    name: p.name,
    ...(p.latin && { alternateName: p.latin }),
    description: p.description,
    image: p.photos.map(img),
    brand: { "@type": "Brand", name: store.name },
    ...(cat && { category: cat }),
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      sku: `${p.id}-${v.size.toLowerCase()}`,
      name: `${p.name}, розмір ${v.size} (${v.label})`,
      price: v.price.toFixed(2),
      priceCurrency: "UAH",
      availability: `https://schema.org/${availability[p.stock]}`,
      itemCondition: "https://schema.org/NewCondition",
      url: `${siteUrl}/#katalog`,
      seller: { "@id": ids.store },
      shippingDetails: { "@id": ids.shipping },
      hasMerchantReturnPolicy: { "@id": ids.returns },
    })),
    ...(p.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.rating.value,
        reviewCount: p.rating.count,
        bestRating: 5,
      },
    }),
  };
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: `${siteUrl}/`,
        name: `«${store.name}» — кімнатні рослини`,
        inLanguage: "uk-UA",
        publisher: { "@id": ids.store },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/?q={search_term_string}#katalog` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": ["Store", "OnlineStore"],
        "@id": ids.store,
        name: store.name,
        legalName: store.legalName,
        description: seo.description,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/icon.svg`,
        image: `${siteUrl}/opengraph-image`,
        telephone: store.phone.replace(/\s/g, ""),
        email: store.email,
        priceRange: "160–4290 грн",
        currenciesAccepted: "UAH",
        paymentAccepted: "Картка, накладений платіж",
        areaServed: { "@type": "Country", name: "Україна" },
        address: {
          "@type": "PostalAddress",
          streetAddress: store.street,
          addressLocality: store.city,
          postalCode: store.postalCode,
          addressCountry: "UA",
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "19:00",
        },
        sameAs: [store.instagram, store.telegram, store.tiktok],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: store.rating.value,
          reviewCount: store.rating.count,
          bestRating: 5,
        },
        hasMerchantReturnPolicy: { "@id": ids.returns },
      },
      {
        "@type": "OfferShippingDetails",
        "@id": ids.shipping,
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "UA" },
        shippingRate: { "@type": "MonetaryAmount", value: 70, currency: "UAH" },
        freeShippingThreshold: { "@type": "MonetaryAmount", value: FREE_SHIPPING_FROM, currency: "UAH" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
      {
        "@type": "MerchantReturnPolicy",
        "@id": ids.returns,
        applicableCountry: "UA",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: GUARANTEE_DAYS,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
      {
        "@type": "ItemList",
        "@id": `${siteUrl}/#katalog`,
        name: "Каталог кімнатних рослин, кашпо та засобів догляду",
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: productNode(p) })),
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/** Серіалізація без можливості закрити <script> зсередини даних */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
