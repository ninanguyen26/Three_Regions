// Three Regions: trial helpers. Pure functions, no UI, no I/O.
//
// A failed trial's one-direction line names only the worst category,
// never an ingredient. Week 1 guided repair names the worst group and
// its exact fixes, one group at a time, until the trial passes.

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

/** Phrase for the owner line: "points at the proteins", "points at the bread". */
function groupPhrase(category: IngredientCategory): string {
  return category === "protein"
    ? "proteins"
    : CATEGORY_LABEL[category].toLowerCase();
}

export interface GroupFix {
  category: IngredientCategory;
  group: string;
  fixes: string[];
}

/**
 * Week 1 guided repair: the worst group and its exact fixes, in dish
 * slot order, then wrong picks in that group to drop. Falls back to the
 * wrong-pick group when no slot lost anything (a fail built purely on
 * over-picking). Null when nothing is wrong at all.
 */
export function groupFixFor(
  dish: Dish,
  basket: string[],
  menu?: Dish[],
): GroupFix | null {
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
  if (worst) {
    const fixes: string[] = [];
    for (const s of r.slots) {
      if (INGREDIENT_BY_ID[s.ingredientId]?.category !== worst) continue;
      if (s.similarity >= 1) continue;
      const correct = INGREDIENT_BY_ID[s.ingredientId]?.name;
      if (!correct) continue;
      const picked =
        s.pickedId != null ? INGREDIENT_BY_ID[s.pickedId]?.name : null;
      fixes.push(
        picked ? `use ${correct} instead of ${picked}` : `${correct} is missing`,
      );
    }
    for (const id of r.wrongPicks) {
      const ing = INGREDIENT_BY_ID[id];
      if (ing?.category === worst) fixes.push(`drop ${ing.name}`);
    }
    if (fixes.length > 0)
      return { category: worst, group: groupPhrase(worst), fixes };
  }
  // No slot lost anything: the fail is over-picking. Name the group
  // holding the most wrong picks, shelf order on ties.
  const counts = new Map<IngredientCategory, number>();
  for (const id of r.wrongPicks) {
    const cat = INGREDIENT_BY_ID[id]?.category;
    if (cat) counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  let pickWorst: IngredientCategory | null = null;
  let pickCount = 0;
  for (const cat of CATEGORY_ORDER) {
    const n = counts.get(cat) ?? 0;
    if (n > pickCount) {
      pickCount = n;
      pickWorst = cat;
    }
  }
  if (!pickWorst) return null;
  const fixes = r.wrongPicks
    .filter((id) => INGREDIENT_BY_ID[id]?.category === pickWorst)
    .map((id) => `drop ${INGREDIENT_BY_ID[id]!.name}`);
  return { category: pickWorst, group: groupPhrase(pickWorst), fixes };
}
