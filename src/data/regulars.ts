// Three Regions: the regulars, approved 2026-10-24 (drafted in chat,
// checked by Ngoc). Wired to the Guests album; the weekend percentage
// forecast reads this file when it is built.
//
// Rules baked into this file:
// - No em-dashes anywhere in game data.
// - No routine: a regular shows up when their favorite dish is on the
//   week's menu, never on a set day.
// - The reviewer has no fav dish and no public name (incognito).
// - Tram's markers are exactly Trời ơi and nè, authored only, sparse.
// - No character addresses the player with a gendered term: the player
//   has no set gender.

import type { Regular } from "./types";

export const REGULARS: Regular[] = [
  {
    id: "ong-hien",
    name: "Ông Hiển",
    who: "60s Hanoian judge, downtown courthouse",
    personality:
      "Formal, blunt, short sentences. Never small-talks, never compliments directly.",
    taste: "Clean northern broth, black pepper heat. Hates sweet broth.",
    favDishId: "pho-bo",
    story:
      "Homesick strict judge. Softens as the player earns his respect. Sweetening his phở teaches the sugar lesson.",
    quirk: "Tastes the broth first, in silence.",
  },
  {
    id: "ba-le",
    name: "Bà Lệ",
    who: "70s, the oldest customer, the widow",
    personality: "Warm, slow, storytelling. Never rushes, never complains.",
    taste: "Sour, gentle, comfort. Dislikes spicy and heavy.",
    favDishId: "canh-chua",
    story: "The emotional core. Tết anchor.",
    quirk: "Orders canh chua before she sits down.",
  },
  {
    id: "co-hanh",
    name: "Cô Hạnh",
    who: "60s, Huế-born Buddhist vegetarian",
    personality:
      "Calm, measured, proverb-short. Never raises her voice, never rushes.",
    taste:
      "Huế seasoning. Vegetarian is a hard trait, not a preference.",
    favDishId: "bun-bo-hue",
    story:
      "Second Central memory beside the owner. Gives substitution quests.",
    quirk: "Prays briefly before eating, every visit.",
  },
  {
    id: "anh-tu",
    name: "Anh Tư",
    who: "40s, Viet-Am Gulf shrimper",
    personality: "Loud, laughing, Gulf slang. Never quiet about a catch.",
    taste: "Fresh-caught seafood. Hates frozen shrimp.",
    favDishId: "goi-cuon",
    story:
      "His catch is the shrimp supply, so storms ground his boat and the menu feels it.",
    quirk: "Reports the Gulf like weather before ordering.",
  },
  {
    id: "rosa",
    name: "Rosa",
    who: "50s, Cuban-American bakery neighbor, Ybor",
    personality: "Warm, fast, Spanglish sprinkle. Never leaves without a tease.",
    taste: "Bread and strong coffee. Hates stale bread.",
    favDishId: "banh-mi",
    story: "The block-party arc, Tampa identity in the cast.",
    quirk: "Drops off a loaf from her bakery most visits.",
  },
  {
    id: "danny",
    name: "Danny",
    who: "20s, broke USF student, non-Viet",
    personality:
      "Slang, run-on, broke humor. Never formal, never orders the priciest thing.",
    taste: "Extra spicy, filling, cheap. Hates bland.",
    favDishId: "bun-bo-hue",
    story:
      "The slang craving voice. Arc ends in a graduation-dinner menu quest.",
    quirk: "Textbooks across the table, extra chili.",
  },
  {
    id: "miss-pat",
    name: "Miss Pat",
    who: "70s snowbird",
    personality:
      "Chatty, Southern polite, long stories. Never hurries, never spicy.",
    taste: "Mild and hearty. Zero chili, hard trait.",
    favDishId: "com-tam-suon",
    story: "Seasonality as a person. Remembers the player.",
    quirk: "Brings a new snowbird friend every December.",
  },
  {
    id: "lucy",
    name: "Lucy",
    who: "8, picky kid, with her mom Sarah",
    personality:
      "Blunt kid honesty, short bursts. Never pretends to like something.",
    taste: "Plain, familiar, kid-mild. No cilantro, hard trait.",
    favDishId: "nui-xao-bo",
    story: "The kid-service arc: garnish omission and learning to serve kids.",
    quirk: "Inspects every plate for green bits before eating.",
  },
  {
    id: "marcus",
    name: "Marcus",
    who: "40s, mail carrier",
    personality: "Fast-talking gossip, jokes. Never keeps a secret.",
    taste: "Hearty, portable, fast. Hates slow service.",
    favDishId: "banh-mi",
    story: "Forecast with a face. He brings the week's news.",
    quirk: "Announces the gossip before ordering.",
  },
  {
    id: "tram",
    name: "Trâm",
    who: "22, international student from Saigon, also a texting contact",
    personality:
      "Polite, light modern Saigon tone, gentle disagreement. Never rude about it. Markers: Trời ơi and nè only, authored only, sparse.",
    taste: "Fresh, herb-bright Saigon street flavors. Dislikes heavy and fatty.",
    favDishId: "hu-tieu",
    story:
      "Misses 2020s Saigon and politely disagrees with the owner's decades-old memory of it.",
    quirk: "Photographs every dish.",
  },
  {
    id: "reviewer",
    name: "The reviewer",
    who: "Incognito Tampa food writer, event only",
    personality:
      "Quiet, observant, note-taking. Never reveals they are reviewing.",
    taste: "Precise and balanced. Hates sloppy technique.",
    favDishId: null,
    story: "The reveal, the highest-stakes service, a published review.",
    quirk: "Writes in a small notebook, never photographs.",
  },
  {
    id: "grace",
    name: "Grace",
    who: "40s, Filipino-American night-shift nurse",
    personality: "Tired-warm, dry humor, Taglish sprinkle. Never fussy.",
    taste: "Sour soups. Hates bland hospital food.",
    favDishId: "canh-chua",
    story: "The sinigang to canh chua kinship voice.",
    quirk: "Orders half-asleep, before sitting down.",
  },
  {
    id: "ong-vinh",
    name: "Ông Vinh",
    who: "Retired rival chef, late-game",
    personality: "Precise, respectful rivalry. Never flatters, never trash-talks.",
    taste: "Clean technique. Hates shortcuts.",
    favDishId: "pho-bo",
    story: "Rival turned mentor. Teaches a signature dish neither owner knows.",
    quirk: "Tastes with eyes closed, nods once.",
  },
  {
    id: "anh-dung",
    name: "Anh Dũng",
    who: "30s, construction worker from Quảng Ngãi",
    personality: "Quiet, direct, few words. Never complains.",
    taste: "Big filling portions. Hates small portions.",
    favDishId: "mi-quang",
    story: "Working-class Central regular, saving to bring his wife over.",
    quirk: "Apologizes for dusty boots, every time.",
  },
  {
    id: "linh",
    name: "Linh",
    who: "30s, Viet-Am catering coordinator",
    personality: "Organized, fast, exact numbers. Never vague, never late.",
    taste: "Crowd-pleasers that scale. Hates fiddly single plates.",
    favDishId: "cha-gio",
    story: "The event pipeline: banquet menu quests and economy spikes.",
    quirk: "Carries a clipboard, counts chairs.",
  },
  {
    id: "kevin-jenny",
    name: "Kevin and Jenny",
    who: "20s, Viet-Am food-truck couple, students and mentees",
    personality: "Eager, curious, question-rapid. Never pretend to know.",
    taste: "Fusion and experimentation. Hate rigid rules about how a dish must be done.",
    favDishId: "banh-mi",
    story:
      "Mentored by the player. Their truck opens in post-game with the parked Viet-Am dishes on their menu.",
    quirk: "Sketch truck designs on napkins.",
  },
];
