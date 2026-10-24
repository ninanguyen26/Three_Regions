import type { IngredientDef } from "./types";

// Every ingredient the market can offer: correct picks and their decoys live
// in the same list. Phở's market shelf first; grows dish by dish.
export const INGREDIENTS: IngredientDef[] = [
  // proteins
  { id: "beef-brisket", name: "Beef brisket", category: "protein" },
  { id: "beef-shank", name: "Beef shank", category: "protein" },
  { id: "chicken", name: "Chicken", category: "protein" },
  // noodles
  { id: "flat-rice-noodle", name: "Fresh flat rice noodles (bánh phở)", category: "noodle" },
  { id: "dried-rice-noodle", name: "Dried flat rice noodles", category: "noodle" },
  { id: "round-rice-noodle", name: "Round rice noodles (bún)", category: "noodle" },
  // seasonings
  { id: "fish-sauce", name: "Fish sauce (premium)", category: "seasoning" },
  { id: "regular-fish-sauce", name: "Fish sauce (standard)", category: "seasoning" },
  { id: "soy-sauce", name: "Soy sauce", category: "seasoning" },
  // aromatics
  { id: "star-anise", name: "Star anise", category: "aromatic" },
  { id: "five-spice-powder", name: "Five-spice powder", category: "aromatic" },
  { id: "fennel-seed", name: "Fennel seed", category: "aromatic" },
  { id: "ginger", name: "Ginger (for charring)", category: "aromatic" },
  { id: "fresh-ginger", name: "Ginger (fresh, pre-cut)", category: "aromatic" },
  { id: "galangal", name: "Galangal", category: "aromatic" },
  { id: "cinnamon", name: "Cinnamon stick", category: "aromatic" },
  { id: "cassia-bark", name: "Cassia bark", category: "aromatic" },
  { id: "ground-cinnamon", name: "Ground cinnamon", category: "aromatic" },
  // produce
  { id: "yellow-onion", name: "Yellow onion", category: "produce" },
  { id: "white-onion", name: "White onion", category: "produce" },
  { id: "shallot", name: "Shallots", category: "produce" },
  // herbs
  { id: "thai-basil", name: "Thai basil", category: "herb" },
  { id: "sweet-basil", name: "Sweet basil", category: "herb" },
  { id: "mint", name: "Mint", category: "herb" },
  // garnish
  { id: "bean-sprouts", name: "Bean sprouts", category: "garnish" },
  { id: "shredded-cabbage", name: "Shredded cabbage", category: "garnish" },
  { id: "lime", name: "Lime", category: "garnish" },
  { id: "lemon", name: "Lemon", category: "garnish" },
];

export const INGREDIENT_BY_ID: Record<string, IngredientDef> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
);
