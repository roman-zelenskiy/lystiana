/** English product texts. Prices, photos, stock and care data are shared with ../products.ts */
import { products as uk } from "../products";
import type { Product } from "../types";

type Text = { name: string; blurb: string; description: string; alt: string };

const t: Record<string, Text> = {
  monstera: {
    name: "Monstera deliciosa",
    blurb: "The plant with split leaves that starts every urban jungle.",
    description:
      "Monstera grows fast, forgives a missed watering and puts out new split leaves every spring. It likes bright indirect light and copes calmly with dry radiator air in winter. Arrives in a nursery pot with a coir support pole.",
    alt: "Monstera deliciosa with large split leaves in a light pot",
  },
  zamiokulkas: {
    name: "ZZ plant",
    blurb: "A glossy “money tree” that will forgive a month without water.",
    description:
      "It stores water in its rhizomes, so drought barely bothers it — overwatering is what usually kills it. It grows even in a corner far from the window and in offices under artificial light.",
    alt: "ZZ plant with glossy dark green leaves on a wooden stand",
  },
  sansevieriia: {
    name: "Snake plant ‘Laurentii’",
    blurb: "Strict, graphic and almost indestructible — the perfect first plant.",
    description:
      "Stiff leaves with yellow edges look great in a minimalist interior. It tolerates shade, dry air and forgetful owners. It releases oxygen at night, which is why it often ends up in bedrooms.",
    alt: "Snake plant with tall striped leaves edged in yellow",
  },
  epipremnum: {
    name: "Golden pothos",
    blurb: "A trailing vine that drapes beautifully from a shelf and grows almost anywhere.",
    description:
      "Its golden-streaked vines grow back quickly, and cuttings root easily in water — perfect for sharing with friends. Great for shelves, cabinets and hanging planters.",
    alt: "Golden pothos with long vines trailing from a shelf",
  },
  "fikus-lirovydnyi": {
    name: "Fiddle-leaf fig",
    blurb: "A sculptural tree with violin-shaped leaves for a bright living room.",
    description:
      "Large wavy leaves make it the centrepiece of any room. It loves bright light by a window and dislikes moving — give it two weeks to settle in after delivery, and we’ll tell you exactly how.",
    alt: "Tall fiddle-leaf fig with large wavy leaves by a window",
  },
  "fikus-elastyka": {
    name: "Rubber plant ‘Robusta’",
    blurb: "Shiny leathery leaves and a temperament that shrugs off small mistakes.",
    description:
      "A classic that’s back in fashion: dark glossy leaves, a straight trunk and fast growth. Wipe the leaves with a damp cloth once a month and it will shine like in the photo.",
    alt: "Rubber plant with dark green glossy leaves in a ceramic pot",
  },
  khlorofitum: {
    name: "Spider plant",
    blurb: "A cat-safe fountain of striped leaves with “babies” on runners.",
    description:
      "One of the best natural air purifiers and a plant you can safely keep next to a cat. It “multiplies” on its own, sending out runners with small rosettes you can pot up separately.",
    alt: "Spider plant with striped green and white leaves in a hanging pot",
  },
  kalateia: {
    name: "Calathea orbifolia",
    blurb: "Round striped leaves that rise in the evening as if folding their hands.",
    description:
      "Calathea is for those who already feel a bit confident. It likes humid air, soft water and shade, and in return it “moves” its leaves every day. Safe for cats and dogs.",
    alt: "Calathea orbifolia with large round leaves striped in silver",
  },
  maranta: {
    name: "Prayer plant ‘Fascinator’",
    blurb: "Leaves with red veins that look hand-painted.",
    description:
      "A compact plant for a shady shelf or a bathroom with a window. It dislikes direct sun and drying out, but it’s pet-safe and very photogenic.",
    alt: "Prayer plant with patterned leaves and red veins",
  },
  pileia: {
    name: "Chinese money plant",
    blurb: "A “money plant” with coin-shaped leaves for your desk.",
    description:
      "Round leaves on thin stems that reach for the light — turn the pot once a week to keep it straight. Easy to care for, pet-safe and generous with offshoots.",
    alt: "Chinese money plant with round coin-like leaves in a white pot",
  },
  peperomiia: {
    name: "Baby rubber plant",
    blurb: "Fleshy glossy leaves that store water for a rainy day.",
    description:
      "Compact, slow-growing and very patient with missed waterings. Looks great on a kitchen sill or among other plants on a shelf. Safe for cats.",
    alt: "Baby rubber plant with fleshy glossy leaves",
  },
  nefrolepis: {
    name: "Boston fern",
    blurb: "A lush fern that adores a humid bathroom and shade.",
    description:
      "Lacy fronds bring a forest feel even to a small flat. It needs humid air and even watering — a bathroom with a window is ideal. Pet-safe.",
    alt: "Lush Boston fern in a woven basket",
  },
  spatyfilum: {
    name: "Peace lily",
    blurb: "Blooms with white sails even in shade and tells you when it’s thirsty.",
    description:
      "When a peace lily wants water, its leaves droop a little — an hour after watering it perks right up. It blooms several times a year and is happy far from the window.",
    alt: "Peace lily with dark green leaves and white flowers",
  },
  anturium: {
    name: "Anthurium andraeanum",
    blurb: "Lacquered red flowers that last up to two months.",
    description:
      "A bright accent for a living room or kitchen: the blooms look like glossy hearts and stay for weeks. It likes warmth, indirect light and regular but moderate watering.",
    alt: "Anthurium with glossy red heart-shaped flowers",
  },
  orkhideia: {
    name: "Phalaenopsis orchid",
    blurb: "Butterfly flowers for 2–3 months and no complicated magic.",
    description:
      "Phalaenopsis is the easiest orchid: soak the pot in water for 15 minutes once a week and keep it out of direct sun. We ship orchids in bud so the flowering starts at your place.",
    alt: "White phalaenopsis orchid in full bloom",
  },
  senpoliia: {
    name: "African violet",
    blurb: "Grandma’s violet, reimagined: it blooms almost all year round.",
    description:
      "Fuzzy leaves and a crown of small flowers on your kitchen sill. Water into the saucer so no water gets on the leaves, and it will bloom in waves all year.",
    alt: "African violet with purple flowers and fuzzy leaves",
  },
  streltsiia: {
    name: "Bird of paradise",
    blurb: "Banana-like leaves up to two metres — a real tropic in your living room.",
    description:
      "For a bright room with a big window: it shoots up quickly and unfurls new leaves like a fan. We ship large trees in a separate box with the soil secured.",
    alt: "Large bird of paradise with wide banana-like leaves in a living room",
  },
  olyvka: {
    name: "Olive tree",
    blurb: "A silvery crown and the mood of a Mediterranean terrace.",
    description:
      "An olive needs the brightest spot in the house and a cool winter — a glazed balcony or a sill away from the radiator. Pet-safe and ages beautifully.",
    alt: "Olive tree with a silvery crown in a ceramic planter",
  },
  alokaziia: {
    name: "Alocasia ‘Polly’",
    blurb: "Arrow-shaped leaves with white veins, for collectors.",
    description:
      "Striking but fussy: it loves warmth, humidity and stability. In winter it may go dormant and drop a couple of leaves — that’s normal, they’ll come back in spring. We include a personal care guide.",
    alt: "Alocasia with dark velvety leaves and contrasting pale veins",
  },
  filodendron: {
    name: "Heartleaf philodendron",
    blurb: "A vine with heart-shaped leaves for a shelf far from the window.",
    description:
      "It grows faster than you’d expect and forgives shade. Train the vines along a shelf or up a pole, and in six months you’ll have a green wall.",
    alt: "Heartleaf philodendron with vines trailing from a shelf",
  },
  ekheveriia: {
    name: "Echeveria",
    blurb: "A stone rose for a sunny sill and forgetful owners.",
    description:
      "A succulent with a rosette like a wax flower. It needs bright sun and very infrequent watering. Looks great with other succulents in a shallow bowl.",
    alt: "Echeveria succulent with a blue-grey rosette in a small pot",
  },
  aloe: {
    name: "Aloe vera",
    blurb: "A first-aid kit on your sill: the leaf gel soothes skin.",
    description:
      "A sun-loving succulent that’s fine with watering every two or three weeks. Keep it away from cats and dogs — aloe sap is toxic to them.",
    alt: "Aloe vera with fleshy serrated leaves in a light pot",
  },
  khamedoreia: {
    name: "Parlour palm",
    blurb: "A shade-tolerant palm that’s safe for cats and dogs.",
    description:
      "Light feathery fronds add a holiday feel even to a north-facing room. It grows slowly, doesn’t need sun and won’t harm your pets.",
    alt: "Parlour palm with light feathery fronds in a woven basket",
  },
  behoniia: {
    name: "Begonia maculata",
    blurb: "Silver polka-dot leaves and delicate white flowers.",
    description:
      "The most photogenic begonia: olive-green leaves with silver dots and a burgundy underside. It likes indirect light and humid air, but not misting on the leaves.",
    alt: "Begonia maculata with silver polka-dot leaves",
  },
  dratsena: {
    name: "Dragon tree",
    blurb: "A graphic little palm on slender trunks for a modern interior.",
    description:
      "Tufts of narrow red-edged leaves on curved trunks. It tolerates dry air and forgetfulness and grows up rather than out, so it fits even a narrow gap between walls.",
    alt: "Dragon tree with slender trunks and narrow leaves",
  },
  kalankhoe: {
    name: "Flaming Katy",
    blurb: "A bouquet that won’t wilt: clusters of bright flowers for 6–8 weeks.",
    description:
      "A flowering succulent, so it needs little water. It’s happiest on a bright sill. A great gift instead of cut flowers.",
    alt: "Kalanchoe with bright small flowers in a small pot",
  },
  khoia: {
    name: "Wax plant",
    blurb: "A waxy vine that smells of honey when its star-shaped flowers open.",
    description:
      "A long-lived vine with thick leaves: it survives missed waterings and blooms more every year. Don’t move the pot once buds appear — hoya doesn’t like it.",
    alt: "Wax plant with waxy leaves and star-shaped flower clusters",
  },
  "kashpo-halka": {
    name: "Ceramic pot ‘Pebble’",
    blurb: "Milk-white matte glaze and the soft curves of a river stone.",
    description:
      "Handmade in a Lviv workshop. No drainage hole — place the plant inside in its nursery pot so excess water never reaches your furniture. Each pot varies slightly in shade.",
    alt: "White matte ceramic ‘Pebble’ pot with rounded shapes",
  },
  "kashpo-rotanh": {
    name: "Woven rattan basket",
    blurb: "A warm boho accent for large plants in the living room.",
    description:
      "Hand-woven from natural rattan with a waterproof liner inside. Ideal for a monstera, parlour palm or fig in a large nursery pot.",
    alt: "Woven rattan basket for a large houseplant",
  },
  "kashpo-beton": {
    name: "Concrete pot ‘Brutal’",
    blurb: "Grey architectural concrete for succulents and snake plants.",
    description:
      "Cast from lightweight concrete and sealed with a water-repellent coating. Comes with a drainage hole and a cork base that won’t scratch your sill.",
    alt: "Grey concrete pots with plants on a wooden table",
  },
  "kashpo-makrame": {
    name: "Macramé hanger ‘Wave’",
    blurb: "Cotton weaving to let trailing plants hang beautifully.",
    description:
      "Hand-knotted from thick cotton cord, 95 cm long. Holds a pot up to 4 kg — just right for a pothos, philodendron or spider plant.",
    alt: "Macramé plant hanger with a trailing plant by a window",
  },
  "kashpo-nizhky": {
    name: "Mid-century planter on legs",
    blurb: "A planter on a wooden stand — your plant 30 cm closer to the light.",
    description:
      "A ceramic bowl on an ash-wood stand. It lifts the plant off the floor so it gets more light, and cleaning underneath is much easier.",
    alt: "Planter on a wooden stand with legs next to other plants",
  },
  "kashpo-terakota": {
    name: "Terracotta pot with saucer",
    blurb: "Breathable fired clay — a succulent’s best friend.",
    description:
      "A classic unglazed pot: the clay wicks excess moisture from the roots, making it harder to overwater. Saucer included.",
    alt: "Terracotta clay pots with saucers in different sizes",
  },
  dobryvo: {
    name: "Liquid fertiliser ‘Green Start’",
    blurb: "NPK plus trace elements: one cap per litre of water every 2 weeks.",
    description:
      "A balanced mineral fertiliser for foliage plants. A 250 ml bottle lasts a season for 10–15 plants. Feed from March to September.",
    alt: "Liquid fertiliser being poured into a measuring cap",
  },
  obpryskuvach: {
    name: "Glass mister",
    blurb: "A fine mist for calatheas, ferns and orchids.",
    description:
      "An amber glass bottle with a brass pump gives an even, fine cloud and leaves no spots on the leaves. 300 ml.",
    alt: "Misting the leaves of a houseplant with a spray bottle",
  },
  liika: {
    name: "Long-spout watering can",
    blurb: "The narrow spout pours water under the leaves, not onto them.",
    description:
      "A 1 L metal watering can with a long, thin spout — handy for plants on shelves and in tight groups without flooding the crown.",
    alt: "Watering houseplants with a long-spout watering can",
  },
  grunt: {
    name: "Tropical plant soil",
    blurb: "A loose mix with bark, perlite and coir — roots can breathe.",
    description:
      "Our own mix for monsteras, philodendrons, alocasias and figs: peat, coir, pine bark and perlite. It doesn’t compact or go sour.",
    alt: "Loose potting mix with bark and perlite for repotting",
  },
};

