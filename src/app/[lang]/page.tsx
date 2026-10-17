import { Catalog } from "@/components/catalog/Catalog";
import { LazyDialogs } from "@/components/LazyDialogs";
import { FlyLayer } from "@/components/motion/FlyLayer";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { Bundles } from "@/components/sections/Bundles";
import { Care } from "@/components/sections/Care";
import { Delivery } from "@/components/sections/Delivery";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Newsletter } from "@/components/sections/Newsletter";
import { Reviews } from "@/components/sections/Reviews";
import { RoomPicker } from "@/components/sections/RoomPicker";
import { LiveRegion } from "@/components/ui/LiveRegion";
import { homeSchema, jsonLd } from "@/lib/seo/schema";
import { getI18n } from "@/lib/i18n-server";

export default async function Home() {
  const dict = await getI18n();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeSchema(dict)) }} />
      <div id="page">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-milk"
        >
          {dict.t.skip}
        </a>
        <Header />
        <main id="main">
          <Hero />
          <RoomPicker />
          <Catalog />
          <Bestsellers />
          <Bundles />
          <Care />
          <Reviews />
          <Delivery />
          <Faq />
          <Newsletter />
        </main>
        <Footer />
      </div>
      <LazyDialogs />
      <FlyLayer />
      <LiveRegion />
    </>
  );
}
