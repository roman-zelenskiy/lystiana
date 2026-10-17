/** English page content. Same shape as ../content.ts */
import * as uk from "../content";

export const perks = [
  { icon: "truck", title: "Nova Poshta in 1–3 days", text: "Free from 1,500 UAH" },
  { icon: "shield", title: "14-day guarantee", text: "Didn’t settle in? We’ll replace it" },
  { icon: "chat", title: "Care help on Telegram", text: "Replies within 15 minutes" },
] as unknown as typeof uk.perks;

const bn: Record<string, { name: string; pitch: string }> = {
  start: { name: "‘First plant’ bundle", pitch: "For anyone who has killed even a cactus" },
  cat: { name: "‘Cat approved’ bundle", pitch: "Everything safe for your furry flatmates" },
  jungle: { name: "‘Living-room jungle’ bundle", pitch: "A big statement that transforms a room" },
};

export const bundles: typeof uk.bundles = uk.bundles.map((b) => ({ ...b, ...bn[b.id] }));

export const careTips = [
  {
    icon: "drop",
    title: "Water by finger, not by calendar",
    text: "Push a finger 2–3 cm into the soil. Dry — water; damp — wait. Most plants die from overwatering, not drought.",
  },
  {
    icon: "sun",
    title: "Light matters more than fertiliser",
    text: "Two steps back from the window, there’s already half the light. If a plant stretches and goes pale, it’s simply too dark.",
  },
  {
    icon: "pot",
    title: "Don’t repot right away",
    text: "After the move, a plant needs 2–3 weeks to settle in. Repot in spring, and only when roots poke out of the holes.",
  },
  {
    icon: "leaf",
    title: "A yellow leaf isn’t a tragedy",
    text: "Old lower leaves die off naturally. Worry if young leaves turn yellow — and send us a photo, we’ll sort it out.",
  },
] as unknown as typeof uk.careTips;

export const guaranteeDiary = [
  { day: 1, text: "Unpack it and keep it away from the radiator" },
  { day: 3, text: "Don’t water if the soil is still damp" },
  { day: 7, text: "Send us a photo — we’ll suggest the best spot" },
  { day: 14, text: "Settled in! If not — a free replacement" },
] as unknown as typeof uk.guaranteeDiary;

const rv = [
  { name: "Olena", city: "Lviv", text: "The monstera arrived in two days, packed like crystal — not a single broken leaf. A week later it put out a new one!", alt: "A monstera from Lystiana by a shelf in the buyer’s bright room" },
  { name: "Dmytro", city: "Kyiv", text: "Bought a ZZ plant for the office. Twice I forgot to water it for two weeks — it didn’t care. The best plant for a programmer.", alt: "ZZ plant on the buyer’s desk" },
  { name: "Iryna", city: "Odesa", text: "I was looking for cat-safe plants, and there’s a separate filter for that. The cat has already tasted the spider plant — both alive and happy.", alt: "A cat next to plant pots on a windowsill" },
  { name: "Marta", city: "Kharkiv", text: "The peace lily drooped a bit after delivery. I messaged on Telegram — they said to water it and keep it in the shade, and the next day it stood up like new.", alt: "Peace lily on a wooden stand in the buyer’s living room" },
  { name: "Andrii", city: "Dnipro", text: "Got the ‘First plant’ bundle for my wife. The pot is even prettier in person, and the care card is a lovely touch.", alt: "A plant in a ceramic pot on a wooden stool" },
  { name: "Solomiia", city: "Ivano-Frankivsk", text: "The money plant has already given three babies, which I gave to friends. Now we have a Lystiana money-plant club.", alt: "Chinese money plant in a woven basket on a table" },
];

export const reviews = uk.reviews.map((r, i) => ({ ...r, ...rv[i] })) as unknown as typeof uk.reviews;

export const delivery = {
  methods: [
    { id: "warehouse", title: "Branch", time: "1–3 days", price: "from 70 UAH" },
    { id: "postomat", title: "Parcel locker", time: "1–3 days", price: "from 60 UAH", note: "for plants up to 40 cm" },
    { id: "courier", title: "Courier", time: "1–3 days", price: "from 110 UAH" },
  ],
  steps: [
    { title: "We pack", text: "We water the day before shipping, secure the soil and wrap it in kraft paper" },
    { title: "We ship", text: "Orders placed before 14:00 leave the same day, except Sundays" },
    { title: "We deliver", text: "Nova Poshta delivers in 1–3 days anywhere in Ukraine" },
    { title: "Your sill", text: "You unpack it — and the 14-day guarantee starts that day" },
  ],
  payment: ["Card online (Visa, Mastercard, Apple Pay, Google Pay)", "Cash on delivery"],
  winter: "At +5 °C and below, we pack plants with insulation and a thermal bag — for free.",
} as unknown as typeof uk.delivery;

export const faq = [
  {
    q: "What if the plant arrives damaged or doesn’t settle in?",
    a: "There’s a 14-day settling-in guarantee. Send a photo on Telegram or by email and we’ll replace the plant or refund you. No lengthy checks.",
  },
  {
    q: "How do you pack plants so they arrive intact?",
    a: "We secure the soil, wrap the foliage in kraft paper and place the pot in a box with a holder. In winter we add insulation and a thermal bag. In 2025, only 0.4% of plants arrived damaged.",
  },
  {
    q: "How much is delivery?",
    a: "Nova Poshta rates: from 60 UAH to a parcel locker, from 70 UAH to a branch, from 110 UAH by courier. Delivery is free from 1,500 UAH.",
  },
  {
    q: "Which plants are safe for cats and dogs?",
    a: "The catalogue has a ‘Pet-friendly’ filter: spider plant, calathea, prayer plant, money plant, peperomia, parlour palm, fern, African violet, orchid, olive and more. Monstera, figs, ZZ plant, aloe and snake plant are toxic to pets.",
  },
  {
    q: "Which plants are best for beginners?",
    a: "ZZ plant, snake plant, pothos, spider plant and the ‘Robusta’ rubber plant handle both shade and missed waterings. Look for the ‘Easy care’ label or the ‘Easy care’ category.",
  },
  {
    q: "Can I pick up my order myself?",
    a: "Yes, from our showroom in Kyiv at 21 Yaroslavska St (Mon–Sat 10:00–19:00). Mention pickup in the order comment.",
  },
  {
    q: "Do I need to repot the plant after buying it?",
    a: "No. Plants arrive in nursery pots with fresh soil. Just place them in a decorative pot and leave repotting until spring.",
  },
  {
    q: "How do I return an item?",
    a: "Pots and care supplies can be returned within 14 days if unused. Plants are covered by the settling-in guarantee. We pay for return shipping if the reason is our mistake.",
  },
] as unknown as typeof uk.faq;
