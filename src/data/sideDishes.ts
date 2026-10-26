import type { SideDish } from "./types";

// Three Regions: side dishes. One side = one ingredient, paired with
// main dishes. No slots, no tiers, no substitutes, no trial.

export const SIDE_DISHES: SideDish[] = [
  {
    id: "pickled-mustard-greens",
    name: "Pickled mustard greens",
    ingredientId: "pickled-mustard-greens",
    mainDishIds: ["thit-kho"],
  },
  {
    id: "pork-skin",
    name: "Pork skin (bì)",
    ingredientId: "pork-skin",
    mainDishIds: ["com-tam-suon"],
  },
  {
    id: "egg-cake",
    name: "Egg cake (chả trứng)",
    ingredientId: "eggs",
    mainDishIds: ["com-tam-suon"],
  },
  {
    id: "shrimp-floss",
    name: "Shrimp floss",
    ingredientId: "shrimp-floss",
    mainDishIds: ["xoi-xeo"],
  },
  {
    id: "cha-lua",
    name: "Chả lụa (pork sausage)",
    ingredientId: "cha-lua",
    mainDishIds: ["banh-cuon", "xoi-xeo"],
  },
];

export const SIDE_DISH_BY_ID: Record<string, SideDish> = Object.fromEntries(
  SIDE_DISHES.map((s) => [s.id, s]),
);
