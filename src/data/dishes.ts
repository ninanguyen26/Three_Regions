import type { Dish } from "./types";

// Dish records. One per roster dish; phở bò is the scaffold's proof dish.
// Text fields (clue/history/funFact) are drafts — each dish gets researched
// against 2-3 sources before it ships.
export const DISHES: Dish[] = [
  {
    id: "pho-bo",
    name: "Phở Bò",
    group: "starter",
    region: "north",
    verb: "pour",
    clue: "The clear one — broth like water that remembers beef, flat noodles, basil on top.",
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
      "Phở took shape in early-1900s Hanoi and Nam Định, where beef — newly prized under French rule — met the clear noodle soups workers already loved. It traveled south after 1954 and changed as it went: sweeter broth, bigger herb plates. [draft]",
    funFact:
      "Hanoi purists keep the herb plate small and the broth unsweetened; the mountain of sprouts and basil is a southern addition. [draft]",
  },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(
  DISHES.map((d) => [d.id, d]),
);
