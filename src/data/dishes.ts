import type { Dish } from "./types";

// Dish records. One per roster dish; the four starters are in, phở bò first.
// Text fields (clue/history/funFact): each dish gets researched against 2-3
// sources before it ships. The three starters below were researched
// 2026-10-24; phở's texts are still drafts, marked as such.
export const DISHES: Dish[] = [
  {
    id: "pho-bo",
    name: "Phở Bò",
    group: "starter",
    region: "north",
    verb: "pour",
    clue: "The clear one: broth like water that remembers beef, flat noodles, basil on top.",
    prepNote: "Broth bones in the stockpot, herbs washed, onions ready to char. The kitchen is set for the week.",
    slots: [
      {
        ingredientId: "beef-brisket",
        tier: "signature",
        substitutes: [
          { ingredientId: "beef-shank", similarity: 0.93 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "flat-rice-noodle",
        tier: "signature",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.88 },
          { ingredientId: "round-rice-noodle", similarity: 0.62 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "star-anise",
        tier: "core",
        substitutes: [
          { ingredientId: "five-spice-powder", similarity: 0.78 },
          { ingredientId: "fennel-seed", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "ginger",
        tier: "core",
        substitutes: [
          { ingredientId: "fresh-ginger", similarity: 0.85 },
          { ingredientId: "galangal", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "yellow-onion",
        tier: "support",
        substitutes: [
          { ingredientId: "white-onion", similarity: 0.95 },
          { ingredientId: "shallot", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "cinnamon",
        tier: "support",
        substitutes: [
          { ingredientId: "cassia-bark", similarity: 0.9 },
          { ingredientId: "ground-cinnamon", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "thai-basil",
        tier: "garnish",
        substitutes: [
          { ingredientId: "sweet-basil", similarity: 0.85 },
          { ingredientId: "mint", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "garnish",
        substitutes: [{ ingredientId: "shredded-cabbage", similarity: 0.55 }],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        substitutes: [{ ingredientId: "lemon", similarity: 0.8 }],
      },
    ],
    history:
      "Phở took shape in early-1900s Hanoi and Nam Định, where beef, newly prized under French rule, met the clear noodle soups workers already loved. It traveled south after 1954 and changed as it went: sweeter broth, bigger herb plates. [draft]",
    funFact:
      "Hanoi purists keep the herb plate small and the broth unsweetened; the mountain of sprouts and basil is a southern addition. [draft]",
  },
  {
    id: "goi-cuon",
    name: "Gỏi Cuốn",
    group: "starter",
    region: "south",
    verb: "wrap",
    clue: "The see-through one: shrimp showing pink through soft rice paper, a garlic chive tail sticking out, peanut sauce for dunking.",
    prepNote: "Shrimp and pork poached, cooled, sliced. Herbs picked, vermicelli soaked, rice paper stacked next to a damp towel.",
    slots: [
      {
        ingredientId: "rice-paper",
        tier: "signature",
        substitutes: [
          { ingredientId: "brown-rice-paper", similarity: 0.9 },
          { ingredientId: "wheat-wrappers", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "shrimp",
        tier: "signature",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "pork-belly",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.6 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "hoisin-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "fish-sauce-dip", similarity: 0.7 },
          { ingredientId: "soy-sauce", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "peanut-butter",
        tier: "support",
        substitutes: [
          { ingredientId: "roasted-peanuts", similarity: 0.75 },
          { ingredientId: "tahini", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "support",
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
          { ingredientId: "shredded-cabbage", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "mint",
        tier: "support",
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "sweet-basil", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "garlic-chives",
        tier: "garnish",
        substitutes: [{ ingredientId: "green-onions", similarity: 0.55 }],
      },
    ],
    history:
      "Gỏi cuốn is the South's fresh roll: shrimp and pork, vermicelli and herbs wrapped in softened rice paper and eaten uncooked, with a peanut and hoisin dip. Where the North fries its rolls (chả giò, nem rán), the South serves this one raw and cool.",
    funFact:
      "The shrimp is halved lengthwise and laid pink-side out so it shows through the translucent paper, and a single garlic chive sticks out of one end of the roll like a little green tail.",
  },
  {
    id: "banh-mi",
    name: "Bánh Mì",
    group: "starter",
    region: "south",
    verb: "chop",
    clue: "The crackly one: a shattering baguette, pâté and pork sausage, pickles cutting through the richness.",
    prepNote: "Pâté chilled for slicing, đồ chua drained, cilantro picked. Baguettes wrapped so the crust stays crackly.",
    slots: [
      {
        ingredientId: "vietnamese-baguette",
        tier: "signature",
        substitutes: [
          { ingredientId: "french-baguette", similarity: 0.8 },
          { ingredientId: "hoagie-roll", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "pate-pork",
        tier: "signature",
        substitutes: [
          { ingredientId: "pate-chicken", similarity: 0.85 },
          { ingredientId: "liverwurst", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "cha-lua",
        tier: "core",
        substitutes: [
          { ingredientId: "ham", similarity: 0.7 },
          { ingredientId: "bologna", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "core",
        substitutes: [
          { ingredientId: "pickled-carrots", similarity: 0.7 },
          { ingredientId: "carrots", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "mayonnaise",
        tier: "support",
        substitutes: [
          { ingredientId: "kewpie-mayo", similarity: 0.95 },
          { ingredientId: "butter", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "cucumber",
        tier: "support",
        substitutes: [
          { ingredientId: "dill-pickles", similarity: 0.5 },
          { ingredientId: "zucchini", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "maggi-seasoning",
        tier: "support",
        substitutes: [
          { ingredientId: "soy-sauce", similarity: 0.85 },
          { ingredientId: "regular-fish-sauce", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "cilantro",
        tier: "garnish",
        substitutes: [
          { ingredientId: "mint", similarity: 0.5 },
          { ingredientId: "parsley", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        substitutes: [{ ingredientId: "jalapeno", similarity: 0.85 }],
      },
    ],
    history:
      "The French brought the baguette to Vietnam in the mid-1800s, and Vietnamese bakers answered with a lighter loaf: crackling crust, airy middle, rice flour often in the mix. The filled sandwich took shape in 1950s Saigon, pâté and mayonnaise meeting chả lụa, pickled carrot and daikon, cilantro and chili.",
    funFact:
      "Bánh mì is simply the word for bread. The sandwich inherited the loaf's name, and classic Saigon shops finish it with a dash of Maggi seasoning.",
  },
  {
    id: "com-tam-suon",
    name: "Cơm Tấm Sườn",
    group: "starter",
    region: "south",
    verb: "sear",
    clue: "The broken-rice one: a lemongrass pork chop off the charcoal, pork skin and egg cake, scallion oil over all of it.",
    prepNote: "Pork chops marinating in lemongrass, bì tossed with its rice powder, egg cake steamed and sliced.",
    slots: [
      {
        ingredientId: "broken-rice",
        tier: "signature",
        substitutes: [
          { ingredientId: "jasmine-rice", similarity: 0.75 },
          { ingredientId: "long-grain-rice", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "pork-chop",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "lemongrass",
        tier: "core",
        substitutes: [
          { ingredientId: "lemongrass-paste", similarity: 0.85 },
          { ingredientId: "lemon", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "pork-skin",
        tier: "core",
        substitutes: [
          { ingredientId: "toasted-rice-powder", similarity: 0.5 },
          { ingredientId: "pork-rinds", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "ground-pork",
        tier: "support",
        substitutes: [
          { ingredientId: "chicken", similarity: 0.45 },
          { ingredientId: "tofu", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "support",
        substitutes: [{ ingredientId: "liquid-egg", similarity: 0.6 }],
      },
      {
        ingredientId: "green-onions",
        tier: "support",
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.7 },
          { ingredientId: "shallot", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "support",
        substitutes: [
          { ingredientId: "pickled-carrots", similarity: 0.7 },
          { ingredientId: "carrots", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "cucumber",
        tier: "garnish",
        substitutes: [
          { ingredientId: "tomato", similarity: 0.6 },
          { ingredientId: "zucchini", similarity: 0.35 },
        ],
      },
    ],
    history:
      "Cơm tấm began as the poor grains of the Mekong Delta: rice that shattered in the mill could not be sold, so farming families cooked it for themselves. Saigon adopted the leftover and built its signature plate on it. The saying goes that Saigon eats cơm tấm the way Hanoi eats phở.",
    funFact:
      "The classic trio on the plate is three traditions at once: a French-style grilled chop, a Chinese-style steamed egg cake, and Vietnamese pickles and fish sauce tying them together.",
  },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(
  DISHES.map((d) => [d.id, d]),
);

/** The starter set, in teaching order. */
export const STARTER_IDS: string[] = DISHES.filter(
  (d) => d.group === "starter",
).map((d) => d.id);
