// Three Regions: core data schema.
// Content model per dish: clue, target slots (correct ingredient + tier),
// per-slot substitutes with similarity scores, verb, history, fun fact.

export type Region = "north" | "central" | "south" | "home";
export type DishGroup = "starter" | Region;

export type Verb =
  | "chop"
  | "pound"
  | "toss"
  | "sear"
  | "pour"
  | "wrap"
  | "simmer"
  | "whisk"; // cà phê trứng only; runs on the toss engine

export type Tier = "signature" | "core" | "support" | "garnish";

export type IngredientCategory =
  | "protein"
  | "noodle"
  | "bread"
  | "aromatic"
  | "seasoning"
  | "produce"
  | "herb"
  | "garnish";

export interface IngredientDef {
  id: string;
  name: string;
  category: IngredientCategory;
}

export interface Substitute {
  ingredientId: string;
  /** 0..1: how close this pick is to the slot's correct ingredient. */
  similarity: number;
}

export interface DishSlot {
  /** The correct ingredient for this slot. */
  ingredientId: string;
  tier: Tier;
  /** Finish-only slot: excluded from the medal score, never a wrong pick. */
  optional?: boolean;
  /** Plausible wrong picks the market offers for this slot. */
  substitutes: Substitute[];
}

export interface Dish {
  id: string;
  name: string;
  group: DishGroup;
  region: Region;
  verb: Verb;
  secondaryVerb?: Verb;
  /** The market clue/description that leads the player to this dish's ingredients. */
  clue: string;
  /** Sunday prep flavor line for this dish (what the kitchen does to get it ready). */
  prepNote: string;
  slots: DishSlot[];
  history: string;
  funFact: string;
}

export interface Regular {
  id: string;
  /** Display name. The reviewer stays nameless by design (incognito). */
  name: string;
  /** One line: job plus Tampa anchor. */
  who: string;
  /** Voice spec, single source of truth for authored lines and generated
      lines: tone tags, sentence style, never-dos. */
  personality: string;
  /** Concrete likes and dislikes. Hard traits are called out as hard. */
  taste: string;
  /** Signature order, as a dish id. Null for the reviewer, who orders
      across the menu. */
  favDishId: string | null;
  /** What is going on in their life. Advances when served. */
  story: string;
  /** One concrete memorable detail. */
  quirk: string;
}
