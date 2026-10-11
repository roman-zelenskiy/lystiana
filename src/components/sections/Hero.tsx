import Image from "next/image";
import { perks } from "@/data/content";
import { photo } from "@/data/photos";
import { GUARANTEE_DAYS } from "@/data/site";
import { BreezeArea, Sway } from "@/components/motion/Breeze";
import { BladeLeaves, CoinLeaves, FernFrond, MonsteraLeaf } from "@/components/motion/Leaves";
import { Icon, type IconName } from "@/components/ui/Icon";

const tilt = ["-rotate-3", "rotate-2", "-rotate-1"];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">
      <div className="wrap grid items-center gap-x-8 gap-y-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10 lg:col-start-1 lg:row-start-1">
          <p className="sticker -rotate-2 bg-butter text-ink">
            <Icon name="truck" size={18} /> Доставка Новою Поштою по всій Україні
          </p>

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.5rem,6.6vw,5.4rem)] text-forest">
            Рослини, які виживуть{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">навіть у&nbsp;тебе</span>
              {/* маркерне підкреслення від руки */}
              <svg
                className="absolute -bottom-[0.2em] left-0 -z-0 h-[0.3em] w-full"
                viewBox="0 0 300 30"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M4 18C60 8 140 6 296 14c-80 4-170 6-240 14" fill="none" stroke="var(--color-coral)" strokeWidth="11" strokeLinecap="round" opacity=".85" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
            Купити кімнатні рослини з доставкою — легко: підберемо невибагливі рослини під вашу кімнату, привеземо за 1–3 дні
            і дамо{" "}
            <strong className="font-extrabold text-ink">гарантію приживлення {GUARANTEE_DAYS} днів</strong>. Не прижилася —
            замінимо.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#katalog" className="btn btn-forest h-14 px-7 text-lg">
              До каталогу <Icon name="arrow" />
            </a>
            <a href="#kimnata" className="btn btn-ghost h-14 px-6">
              Підібрати під кімнату
            </a>
          </div>
          <p className="hand mt-4 ml-2 -rotate-2 text-2xl text-coral-deep">↑ навіть якщо забуваєте поливати</p>

        </div>

        {/* Колаж: вирізки фото на скотчі + ілюстроване листя, що гойдається на вітрі */}
        <BreezeArea className="relative mx-auto aspect-[1/1.02] w-full max-w-[600px] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="absolute top-[6%] right-[4%] h-[46%] w-[46%] rounded-full bg-butter" aria-hidden="true" />
          <div className="absolute bottom-[4%] left-[2%] h-[30%] w-[30%] rounded-full bg-coral/80" aria-hidden="true" />

          <Sway className="absolute top-[4%] left-[14%] h-[80%] w-[58%]" weight={0.15} amplitude={0.6} duration={7} depth={0.15}>
            <div className="relative h-full w-full -rotate-2">
              <div className="mask-arch relative h-full w-full overflow-hidden border-[6px] border-white bg-paper shadow-[var(--shadow-card)]">
                <Image
                  src={photo("hero-main")}
                  alt="Світла вітальня з фікусом ліровидним біля вікна і плетеним кріслом"
                  fill
                  // без preload: на мобільному колаж нижче тексту і не має конкурувати з ним;
                  // на десктопі браузер сам підніме пріоритет, бо фото в першому екрані
                  loading="eager"
                  sizes="(min-width: 1024px) 340px, 58vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-6" aria-hidden="true" />
            </div>
          </Sway>

          <Sway className="absolute right-[2%] bottom-[10%] h-[44%] w-[38%]" weight={0.4} amplitude={1.2} duration={5.5} delay={1.2} depth={0.45}>
            <div className="relative h-full w-full rotate-3">
              <div className="mask-leaf relative h-full w-full overflow-hidden bg-paper">
                <Image
                  src={photo("hero-2")}
                  alt="Руки тримають горщик із молодою рослиною"
                  fill
                  sizes="(min-width: 1024px) 230px, 38vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Sway>

          <Sway className="absolute top-[52%] left-[0%] h-[30%] w-[30%]" weight={0.5} amplitude={1.5} duration={4.6} delay={2} depth={0.7}>
            <div className="relative h-full w-full -rotate-6">
              <div className="mask-pebble relative h-full w-full overflow-hidden border-[5px] border-white shadow-[var(--shadow-card)]">
                <Image
                  src={photo("hero-3")}
                  alt="Квітучі рослини на світлому підвіконні"
                  fill
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Sway>

          {/* ілюстровані листки: сильніше реагують на вітер */}
          <Sway className="absolute -top-[2%] left-[2%] w-[22%]" weight={1.6} amplitude={5} duration={3.8} depth={0.3} origin="50% 100%">
            <FernFrond className="h-auto w-full -rotate-[18deg]" />
          </Sway>
          <Sway className="absolute top-[30%] right-0 w-[26%] sm:right-[-4%]" weight={1.3} amplitude={4} duration={4.4} delay={0.7} depth={0.55}>
            <MonsteraLeaf className="h-auto w-full rotate-[22deg]" />
          </Sway>
          <Sway className="absolute bottom-[-2%] left-[34%] w-[20%]" weight={1.8} amplitude={6} duration={3.2} delay={1.6} depth={0.8}>
            <BladeLeaves className="h-auto w-full" />
          </Sway>
          <Sway className="absolute top-[2%] right-[30%] w-[15%]" weight={2} amplitude={7} duration={3} delay={0.4} depth={0.4}>
            <CoinLeaves className="h-auto w-full" />
          </Sway>

          <p className="sticker absolute top-[64%] left-[46%] rotate-[8deg] bg-coral text-ink">
            від 160 грн
          </p>
          <p className="hand absolute top-[-1%] right-[0%] max-w-[9rem] rotate-[6deg] text-center text-xl text-forest">
            Ліза, 3 роки в нашій родині
          </p>
        </BreezeArea>
        <ul className="relative z-10 grid gap-3 self-start sm:grid-cols-3 lg:col-start-1 lg:row-start-2" aria-label="Наші переваги">
          {perks.map((p, i) => (
            <li
              key={p.title}
              className={`flex items-center gap-3 rounded-[1.5rem] border-[3px] border-white bg-cream p-3 shadow-[var(--shadow-sticker)] ${tilt[i]}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage text-forest">
                <Icon name={p.icon as IconName} size={20} />
              </span>
              <span className="leading-tight">
                <span className="block font-extrabold">{p.title}</span>
                <span className="block text-sm text-muted">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
