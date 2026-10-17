# «Листяна» — интернет-магазин комнатных растений

Одностраничный демо-магазин растений, кашпо и средств ухода с доставкой Новой Почтой. Проект для портфолио: каталог хранится в локальном файле, корзина — в `localStorage`, оформление заказа демонстрационное (без оплаты и отправки данных). Контент сайта на украинском.

Next.js 16 (App Router, SSG) · React 19 · строгий TypeScript · Tailwind CSS 4 · Motion · Zustand (persist). Результаты проверки — в [AUDIT.md](AUDIT.md).

## Запуск

Нужен Node.js 20.9+.

```sh
npm install
npm run dev          # http://localhost:3000
```

## Проверки

```sh
npm run typecheck    # типы (сначала next typegen, затем tsc)
npm run lint         # ESLint
```

## Продакшен

```sh
npm run build
npm run start        # http://localhost:3000
```

Страница пререндерится на сборке (SSG): весь каталог, тексты, мета-теги и JSON-LD есть в HTML.


## Языки

Две версии: `/uk/` и `/en/`, обе пререндерятся. Корень `/` выбирает язык до первой отрисовки: часовой пояс Украины → украинский, остальные → английский. Ручной выбор (UA / EN в шапке, на телефоне — в меню) сохраняется в `localStorage` и имеет приоритет.

- Данные: `src/data/*.ts` — на украинском, `src/data/en/*` — английские накладки той же формы (цены, фото, наличие общие). Адреса Новой Почты в EN — официальная транслитерация.
- Строки интерфейса — `src/data/ui.ts`. Серверные компоненты берут словарь через `getI18n()` (`next/root-params`), клиентские — `useI18n()` и `useFormat()` (цены «1 500 грн» / «1,500 UAH»).
- Корзина хранит только id, размер и количество, поэтому переживает смену языка.
- SEO: `hreflang`, `og:locale`, `<html lang>`, OG-картинка на каждом языке, sitemap с альтернативами; общая `global-not-found`.

## Статическая сборка (GitHub Pages)

```sh
STATIC=1 BASE_PATH=/lystiana NEXT_PUBLIC_SITE_URL=https://<user>.github.io/lystiana npm run build
```

Результат — папка `out/`. Workflow `.github/workflows/deploy-pages.yml` собирает и публикует сайт при пуше в `main`. Один раз: **Settings → Pages → Source: GitHub Actions**.

## Где что менять

| Что | Где |
| --- | --- |
| Товары, цены, размеры, наличие | `src/data/products.ts` |
| Фото товаров (Unsplash) | `src/data/photos.ts` |
| Категории, комнаты, сортировка | `src/data/catalog-meta.ts` |
| Наборы, советы, отзывы, доставка, FAQ | `src/data/content.ts` |
| Домен, контакты, промокоды, порог бесплатной доставки | `src/data/site.ts` |
| Справочник городов и отделений (демо) | `src/data/nova-poshta.ts` |
| Цвета, шрифты, стикеры, скотч | `src/app/globals.css` |
| JSON-LD | `src/lib/seo/schema.ts` |

Домен по умолчанию — `https://lystiana.com.ua` (canonical, Open Graph, sitemap). Его можно переопределить переменной `NEXT_PUBLIC_SITE_URL`.

## Демо-данные

- Промокод **LISTYANA10** — −10% на заказ.
- Тестовая карта **4242 4242 4242 4242**, любой будущий срок и CVV. Данные карты не сохраняются даже в браузере.
- Корзина хранится в `localStorage` под ключом `lystiana:cart`. В приватном режиме она живёт в памяти до перезагрузки.
