// Three Regions: trial helpers. Pure functions, no UI, no I/O.
//
// The trial cook shows one generic step per ingredient category present
// in the trial basket (empty categories skipped), and a failed trial's
// one-direction line names only the worst category, never an ingredient.

import { scoreDish } from "./scorer";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import type { Dish, IngredientCategory } from "../data/types";

export const CATEGORY_ORDER: IngredientCategory[] = [
  "protein",
  "noodle",
  "bread",
  "seasoning",
  "aromatic",
  "produce",
  "herb",
  "garnish",
];

export const CATEGORY_LABEL: Record<IngredientCategory, string> = {
  protein: "Protein",
  noodle: "Noodles",
  bread: "Bread",
  seasoning: "Seasonings",
  aromatic: "Aromatics",
  produce: "Produce",
  herb: "Herbs",
  garnish: "Garnish",
};

export const CATEGORY_STEP: Record<IngredientCategory, string> = {
  protein: "Sear the proteins",
  noodle: "Cook the noodles",
  bread: "Toast the bread",
  seasoning: "Add the seasonings",
  aromatic: "Bloom the aromatics",
  produce: "Prep the produce",
  herb: "Tear the herbs",
  garnish: "Finish with the garnish",
};

/** One generic step per category present in the basket, in shelf order. */
export function trialStepsFor(basket: string[]): string[] {
  const present = new Set<IngredientCategory>();
  for (const id of basket) {
    const cat = INGREDIENT_BY_ID[id]?.category;
    if (cat) present.add(cat);
  }
  return CATEGORY_ORDER.filter((c) => present.has(c)).map(
    (c) => CATEGORY_STEP[c],
  );
}

/**
 * The category whose slots lost the most points, or null when no slot
 * lost anything. Loss per slot is tier weight times one minus similarity.
 */
export function worstCategory(
  dish: Dish,
  basket: string[],
  menu?: Dish[],
): IngredientCategory | null {
  const r = scoreDish(dish, basket, 1, menu);
  const loss = new Map<IngredientCategory, number>();
  for (const s of r.slots) {
    const cat = INGREDIENT_BY_ID[s.ingredientId]?.category;
    if (!cat) continue;
    loss.set(cat, (loss.get(cat) ?? 0) + s.weight * (1 - s.similarity));
  }
  let worst: IngredientCategory | null = null;
  let worstLoss = 0;
  for (const [cat, value] of loss) {
    if (value > worstLoss) {
      worstLoss = value;
      worst = cat;
    }
  }
  return worst;
}