const water: Record<string, string> = {
  "Занурення раз на 7–10 днів": "Soak every 7–10 days",
  "Раз на 10 днів": "Every 10 days",
  "Раз на 10–14 днів": "Every 10–14 days",
  "Раз на 2–3 тижні": "Every 2–3 weeks",
  "Раз на 2–4 тижні": "Every 2–4 weeks",
  "Раз на 3–5 днів": "Every 3–5 days",
  "Раз на 4–6 днів, м’якою водою": "Every 4–6 days, soft water",
  "Раз на 5–7 днів": "Every 5–7 days",
  "Раз на 7 днів": "Every 7 days",
  "Раз на 7–10 днів": "Every 7–10 days",
  "У піддон раз на 5–7 днів": "Into the saucer every 5–7 days",
};

/** «40–50 см, горщик Ø14» → «40–50 cm, Ø14 pot» */
const label = (s: string) =>
  s
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/^Ø куща (.+?), горщик (Ø\d+)$/, "$1 wide, $2 pot")
    .replace(/^Ø розетки (.+?), горщик (Ø\d+)$/, "$1 rosette, $2 pot")
    .replace(/^пагони (.+?), горщик (Ø\d+)$/, "$1 trails, $2 pot")
    .replace(/^на опорі (.+?), горщик (Ø\d+)$/, "$1 on a pole, $2 pot")
    .replace(/^(\d) квітконоси?, горщик (Ø\d+)$/, (_, n: string, d: string) => `${n} flower spike${n === "1" ? "" : "s"}, ${d} pot`)
    .replace(/^чаша (Ø\d+), висота (.+)$/, "$1 bowl, $2 tall")
    .replace(/^довжина (.+?), для горщика (.+)$/, "$1 long, for $2 pots")
    .replace(/, для горщика до (Ø\d+)$/, ", fits pots up to $1")
    .replace(/, горщик (Ø\d+)$/, ", $1 pot")
    .replace(/ см/g, " cm")
    .replace(/ мл$/, " ml")
    .replace(/ л$/, " L");

export const products: Product[] = uk.map((p) => ({
  ...p,
  ...t[p.id],
  care: p.care && { ...p.care, water: water[p.care.water] ?? p.care.water },
  variants: p.variants.map((v) => ({ ...v, label: label(v.label) })),
}));

export const productById = new Map(products.map((p) => [p.id, p]));
