// Three Regions: the market shelf, grouped the way a shopper walks it:
// five markets with subsections, in the order the lists are written.
//
// Display-only regrouping. It does NOT replace IngredientDef.category:
// the trial cook steps and the worst-category direction still run off
// each ingredient's fixed category in ingredients.ts.

export interface MarketSubsection {
  title?: string;
  ids: string[];
}

export interface MarketSection {
  title: string;
  subsections: MarketSubsection[];
}

export const MARKET_SECTIONS: MarketSection[] = [
  {
    title: "Meat market",
    subsections: [
      {
        ids: [
          "beef-brisket",
          "beef-shank",
          "chicken",
          "chicken-wings",
          "chicken-fat",
          "pork-belly",
          "pork-shoulder",
          "pork-chop",
          "ground-pork",
          "pork-skin",
          "pork-bones",
          "pork-knuckle",
          "cha-lua",
          "pate-pork",
          "pate-chicken",
          "liverwurst",
          "ham",
          "bologna",
        ],
      },
    ],
  },
  {
    title: "Seafood market",
    subsections: [
      {
        ids: [
          "shrimp",
          "shrimp-small",
          "catfish",
          "basa-fish",
          "tilapia",
          "white-fish",
          "crab-meat",
          "canned-crab",
        ],
      },
    ],
  },
  {
    title: "Produce market",
    subsections: [
      {
        title: "Vegetables and mushrooms",
        ids: [
          "yellow-onion",
          "white-onion",
          "shallot",
          "green-onions",
          "green-leaf-lettuce",
          "romaine",
          "cucumber",
          "carrots",
          "zucchini",
          "tomato",
          "wood-ear-mushroom",
          "shiitake-mushroom",
          "button-mushroom",
          "mushrooms",
          "sweet-potato",
          "potato",
          "okra",
          "banana-blossom",
          "bean-sprouts",
          "shredded-cabbage",
        ],
      },
      {
        title: "Fresh aromatics",
        ids: [
          "ginger",
          "fresh-ginger",
          "galangal",
          "lemongrass",
          "garlic",
          "fresh-turmeric",
        ],
      },
      {
        title: "Herbs",
        ids: [
          "thai-basil",
          "sweet-basil",
          "mint",
          "cilantro",
          "parsley",
          "garlic-chives",
          "dill",
          "fennel-fronds",
          "perilla-leaf",
          "vietnamese-coriander",
          "rice-paddy-herb",
          "culantro",
        ],
      },
      {
        title: "Fruit and other fresh produce",
        ids: [
          "pineapple",
          "lime",
          "lemon",
          "red-chili",
          "jalapeno",
          "aloe-vera",
        ],
      },
    ],
  },
  {
    title: "Grocery",
    subsections: [
      {
        title: "Refrigerated",
        ids: [
          "eggs",
          "liquid-egg",
          "quail-eggs",
          "duck-eggs",
          "tofu",
          "extra-firm-tofu",
          "silken-tofu",
          "butter",
          "whole-milk",
        ],
      },
      {
        title: "Rice, bread, flour",
        ids: [
          "jasmine-rice",
          "long-grain-rice",
          "macaroni",
          "french-baguette",
          "hoagie-roll",
          "wheat-flour",
          "cornstarch",
        ],
      },
      {
        title: "Sauces and pantry",
        ids: [
          "soy-sauce",
          "peanut-butter",
          "roasted-peanuts",
          "mayonnaise",
          "tahini",
          "tomato-paste",
          "sugar",
          "honey",
          "evaporated-milk",
          "coconut-water",
          "dill-pickles",
          "yellow-split-peas",
          "lentils",
          "canned-tomatoes",
        ],
      },
      {
        title: "Spices and baking",
        ids: [
          "turmeric-powder",
          "curry-powder",
          "black-pepper",
          "star-anise",
          "fennel-seed",
          "cinnamon",
          "cassia-bark",
          "ground-cinnamon",
          "cocoa-powder",
          "vanilla-extract",
          "vanilla-sugar",
        ],
      },
      {
        title: "Coffee and snacks",
        ids: [
          "arabica-coffee",
          "instant-coffee",
          "condensed-milk",
          "pork-rinds",
          "coconut-flakes",
          "cashews",
          "dark-chocolate",
        ],
      },
    ],
  },
  {
    title: "Vietnamese specialty",
    subsections: [
      {
        title: "Noodles, rice, wrappers",
        ids: [
          "flat-rice-noodle",
          "dried-rice-noodle",
          "round-rice-noodle",
          "glass-noodles",
          "rice-paper",
          "brown-rice-paper",
          "wheat-wrappers",
          "broken-rice",
          "glutinous-rice",
          "hu-tieu-noodle",
          "mi-quang-noodle",
          "cao-lau-noodle",
        ],
      },
      {
        title: "Bread and flour",
        ids: [
          "vietnamese-baguette",
          "rice-flour",
          "tapioca-starch",
        ],
      },
      {
        title: "Sauces and condiments",
        ids: [
          "fish-sauce",
          "regular-fish-sauce",
          "hoisin-sauce",
          "maggi-seasoning",
          "kewpie-mayo",
          "oyster-sauce",
          "fermented-shrimp-paste",
          "hue-shrimp-paste",
          "chili-oil",
          "caramel-sauce",
          "peanut-sesame-sauce",
        ],
      },
      {
        title: "Seasonings and preserved ingredients",
        ids: [
          "shrimp-floss",
          "toasted-rice-powder",
          "rock-sugar",
          "palm-sugar",
          "tamarind",
          "five-spice-powder",
          "lemongrass-paste",
          "pickled-carrot-daikon",
          "fried-shallots",
          "pickled-mustard-greens",
        ],
      },
      {
        title: "Dessert and coffee supplies",
        ids: [
          "robusta-coffee",
          "mung-bean",
          "peeled-mung-bean",
          "coconut-milk",
          "tapioca-pearls",
          "lotus-seeds",
          "pandan-leaves",
        ],
      },
      {
        title: "Crackers",
        ids: ["sesame-rice-cracker", "cao-lau-cracker"],
      },
    ],
  },
];
