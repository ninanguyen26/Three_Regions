// Three Regions: the medal scorer. Pure function, no UI, no I/O.
//
// The basket model (Ngoc, 2026-10-23): the player picks freely, up to the
// dish's cap (= its slot count). Each slot scores its BEST-matching pick in
// the basket (exact 1.0, substitute = its similarity, nothing = 0), weighted
// by tier (signature 3 / core 2 / support 1 / garnish 0.5). Picks that no
// slot uses (the family's loser, a foreign ingredient) are WRONG PICKS and
// each dings the score. A slot left with no family member at all still caps
// the dish when it's a signature slot. Minus a small execution penalty.
// Thresholds decided by Ngoc: stamp >= 80, silver >= 90, gold >= 95.
//
// Menu play: when the week's basket serves a whole menu, scoreDish takes
// the menu as a 4th argument and wrong picks are judged against every dish
// on it (see below), so Tuesday's ingredients are not Monday's mistakes.

import type { Dish, Tier } from "../data/types";

export const TIER_WEIGHTS: Record<Tier, number> = {
  signature: 3,
  core: 2,
  support: 1,
  garnish: 0.5,
};

/** Worst-case deduction for hands-on execution (execution is 0..1). */
export const MAX_EXECUTION_PENALTY = 5;

/** A signature slot with no pick from its family caps the dish here. */
export const SIGNATURE_MISS_CAP = 79;

/** Points dinged per basket pick that no slot ends up using. */
export const WRONG_PICK_PENALTY = 6;

export type Medal = "gold" | "silver" | "stamped" | "fail";

export interface SlotResult {
  ingredientId: string;
  tier: Tier;
  optional: boolean;
  /** The basket pick that scored this slot (the best family match). */
  pickedId: string | null;
  similarity: number;
  weight: number;
}

export interface ScoreResult {
  /** Final 0..100 after dings, caps and execution penalty. */
  percent: number;
  /** Slot similarity only, before dings/caps/penalty. */
  rawPercent: number;
  medal: Medal;
  /** True when a signature slot had no pick from its family at all. */
  capped: boolean;
  /** The slot that cost the most points; drives the feedback line. */
  biggestMiss: SlotResult | null;
  slots: SlotResult[];
  /** Basket picks no slot used; each one dinged WRONG_PICK_PENALTY. */
  wrongPicks: string[];
  wrongPickPenalty: number;
}

export function medalFor(percent: number): Medal {
  if (percent >= 95) return "gold";
  if (percent >= 90) return "silver";
  if (percent >= 80) return "stamped";
  return "fail";
}

export function scoreDish(
  dish: Dish,
  basket: string[],
  execution = 1,
  menu?: Dish[],
): ScoreResult {
  const uniqueBasket = [...new Set(basket)];
  const inBasket = new Set(uniqueBasket);

  const matchSlots = (d: Dish): { slots: SlotResult[]; used: Set<string> } => {
    const used = new Set<string>();
    const slots: SlotResult[] = d.slots.map((slot) => {
      let pickedId: string | null = null;
      let similarity = 0;
      if (inBasket.has(slot.ingredientId)) {
        pickedId = slot.ingredientId;
        similarity = 1;
      } else {
        for (const sub of slot.substitutes) {
          if (inBasket.has(sub.ingredientId) && sub.similarity > similarity) {
            pickedId = sub.ingredientId;
            similarity = sub.similarity;
          }
        }
      }
      if (pickedId != null) used.add(pickedId);
      return {
        ingredientId: slot.ingredientId,
        tier: slot.tier,
        optional: slot.optional === true,
        pickedId,
        similarity,
        weight: TIER_WEIGHTS[slot.tier],
      };
    });
    return { slots, used };
  };

  const { slots, used } = matchSlots(dish);

  // Wrong picks are judged against the whole menu when one is given: a
  // pick another menu dish uses is not a mistake, even on a day it is not
  // served. A pick no slot on the menu ends up using still dings.
  const menuUsed = new Set<string>(used);
  if (menu) {
    for (const d of menu) {
      if (d.id === dish.id) continue;
      for (const id of matchSlots(d).used) menuUsed.add(id);
    }
  }

  const wrongPicks = uniqueBasket.filter((id) => !menuUsed.has(id));
  const wrongPickPenalty = wrongPicks.length * WRONG_PICK_PENALTY;

  // Optional (finish) slots are excluded from the medal score entirely:
  // missing 0, present 0. Their picks still count as used above, so they
  // never ding as wrong picks.
  const scoredSlots = slots.filter((s) => !s.optional);
  const totalWeight = scoredSlots.reduce((a, s) => a + s.weight, 0);
  const earned = scoredSlots.reduce((a, s) => a + s.weight * s.similarity, 0);
  const rawPercent = totalWeight === 0 ? 0 : (earned / totalWeight) * 100;

  const capped = scoredSlots.some((s) => s.tier === "signature" && s.similarity === 0);

  let percent =
    rawPercent - wrongPickPenalty - (1 - execution) * MAX_EXECUTION_PENALTY;
  if (capped) percent = Math.min(percent, SIGNATURE_MISS_CAP);
  percent = Math.max(0, Math.min(100, Math.round(percent * 10) / 10));

  let biggestMiss: SlotResult | null = null;
  let worstLoss = 0;
  for (const s of scoredSlots) {
    const loss = s.weight * (1 - s.similarity);
    if (loss > worstLoss) {
      worstLoss = loss;
      biggestMiss = s;
    }
  }

  return {
    percent,
    rawPercent: Math.round(rawPercent * 10) / 10,
    medal: medalFor(percent),
    capped,
    biggestMiss,
    slots,
    wrongPicks,
    wrongPickPenalty,
  };
}
