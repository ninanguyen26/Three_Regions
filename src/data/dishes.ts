import type { Dish } from "./types";

// Dish records. One per roster dish; all 28 are in, phở bò first.
// Text fields (clue/history/funFact): each dish researched against 2-3
// sources and paraphrased before it ships; the full 28-dish set landed 2026-10-24.
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
        optional: true,
        substitutes: [
          { ingredientId: "sweet-basil", similarity: 0.85 },
          { ingredientId: "mint", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "garnish",
        optional: true,
        substitutes: [{ ingredientId: "shredded-cabbage", similarity: 0.55 }],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [{ ingredientId: "lemon", similarity: 0.8 }],
      },
      {
        ingredientId: "culantro",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "cilantro", similarity: 0.7 },
          { ingredientId: "parsley", similarity: 0.4 },
        ],
      },
    ],
    history:
      "Pho took its modern shape in northern Vietnam between 1900 and 1907, in and around Nam Dinh province southeast of Hanoi, where its traditional home is linked to the villages of Van Cu and Dao Cu. Beef was not a common Vietnamese staple before French colonial rule, when French demand made beef and bones more available, and vendors combined that beef with rice noodles and spices already familiar from Chinese cooking. Early sellers carried the soup on shoulder poles, with a cauldron over a wood fire on one side and noodles, spices, and bowls on the other, selling it at dawn and dusk before fixed stands took over in Hanoi.",
    funFact:
      "In 2017 Vietnam made December 12 the Day of Pho. Hanoi and Saigon styles still differ in noodle width, broth sweetness, and herb and sauce choices.",
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
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "sweet-basil", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "garlic-chives",
        tier: "garnish",
        optional: true,
        substitutes: [{ ingredientId: "green-onions", similarity: 0.55 }],
      },
    ],
    history:
      "Gỏi cuốn is the South's fresh roll: shrimp and pork, vermicelli and herbs wrapped in softened rice paper and eaten uncooked, with a peanut and hoisin dip.",
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
        optional: true,
        substitutes: [
          { ingredientId: "mint", similarity: 0.5 },
          { ingredientId: "parsley", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
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
          { ingredientId: "carrots", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "cucumber",
        tier: "garnish",
        optional: true,
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
  {
    id: "bun-cha",
    name: "Bún Chả",
    group: "north",
    region: "north",
    verb: "sear",
    clue: "The smoky one: charred pork in a warm, sweet and sour dip, with cool noodles and a heap of fresh herbs beside it.",
    prepNote: "Pork patties mixed and shaped, sliced pork marinated, herbs washed, pickles drained, dipping broth warmed.",
    slots: [
      {
        ingredientId: "ground-pork",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.75 },
          { ingredientId: "chicken", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "pork-belly",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.9 },
          { ingredientId: "pork-chop", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.9 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
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
        ingredientId: "shallot",
        tier: "core",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "lemongrass",
        tier: "support",
        substitutes: [
          { ingredientId: "lemongrass-paste", similarity: 0.85 },
          { ingredientId: "fresh-ginger", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "support",
        substitutes: [
          { ingredientId: "carrots", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "mint",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "cilantro", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.8 },
        ],
      },
    ],
    history: "Bun cha grew up as a Hanoi lunch, built around charcoal grilling and a separate warm dipping broth rather than a single bowl of soup. Writers were already describing Hanoi as a city absorbed by the dish by 1959, and its first dedicated restaurant stood in the Old Quarter. It stayed a northern specialty even as a similar grilled meat and noodle plate developed in the south.",
    funFact: "The dish famously reached a worldwide audience in 2016, when it was eaten at a small Hanoi table by Barack Obama and Anthony Bourdain. It is traditionally a midday meal, when street grills fill whole lanes with smoke.",
  },
  {
    id: "banh-cuon",
    name: "Bánh Cuốn",
    group: "north",
    region: "north",
    verb: "pour",
    clue: "The translucent one: paper thin steamed sheets folded around a savory filling, served cool with a light, tangy dip.",
    prepNote: "Rice batter rested, pork and mushroom filling cooked and cooled, sausage sliced, bean sprouts blanched, shallots fried.",
    slots: [
      {
        ingredientId: "rice-flour",
        tier: "signature",
        substitutes: [
          { ingredientId: "tapioca-starch", similarity: 0.7 },
          { ingredientId: "wheat-flour", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "ground-pork",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "wood-ear-mushroom",
        tier: "core",
        substitutes: [
          { ingredientId: "shiitake-mushroom", similarity: 0.75 },
          { ingredientId: "button-mushroom", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "core",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.6 },
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
        ingredientId: "cha-lua",
        tier: "support",
        substitutes: [
          { ingredientId: "ham", similarity: 0.7 },
          { ingredientId: "bologna", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "support",
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.55 },
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
        ingredientId: "mint",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "cilantro", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "fried-shallots",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "shallot", similarity: 0.85 },
          { ingredientId: "yellow-onion", similarity: 0.5 },
        ],
      },
    ],
    history: "Banh cuon comes from northern Vietnam, where rice is soaked and ground into a thin batter, then steamed on cloth into delicate sheets. The best known version is tied to Thanh Tri, a Hanoi district known for good rice. The sheets are filled, rolled, and served for breakfast or lunch, a light plate that rewards a steady hand because a torn sheet cannot be hidden.",
    funFact: "The name means rolled cake, and the classic Hanoi serving pairs the soft rolls with crisp fried shallots and slices of pork sausage for contrast. Southern versions tend to add more garnishes, including bean sprouts and cucumber.",
  },
  {
    id: "cha-ca-la-vong",
    name: "Chả Cá Lã Vọng",
    group: "north",
    region: "north",
    verb: "sear",
    clue: "The golden one: sizzling yellow fish tossed with a mountain of fresh herbs, eaten with noodles at the table.",
    prepNote: "Fish cut and marinated, dill and spring onions cut into lengths, peanuts roasted, noodles cooked and cooled, shrimp paste dip mixed.",
    slots: [
      {
        ingredientId: "catfish",
        tier: "signature",
        substitutes: [
          { ingredientId: "basa-fish", similarity: 0.9 },
          { ingredientId: "tilapia", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "signature",
        substitutes: [
          { ingredientId: "fresh-turmeric", similarity: 0.9 },
          { ingredientId: "curry-powder", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "galangal",
        tier: "core",
        substitutes: [
          { ingredientId: "fresh-ginger", similarity: 0.7 },
          { ingredientId: "ginger", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "dill",
        tier: "core",
        substitutes: [
          { ingredientId: "fennel-fronds", similarity: 0.7 },
          { ingredientId: "parsley", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "core",
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.7 },
          { ingredientId: "shallot", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "support",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.9 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "roasted-peanuts",
        tier: "support",
        substitutes: [
          { ingredientId: "cashews", similarity: 0.7 },
          { ingredientId: "peanut-butter", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "fermented-shrimp-paste",
        tier: "support",
        substitutes: [
          { ingredientId: "fish-sauce", similarity: 0.6 },
          { ingredientId: "regular-fish-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.8 },
        ],
      },
    ],
    history: "The dish was created by the Doan family in nineteenth century Hanoi, and their small eatery opened on what is now called Grilled Fish Lane in 1871. The family home doubled as a meeting place and hiding place for anti-colonial rebels, and the restaurant gave that activity a public cover. It is still in business today, serving only this one dish at communal tables over charcoal burners.",
    funFact: "The name honors a statue of La Vong, a strategist shown fishing, that once stood in the shop. The dish later appeared in a well known travel book, which helped turn a single restaurant lane into a Hanoi landmark.",
  },
  {
    id: "bun-rieu",
    name: "Bún Riêu",
    group: "north",
    region: "north",
    verb: "simmer",
    clue: "The rosy one: a tart tomato broth with soft crab clouds floating on top, brightened with herbs and lime at the table.",
    prepNote: "Crab and pork mixture formed, tomatoes wedged, tofu fried, noodles cooked, herbs picked, bean sprouts rinsed.",
    slots: [
      {
        ingredientId: "crab-meat",
        tier: "signature",
        substitutes: [
          { ingredientId: "canned-crab", similarity: 0.9 },
          { ingredientId: "shrimp", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "tomato",
        tier: "signature",
        substitutes: [
          { ingredientId: "canned-tomatoes", similarity: 0.85 },
          { ingredientId: "tomato-paste", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.9 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "ground-pork",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "tofu",
        tier: "core",
        substitutes: [
          { ingredientId: "extra-firm-tofu", similarity: 0.92 },
          { ingredientId: "silken-tofu", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "support",
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "fermented-shrimp-paste",
        tier: "support",
        substitutes: [
          { ingredientId: "fish-sauce", similarity: 0.6 },
          { ingredientId: "regular-fish-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "cilantro",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "parsley", similarity: 0.7 },
          { ingredientId: "mint", similarity: 0.55 },
        ],
      },
    ],
    history: "Bun rieu began in the north, where cooks ground small freshwater crabs, strained the shells, and simmered the liquid until the crab protein rose into soft, foamy clusters. That floating layer gives the dish its name and its soul. As it traveled south, the bowl grew more crowded, but the northern version stays closer to crab, tomato, and a lightly sour broth.",
    funFact: "The word for the crab clusters can be read as sea foam, a nod to how they puff up in the pot. Modern cooks often use canned crab paste instead of grinding crabs by hand, which keeps the dish practical outside Vietnam.",
  },
  {
    id: "ca-phe-trung",
    name: "Cà Phê Trứng",
    group: "north",
    region: "north",
    verb: "whisk",
    clue: "The frothy one: strong dark coffee under a thick, sweet custard foam, eaten with a spoon before the first sip.",
    prepNote: "Coffee ground, yolks separated, condensed milk measured, cups warmed, cocoa and cinnamon set out for dusting.",
    slots: [
      {
        ingredientId: "eggs",
        tier: "signature",
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "robusta-coffee",
        tier: "signature",
        substitutes: [
          { ingredientId: "arabica-coffee", similarity: 0.85 },
          { ingredientId: "instant-coffee", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "condensed-milk",
        tier: "core",
        substitutes: [
          { ingredientId: "evaporated-milk", similarity: 0.85 },
          { ingredientId: "whole-milk", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "sugar",
        tier: "core",
        substitutes: [
          { ingredientId: "palm-sugar", similarity: 0.88 },
          { ingredientId: "honey", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "cocoa-powder",
        tier: "support",
        substitutes: [
          { ingredientId: "dark-chocolate", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "whole-milk",
        tier: "support",
        substitutes: [
          { ingredientId: "evaporated-milk", similarity: 0.85 },
          { ingredientId: "butter", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "cinnamon",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "ground-cinnamon", similarity: 0.9 },
          { ingredientId: "cassia-bark", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "vanilla-extract",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "vanilla-sugar", similarity: 0.85 },
          { ingredientId: "cinnamon", similarity: 0.4 },
        ],
      },
    ],
    history: "Egg coffee was developed in Hanoi in the late 1940s, when fresh milk was hard to get and a cafe owner replaced it with whisked egg yolk. He had worked as a bartender at a grand Hanoi hotel, and in 1946 he left to open his own cafe built around the drink. The method stuck: yolks are beaten with sugar and condensed milk over gentle heat into a thick cream, then layered over strong coffee brewed through a small metal filter.",
    funFact: "The cup is often set in a bowl of hot water, or over a small candle, so the drink stays warm while the foam is eaten first. The yolk softens the bitter edge of robusta coffee, which is why the foam tastes like custard rather than egg.",
  },
  {
    id: "bun-dau-mam-tom",
    name: "Bún Đậu Mắm Tôm",
    group: "north",
    region: "north",
    verb: "sear",
    clue: "The funky one: crisp golden tofu and cool noodles for dipping into a sharp, salty, lime brightened paste.",
    prepNote: "Tofu cut and fried twice, pork belly boiled and sliced, noodles pressed into bundles, herbs washed, cucumber sliced, shrimp paste whisked.",
    slots: [
      {
        ingredientId: "tofu",
        tier: "signature",
        substitutes: [
          { ingredientId: "extra-firm-tofu", similarity: 0.92 },
          { ingredientId: "silken-tofu", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "fermented-shrimp-paste",
        tier: "signature",
        substitutes: [
          { ingredientId: "fish-sauce", similarity: 0.6 },
          { ingredientId: "regular-fish-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.9 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "pork-belly",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.75 },
          { ingredientId: "pork-chop", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "perilla-leaf",
        tier: "core",
        substitutes: [
          { ingredientId: "mint", similarity: 0.7 },
          { ingredientId: "thai-basil", similarity: 0.6 },
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
        ingredientId: "mint",
        tier: "support",
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "cilantro", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "support",
        substitutes: [
          { ingredientId: "lemon", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "jalapeno", similarity: 0.85 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "garnish",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.6 },
        ],
      },
    ],
    history: "Bun dau mam tom is a Hanoi street lunch, served as a shared platter rather than a single bowl. Fried tofu, boiled pork, noodles, and herbs are arranged for dipping, and the fermented shrimp paste at the center is what gives the plate its identity. The dish grew out of simple market cooking, where each part could be prepared ahead and assembled quickly at lunchtime.",
    funFact: "The shrimp paste is whisked with lime, sugar, and chili until it foams, which softens its punch without hiding it. Diners who find it too strong often ask for a milder fish sauce dip instead, and most stalls will offer one.",
  },
  {
    id: "banh-tom-ho-tay",
    name: "Bánh Tôm Hồ Tây",
    group: "north",
    region: "north",
    verb: "pour",
    clue: "The crunchy one: golden fritters with a whole shrimp on top, wrapped in lettuce and herbs for dunking.",
    prepNote: "Sweet potatoes julienned and soaked, shrimp cleaned, batter mixed, lettuce and herbs washed, pickles drained, dipping sauce mixed.",
    slots: [
      {
        ingredientId: "shrimp",
        tier: "signature",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "sweet-potato",
        tier: "signature",
        substitutes: [
          { ingredientId: "potato", similarity: 0.7 },
          { ingredientId: "carrots", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "rice-flour",
        tier: "core",
        substitutes: [
          { ingredientId: "tapioca-starch", similarity: 0.7 },
          { ingredientId: "wheat-flour", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "wheat-flour",
        tier: "core",
        substitutes: [
          { ingredientId: "rice-flour", similarity: 0.7 },
          { ingredientId: "tapioca-starch", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "core",
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "support",
        substitutes: [
          { ingredientId: "fresh-turmeric", similarity: 0.9 },
          { ingredientId: "curry-powder", similarity: 0.55 },
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
          { ingredientId: "cilantro", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "carrots", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
    ],
    history: "The fritter became famous along West Lake in Hanoi, where a lakeside restaurant made it a local specialty in the 1930s. Thin sweet potato sticks are folded into a turmeric tinted batter with whole shrimp, then fried until crisp. It started as a lakeside snack and stayed one, even as it moved from a single famous shop to stalls and restaurants across the city.",
    funFact: "Some accounts link the fritter to Spanish chickpea and shrimp fritters brought during the colonial period, reshaped with local sweet potato and shrimp. The classic way to eat it is wrapped in lettuce and herbs, not eaten plain from the plate.",
  },
  {
    id: "xoi-xeo",
    name: "Xôi Xéo",
    group: "north",
    region: "north",
    verb: "chop",
    clue: "The golden one: sunny sticky rice layered with creamy bean slices and a shower of crisp shallots.",
    prepNote: "Rice and mung beans soaked, beans steamed and pressed into balls, shallots sliced and fried, eggs boiled, coconut milk measured.",
    slots: [
      {
        ingredientId: "glutinous-rice",
        tier: "signature",
        substitutes: [
          { ingredientId: "jasmine-rice", similarity: 0.6 },
          { ingredientId: "long-grain-rice", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "mung-bean",
        tier: "signature",
        substitutes: [
          { ingredientId: "yellow-split-peas", similarity: 0.75 },
          { ingredientId: "lentils", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "core",
        substitutes: [
          { ingredientId: "fresh-turmeric", similarity: 0.9 },
          { ingredientId: "curry-powder", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "fried-shallots",
        tier: "core",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.85 },
          { ingredientId: "yellow-onion", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "coconut-milk",
        tier: "support",
        substitutes: [
          { ingredientId: "whole-milk", similarity: 0.55 },
          { ingredientId: "butter", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "chicken-fat",
        tier: "support",
        substitutes: [
          { ingredientId: "butter", similarity: 0.7 },
          { ingredientId: "chicken", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.6 },
        ],
      },
    ],
    history: "Xoi xeo is a Hanoi breakfast, sold from baskets and street corners early in the morning to students and workers who want something cheap and filling. The rice is soaked with turmeric until it turns yellow, then steamed, while mung beans are steamed, pounded, and pressed into balls. At serving time the seller slices those balls thinly over the rice by hand, which is the skill the dish is named for.",
    funFact: "The finished plate is a study in texture, with soft rice, melting bean, and crunchy shallots in one bite. Vendors traditionally finish it with a spoon of rendered fat, while home cooks often use coconut milk instead for a lighter, richer rice.",
  },
  {
    id: "bun-bo-hue",
    name: "Bún Bò Huế",
    group: "central",
    region: "central",
    verb: "pound",
    clue: "The spicy red one: a lemongrass scented, chili reddened broth over thick round noodles, with a deep savory funk under the heat.",
    prepNote: "Pork knuckle blanched, beef shank sliced, banana blossom shredded, lemongrass and chili oil portioned.",
    slots: [
      {
        ingredientId: "lemongrass",
        tier: "signature",
        substitutes: [
          { ingredientId: "lemongrass-paste", similarity: 0.9 },
          { ingredientId: "fresh-ginger", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "hue-shrimp-paste",
        tier: "signature",
        substitutes: [
          { ingredientId: "fish-sauce", similarity: 0.65 },
          { ingredientId: "soy-sauce", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "beef-shank",
        tier: "core",
        substitutes: [
          { ingredientId: "beef-brisket", similarity: 0.9 },
          { ingredientId: "pork-shoulder", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "pork-knuckle",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "pork-belly", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "cha-lua",
        tier: "core",
        substitutes: [
          { ingredientId: "ham", similarity: 0.6 },
          { ingredientId: "tofu", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "round-rice-noodle",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.85 },
          { ingredientId: "flat-rice-noodle", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.95 },
          { ingredientId: "soy-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "chili-oil",
        tier: "support",
        substitutes: [
          { ingredientId: "red-chili", similarity: 0.7 },
          { ingredientId: "jalapeno", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "banana-blossom",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.75 },
          { ingredientId: "bean-sprouts", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.9 },
        ],
      },
    ],
    history: "Hue was the old imperial capital, and its cooking kept a bold, court influenced character even in everyday noodle shops. Over generations, cooks built this bowl around beef and pork bones simmered with lemongrass, then seasoned it with fermented shrimp paste and chili oil instead of the gentler spice profile of pho. The result became Hue's signature soup, redder, spicier, and richer than its northern cousin.",
    funFact: "Many bowls arrive with a separate plate of raw garnishes, so the eater finishes the seasoning at the table with lime, herbs, and extra chili.",
  },
  {
    id: "mi-quang",
    name: "Mì Quảng",
    group: "central",
    region: "central",
    verb: "toss",
    clue: "The golden shallow one: wide yellow noodles glossed with just enough rich broth to coat them, finished with a shattering cracker crunch.",
    prepNote: "Eggs boiled and halved, peanuts crushed, shallots fried, herbs washed and picked.",
    slots: [
      {
        ingredientId: "mi-quang-noodle",
        tier: "signature",
        substitutes: [
          { ingredientId: "flat-rice-noodle", similarity: 0.8 },
          { ingredientId: "dried-rice-noodle", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "sesame-rice-cracker",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-rinds", similarity: 0.6 },
          { ingredientId: "roasted-peanuts", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "shrimp",
        tier: "core",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "pork-belly",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "ground-pork", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "support",
        substitutes: [
          { ingredientId: "fresh-ginger", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.95 },
          { ingredientId: "soy-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "roasted-peanuts",
        tier: "support",
        substitutes: [
          { ingredientId: "peanut-butter", similarity: 0.75 },
          { ingredientId: "toasted-rice-powder", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "support",
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.95 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.6 },
        ],
      },
    ],
    history: "Mi Quang comes from Quang Nam province in central Vietnam, where it grew from a simple local noodle meal into a dish for family gatherings, death anniversaries, and Tet. Its wide noodles were traditionally made with alkaline water for their yellow color and slippery bite, with turmeric later used to give the same golden look. The broth stays deliberately shallow and concentrated, so it coats the noodles instead of turning the bowl into soup.",
    funFact: "Local custom treats sharing a bowl of mi Quang as a gesture of affection and hospitality, and peanuts plus the sesame cracker are the crunch that marks the dish.",
  },
  {
    id: "cao-lau",
    name: "Cao Lầu",
    group: "central",
    region: "central",
    verb: "toss",
    clue: "The chewy dark one: thick, firm, amber tinted noodles with just a few spoonfuls of rich sauce, sliced seasoned pork, and crisp noodle squares on top.",
    prepNote: "Pork marinated in five spice and soy, bean sprouts blanched, lettuce and herbs washed, noodle squares fried.",
    slots: [
      {
        ingredientId: "cao-lau-noodle",
        tier: "signature",
        substitutes: [
          { ingredientId: "flat-rice-noodle", similarity: 0.65 },
          { ingredientId: "dried-rice-noodle", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "cao-lau-cracker",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-rinds", similarity: 0.7 },
          { ingredientId: "roasted-peanuts", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "pork-shoulder",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-belly", similarity: 0.85 },
          { ingredientId: "pork-chop", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "five-spice-powder",
        tier: "support",
        substitutes: [
          { ingredientId: "star-anise", similarity: 0.65 },
          { ingredientId: "ground-cinnamon", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "soy-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "maggi-seasoning", similarity: 0.75 },
          { ingredientId: "fish-sauce", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "support",
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.6 },
          { ingredientId: "green-onions", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
          { ingredientId: "shredded-cabbage", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "mint",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "cilantro", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.9 },
        ],
      },
    ],
    history: "Cao lau belongs to Hoi An, a port town that traded with Chinese, Japanese, and other merchants from the 15th to the 19th centuries, and the dish carries those mixed influences. Local telling links its name to eating on a high floor, and its noodles are famous for being made with ash water and well water said to give them their firm chew. One family has supplied the town's noodles for four generations, and today uses its own well with similar water and the same kind of tree for ash.",
    funFact: "The crisp squares on top are made from the same noodle dough, so the bowl pairs chewy noodles with their own crunchy form.",
  },
  {
    id: "banh-beo",
    name: "Bánh Bèo",
    group: "central",
    region: "central",
    verb: "simmer",
    clue: "The little saucer one: glossy, dimpled steamed rice cakes in small dishes, topped with savory orange shrimp, scallion oil, and crunch.",
    prepNote: "Batter mixed and rested, shrimp floss cooked and dried, scallion oil made, shallots fried.",
    slots: [
      {
        ingredientId: "shrimp-floss",
        tier: "signature",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.85 },
          { ingredientId: "shrimp", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "pork-rinds",
        tier: "signature",
        substitutes: [
          { ingredientId: "fried-shallots", similarity: 0.6 },
          { ingredientId: "roasted-peanuts", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "rice-flour",
        tier: "core",
        substitutes: [
          { ingredientId: "tapioca-starch", similarity: 0.6 },
          { ingredientId: "long-grain-rice", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "tapioca-starch",
        tier: "core",
        substitutes: [
          { ingredientId: "rice-flour", similarity: 0.6 },
          { ingredientId: "toasted-rice-powder", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "support",
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.85 },
          { ingredientId: "shallot", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "fried-shallots",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "shallot", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "jalapeno", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.9 },
        ],
      },
    ],
    history: "Banh beo is a specialty of central Vietnam, popular in Hue, Da Nang, Quang Nam, and Quang Ngai, where it is sold as a cheap, simple, and elegant snack eaten through the day. The cakes are steamed in small ceramic dishes from a rested rice flour and tapioca batter until set and glossy with a dimple in the center. Hue style tops them with minced shrimp cooked dry and orange, plus scallion oil and crispy toppings, served with a light sweet and salty fish sauce dip.",
    funFact: "At group meals the empty saucers pile up, so the stack on the table becomes a visible count of how many cakes everyone ate.",
  },
  {
    id: "nem-lui",
    name: "Nem Lụi",
    group: "central",
    region: "central",
    verb: "sear",
    secondaryVerb: "pound",
    clue: "The lemongrass skewer one: charred, fragrant pork molded around a lemongrass stalk, slid off and rolled at the table with fresh herbs and a thick peanut dip.",
    prepNote: "Pork mixed and chilled, lemongrass stalks peeled, pickles made, lettuce and herbs washed.",
    slots: [
      {
        ingredientId: "lemongrass",
        tier: "signature",
        substitutes: [
          { ingredientId: "lemongrass-paste", similarity: 0.9 },
          { ingredientId: "fresh-ginger", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "peanut-sesame-sauce",
        tier: "signature",
        substitutes: [
          { ingredientId: "peanut-butter", similarity: 0.8 },
          { ingredientId: "hoisin-sauce", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "ground-pork",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "pork-belly", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "rice-paper",
        tier: "core",
        substitutes: [
          { ingredientId: "brown-rice-paper", similarity: 0.9 },
          { ingredientId: "wheat-wrappers", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "glass-noodles",
        tier: "support",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.8 },
          { ingredientId: "round-rice-noodle", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.95 },
          { ingredientId: "soy-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "support",
        substitutes: [
          { ingredientId: "carrots", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
          { ingredientId: "shredded-cabbage", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "mint",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.75 },
          { ingredientId: "cilantro", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "cucumber",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "zucchini", similarity: 0.6 },
          { ingredientId: "carrots", similarity: 0.5 },
        ],
      },
    ],
    history: "Nem lui is a Hue street food specialty built around ground pork mixed with lemongrass, shallot, garlic, fish sauce, and sugar, then molded onto peeled lemongrass stalks and grilled over charcoal. The stalk works as both skewer and handle, and the cooked pork is slid off at the table and rolled in softened rice paper with lettuce, herbs, noodles, and pickles. Its thick pork and peanut dipping sauce, called nuoc leo, is as much a part of the dish as the skewer itself.",
    funFact: "Because the roll is built by the eater, the same platter can turn into a different bite every time depending on which herb and pickle goes in.",
  },
  {
    id: "com-ga-hoi-an",
    name: "Cơm Gà Hội An",
    group: "central",
    region: "central",
    verb: "chop",
    clue: "The golden chicken rice one: glossy turmeric tinted rice with shredded poached chicken, sliced onion, and herbs, brightened by lime and a sweet sour dip.",
    prepNote: "Chicken poached and shredded, turmeric rice cooked in broth, pickles made, shallots fried.",
    slots: [
      {
        ingredientId: "chicken",
        tier: "signature",
        substitutes: [
          { ingredientId: "tofu", similarity: 0.55 },
          { ingredientId: "pork-chop", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "signature",
        substitutes: [
          { ingredientId: "fresh-ginger", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "jasmine-rice",
        tier: "core",
        substitutes: [
          { ingredientId: "long-grain-rice", similarity: 0.9 },
          { ingredientId: "broken-rice", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "yellow-onion",
        tier: "core",
        substitutes: [
          { ingredientId: "white-onion", similarity: 0.95 },
          { ingredientId: "shallot", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "vietnamese-coriander",
        tier: "core",
        substitutes: [
          { ingredientId: "cilantro", similarity: 0.7 },
          { ingredientId: "mint", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "fried-shallots",
        tier: "support",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.85 },
          { ingredientId: "green-onions", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "pickled-carrot-daikon",
        tier: "support",
        substitutes: [
          { ingredientId: "carrots", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "lemon", similarity: 0.9 },
        ],
      },
    ],
    history: "Com ga Hoi An is traced to around 1950, when Hoi An cooks turned street vendor chicken and rice into a town signature, drawing on Tam Ky chicken and fragrant rice grown along the Thu Bon river. The chicken is poached, then shredded and tossed with onion, Vietnamese coriander, salt, pepper, and lime, while the rice is cooked in chicken broth with turmeric for its golden color. Free range garden chickens are prized for this dish for their firmer texture and golden skin.",
    funFact: "The rice is the star as much as the chicken, since cooking it in broth and turmeric makes it rich and fragrant on its own.",
  },
  {
    id: "hu-tieu",
    name: "Hủ Tiếu",
    group: "south",
    region: "south",
    verb: "pour",
    clue: "The loaded one: a clear, porky broth poured over chewy, translucent noodles, crowded with toppings and a little egg peeking out.",
    prepNote: "Pork bones simmering for a clear broth, ground pork seasoned, shrimp and sliced pork ready, herbs and sprouts washed.",
    slots: [
      {
        ingredientId: "hu-tieu-noodle",
        tier: "signature",
        substitutes: [
          { ingredientId: "flat-rice-noodle", similarity: 0.55 },
          { ingredientId: "glass-noodles", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "pork-bones",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.7 },
          { ingredientId: "chicken", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "ground-pork",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.8 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "shrimp",
        tier: "core",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "pork-belly",
        tier: "core",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.85 },
          { ingredientId: "ham", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "quail-eggs",
        tier: "support",
        substitutes: [
          { ingredientId: "eggs", similarity: 0.85 },
          { ingredientId: "liquid-egg", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "garlic",
        tier: "support",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
          { ingredientId: "shredded-cabbage", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.5 },
        ],
      },
    ],
    history: "Hu tieu traces back to Teochew Chinese cooks and the Phnom Penh noodle soup kuyteav, and it took hold in Saigon and the South in the mid 1900s. Southern cooks remade the noodle itself, turning a soft flat rice noodle into the chewy, clear strand the dish is now known by.",
    funFact: "A bowl can be ordered wet or dry, and in the dry version the broth comes on the side while the noodles get tossed in sauce instead.",
  },
  {
    id: "banh-xeo",
    name: "Bánh Xèo",
    group: "south",
    region: "south",
    verb: "pour",
    clue: "The sizzling one: a lacy golden crepe folded over a crunchy, sprout-filled middle, torn apart and wrapped in leaves for dunking.",
    prepNote: "Batter whisked and rested, shrimp and pork sliced thin, sprouts rinsed, lettuce and herbs picked for wrapping.",
    slots: [
      {
        ingredientId: "rice-flour",
        tier: "signature",
        substitutes: [
          { ingredientId: "cornstarch", similarity: 0.55 },
          { ingredientId: "wheat-flour", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "turmeric-powder",
        tier: "signature",
        substitutes: [
          { ingredientId: "curry-powder", similarity: 0.7 },
          { ingredientId: "galangal", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "coconut-milk",
        tier: "core",
        substitutes: [
          { ingredientId: "coconut-water", similarity: 0.65 },
          { ingredientId: "butter", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "shrimp",
        tier: "core",
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
          { ingredientId: "ham", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "support",
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "mung-bean",
        tier: "support",
        substitutes: [
          { ingredientId: "roasted-peanuts", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "support",
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.75 },
          { ingredientId: "shallot", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
    ],
    history: "Banh xeo began in Central Vietnam as a rice flour crepe, and the southern version grew bigger, thinner and richer with coconut milk in the batter. Its name copies the loud sizzle the batter makes when it is ladled into a ripping hot pan.",
    funFact: "In the South the crepe is cut up and eaten wrapped in lettuce and herbs, so one fried pancake is eaten like a fresh salad roll.",
  },
  {
    id: "canh-chua",
    name: "Canh Chua",
    group: "south",
    region: "south",
    verb: "simmer",
    clue: "The bright one: a clear sour-sweet broth with white fish chunks, red wedges and green herbs floating across the top.",
    prepNote: "Tamarind soaked and strained, fish cut in chunks, pineapple and tomato wedged, okra sliced and herbs picked.",
    slots: [
      {
        ingredientId: "catfish",
        tier: "signature",
        substitutes: [
          { ingredientId: "white-fish", similarity: 0.85 },
          { ingredientId: "shrimp", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "tamarind",
        tier: "signature",
        substitutes: [
          { ingredientId: "lime", similarity: 0.7 },
          { ingredientId: "lemon", similarity: 0.65 },
        ],
      },
      {
        ingredientId: "pineapple",
        tier: "core",
        substitutes: [
          { ingredientId: "tomato", similarity: 0.5 },
          { ingredientId: "lemon", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "tomato",
        tier: "core",
        substitutes: [
          { ingredientId: "zucchini", similarity: 0.45 },
          { ingredientId: "carrots", similarity: 0.4 },
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
        ingredientId: "palm-sugar",
        tier: "support",
        substitutes: [
          { ingredientId: "sugar", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "okra",
        tier: "support",
        substitutes: [
          { ingredientId: "zucchini", similarity: 0.6 },
          { ingredientId: "shredded-cabbage", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "bean-sprouts",
        tier: "support",
        substitutes: [
          { ingredientId: "shredded-cabbage", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "jalapeno", similarity: 0.85 },
        ],
      },
      {
        ingredientId: "rice-paddy-herb",
        tier: "garnish",
        substitutes: [
          { ingredientId: "thai-basil", similarity: 0.6 },
          { ingredientId: "culantro", similarity: 0.7 },
          { ingredientId: "mint", similarity: 0.35 },
        ],
      },
    ],
    history: "Canh chua is the Mekong Delta's everyday sour soup, built on tamarind with pineapple and tomato rounding the sourness into something sweet as well. River fish like catfish or snakehead go in last with okra and sprouts so the vegetables stay crisp.",
    funFact: "It is traditionally served next to dark, salty ca kho to, the sour soup and the caramel fish balancing each other across the same meal.",
  },
  {
    id: "ca-kho-to",
    name: "Cá Kho Tộ",
    group: "south",
    region: "south",
    verb: "simmer",
    clue: "The mahogany one: fish steaks lacquered dark and glossy in a clay pot, the sauce simmered down almost to a glaze.",
    prepNote: "Caramel made ahead and jarred, fish marinated in fish sauce with shallot and pepper, coconut water opened and ready.",
    slots: [
      {
        ingredientId: "catfish",
        tier: "signature",
        substitutes: [
          { ingredientId: "white-fish", similarity: 0.85 },
          { ingredientId: "pork-belly", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "caramel-sauce",
        tier: "signature",
        substitutes: [
          { ingredientId: "hoisin-sauce", similarity: 0.55 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
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
        ingredientId: "coconut-water",
        tier: "core",
        substitutes: [
          { ingredientId: "coconut-milk", similarity: 0.6 },
          { ingredientId: "sugar", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "core",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.9 },
          { ingredientId: "white-onion", similarity: 0.85 },
        ],
      },
      {
        ingredientId: "garlic",
        tier: "support",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.65 },
          { ingredientId: "ginger", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "sugar",
        tier: "support",
        substitutes: [
          { ingredientId: "palm-sugar", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "black-pepper",
        tier: "support",
        substitutes: [
          { ingredientId: "red-chili", similarity: 0.5 },
          { ingredientId: "jalapeno", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "jalapeno", similarity: 0.85 },
        ],
      },
    ],
    history: "Ca kho to comes from the Mekong Delta, where catfish is plentiful and the earthenware to pot gives the dish its name. The kho method, braising in fish sauce and dark caramel until the liquid nearly vanishes, began as a way to keep fish good in tropical heat before refrigeration.",
    funFact: "Cooks judge the caramel by nerve, taking it a shade darker than feels safe, because an amber caramel makes the dish taste sweet and flat while a deep mahogany one gives it its bitter edge.",
  },
  {
    id: "cha-gio",
    name: "Chả Giò",
    group: "south",
    region: "south",
    verb: "wrap",
    clue: "The crackling one: slim golden cylinders that shatter when bitten, with a springy, peppery filling packed inside.",
    prepNote: "Noodles soaked and snipped, wood ears soaked and minced, filling mixed and drained so the rolls fry crisp, not soggy.",
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
        ingredientId: "ground-pork",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.75 },
          { ingredientId: "chicken", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "glass-noodles",
        tier: "core",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.55 },
          { ingredientId: "round-rice-noodle", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "wood-ear-mushroom",
        tier: "core",
        substitutes: [
          { ingredientId: "mushrooms", similarity: 0.8 },
          { ingredientId: "shredded-cabbage", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "carrots",
        tier: "core",
        substitutes: [
          { ingredientId: "pickled-carrot-daikon", similarity: 0.6 },
          { ingredientId: "zucchini", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "shrimp",
        tier: "support",
        substitutes: [
          { ingredientId: "shrimp-small", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "support",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "support",
        substitutes: [
          { ingredientId: "liquid-egg", similarity: 0.85 },
        ],
      },
      {
        ingredientId: "green-leaf-lettuce",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "romaine", similarity: 0.9 },
        ],
      },
    ],
    history: "Cha gio is the southern name for Vietnam's fried roll, ground pork with vermicelli, mushrooms and diced vegetables rolled in moistened rice paper and fried until the coat turns crisp and golden. The filling is flexible by design, with crab, shrimp, chicken or tofu all appearing in family versions.",
    funFact: "A rare party version, cha gio re, swaps the rice paper for a woven sheet of fine rice vermicelli, making tiny rolls that are much harder to wrap.",
  },
  {
    id: "thit-kho",
    name: "Thịt Kho",
    group: "south",
    region: "south",
    verb: "simmer",
    clue: "The amber one: big cubes of layered pork and whole peeled eggs shining in a dark, sweet and salty braise.",
    prepNote: "Eggs boiled and peeled, pork belly cubed and marinated with shallot and fish sauce, caramel made, coconut water ready.",
    slots: [
      {
        ingredientId: "pork-belly",
        tier: "signature",
        substitutes: [
          { ingredientId: "pork-shoulder", similarity: 0.9 },
          { ingredientId: "pork-chop", similarity: 0.75 },
        ],
      },
      {
        ingredientId: "eggs",
        tier: "signature",
        substitutes: [
          { ingredientId: "duck-eggs", similarity: 0.95 },
          { ingredientId: "liquid-egg", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "coconut-water",
        tier: "core",
        substitutes: [
          { ingredientId: "coconut-milk", similarity: 0.6 },
          { ingredientId: "sugar", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "caramel-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "hoisin-sauce", similarity: 0.55 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
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
        ingredientId: "shallot",
        tier: "support",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "sugar",
        tier: "support",
        substitutes: [
          { ingredientId: "palm-sugar", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "black-pepper",
        tier: "support",
        substitutes: [
          { ingredientId: "red-chili", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.7 },
        ],
      },
    ],
    history: "Thit kho is the South's Tet anchor, a big pot of pork and whole eggs braised in coconut water, fish sauce and caramel that keeps for days while markets are closed for the holiday. It likely developed from the Fujian pork and egg dish tau yu bak, remade with Vietnamese seasonings and coconut juice in place of water.",
    funFact: "The whole eggs are left unbroken on purpose, standing for wholeness and prosperity for the family in the year ahead.",
  },
  {
    id: "bo-kho",
    name: "Bò Kho",
    group: "south",
    region: "south",
    verb: "simmer",
    clue: "The rust-red one: tender beef chunks and carrot coins in a spiced, citrusy broth made for tearing bread into.",
    prepNote: "Beef cubed and marinating with lemongrass and spice, carrots cut in big coins, lemongrass stalks bruised, baguettes ordered for service.",
    slots: [
      {
        ingredientId: "beef-shank",
        tier: "signature",
        substitutes: [
          { ingredientId: "beef-brisket", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "lemongrass",
        tier: "signature",
        substitutes: [
          { ingredientId: "lemongrass-paste", similarity: 0.85 },
          { ingredientId: "lemon", similarity: 0.3 },
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
        ingredientId: "carrots",
        tier: "core",
        substitutes: [
          { ingredientId: "zucchini", similarity: 0.45 },
          { ingredientId: "tomato", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "tomato-paste",
        tier: "support",
        substitutes: [
          { ingredientId: "tomato", similarity: 0.7 },
          { ingredientId: "pickled-carrot-daikon", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "ginger",
        tier: "support",
        substitutes: [
          { ingredientId: "fresh-ginger", similarity: 0.85 },
          { ingredientId: "galangal", similarity: 0.5 },
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
        ingredientId: "yellow-onion",
        tier: "support",
        substitutes: [
          { ingredientId: "white-onion", similarity: 0.95 },
          { ingredientId: "shallot", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "thai-basil",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "sweet-basil", similarity: 0.85 },
          { ingredientId: "mint", similarity: 0.6 },
        ],
      },
    ],
    history: "Bo kho grew out of French beef and carrot stews during the colonial period, when beef first became common in Vietnam. Vietnamese cooks lightened the French braise with lemongrass, star anise and fish sauce, keeping it brothy rather than thickened, and it became a favorite breakfast with a baguette for dipping.",
    funFact: "Authentic versions use carrots only, never potatoes, and the carrot is a direct inheritance from the French boeuf aux carottes.",
  },
  {
    id: "ga-chien-nuoc-mam",
    name: "Gà Chiên Nước Mắm",
    group: "south",
    region: "south",
    verb: "sear",
    clue: "The sticky one: crisp fried wings lacquered shiny and sweet-salty, freckled all over with golden fried garlic.",
    prepNote: "Wings marinating in fish sauce and garlic, coating flour mixed, garlic sliced for frying, glaze measured out before service.",
    slots: [
      {
        ingredientId: "chicken-wings",
        tier: "signature",
        substitutes: [
          { ingredientId: "chicken", similarity: 0.85 },
          { ingredientId: "tofu", similarity: 0.3 },
        ],
      },
      {
        ingredientId: "fish-sauce",
        tier: "signature",
        substitutes: [
          { ingredientId: "regular-fish-sauce", similarity: 0.92 },
          { ingredientId: "soy-sauce", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "garlic",
        tier: "core",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.65 },
          { ingredientId: "ginger", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "sugar",
        tier: "core",
        substitutes: [
          { ingredientId: "palm-sugar", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "cornstarch",
        tier: "core",
        substitutes: [
          { ingredientId: "rice-flour", similarity: 0.85 },
          { ingredientId: "wheat-flour", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "black-pepper",
        tier: "support",
        substitutes: [
          { ingredientId: "red-chili", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "lime",
        tier: "support",
        substitutes: [
          { ingredientId: "lemon", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "shallot",
        tier: "support",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "cilantro",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "parsley", similarity: 0.5 },
          { ingredientId: "mint", similarity: 0.45 },
        ],
      },
      {
        ingredientId: "red-chili",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "jalapeno", similarity: 0.85 },
        ],
      },
    ],
    history: "Ga chien nuoc mam is a beloved home and snack-table dish of wings fried crisp, then tossed hot in a reduced fish sauce and sugar glaze. The marinade itself is often simmered down into the coating, so nothing of the salty, garlicky liquid is wasted.",
    funFact: "The classic marinade is an equal parts ratio of water, fish sauce and sugar, so cooks can scale a batch of any size without recalculating.",
  },
  {
    id: "nui-xao-bo",
    name: "Nui Xào Bò",
    group: "home",
    region: "home",
    verb: "sear",
    clue: "The pasta one: bouncy short pasta slick with tomato and soy, seared beef, and soft onion and tomato wedges.",
    prepNote: "Beef sliced thin and marinating, macaroni boiled al dente and tossed with oil, onion, carrot, and tomato cut for the wok.",
    slots: [
      {
        ingredientId: "beef-shank",
        tier: "signature",
        substitutes: [
          { ingredientId: "beef-brisket", similarity: 0.9 },
          { ingredientId: "chicken", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "macaroni",
        tier: "signature",
        substitutes: [
          { ingredientId: "dried-rice-noodle", similarity: 0.6 },
          { ingredientId: "round-rice-noodle", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "white-onion",
        tier: "core",
        substitutes: [
          { ingredientId: "yellow-onion", similarity: 0.95 },
          { ingredientId: "shallot", similarity: 0.8 },
        ],
      },
      {
        ingredientId: "tomato",
        tier: "core",
        substitutes: [
          { ingredientId: "tomato-paste", similarity: 0.7 },
        ],
      },
      {
        ingredientId: "soy-sauce",
        tier: "core",
        substitutes: [
          { ingredientId: "maggi-seasoning", similarity: 0.85 },
          { ingredientId: "regular-fish-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "oyster-sauce",
        tier: "support",
        substitutes: [
          { ingredientId: "soy-sauce", similarity: 0.75 },
          { ingredientId: "fish-sauce", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "garlic",
        tier: "support",
        substitutes: [
          { ingredientId: "shallot", similarity: 0.55 },
          { ingredientId: "ginger", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "carrots",
        tier: "support",
        substitutes: [
          { ingredientId: "zucchini", similarity: 0.55 },
        ],
      },
      {
        ingredientId: "green-onions",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "garlic-chives", similarity: 0.7 },
          { ingredientId: "cilantro", similarity: 1 },
        ],
      },
    ],
    history: "Pasta reached Vietnam during the French colonial period, and the word nui comes from the French word for noodle. Vietnamese cooks kept the short pasta shapes but seasoned them with soy, fish sauce, and tomato, turning a foreign pantry item into a quick home and street dish. It stayed popular as an easy, filling meal that reheats well and suits a family table.",
    funFact: "The macaroni used in Vietnam is often a longer, straight tube made from wheat and rice flour, which stays springier in the stir fry than plain wheat elbow pasta, and cooks use penne or rigatoni when that tube is hard to find.",
  },
  {
    id: "che-dau-xanh",
    name: "Chè Đậu Xanh",
    group: "home",
    region: "home",
    verb: "simmer",
    clue: "The cool sweet one: tender mung beans in sweet coconut milk, served cold with small chewy pearls.",
    prepNote: "Mung beans soaked overnight and drained, tapioca pearls soaked, coconut milk sweetened and kept ready, pandan tied in a bundle.",
    slots: [
      {
        ingredientId: "mung-bean",
        tier: "signature",
        substitutes: [
          { ingredientId: "peeled-mung-bean", similarity: 0.95 },
        ],
      },
      {
        ingredientId: "coconut-milk",
        tier: "signature",
        substitutes: [
          { ingredientId: "coconut-flakes", similarity: 0.6 },
        ],
      },
      {
        ingredientId: "sugar",
        tier: "core",
        substitutes: [
          { ingredientId: "rock-sugar", similarity: 0.9 },
        ],
      },
      {
        ingredientId: "tapioca-pearls",
        tier: "core",
        substitutes: [
          { ingredientId: "glass-noodles", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "pandan-leaves",
        tier: "support",
        substitutes: [
          { ingredientId: "mint", similarity: 0.35 },
        ],
      },
      {
        ingredientId: "lotus-seeds",
        tier: "support",
        optional: true,
        substitutes: [
          { ingredientId: "roasted-peanuts", similarity: 0.5 },
        ],
      },
      {
        ingredientId: "aloe-vera",
        tier: "support",
        substitutes: [
          { ingredientId: "coconut-flakes", similarity: 0.4 },
        ],
      },
      {
        ingredientId: "roasted-peanuts",
        tier: "garnish",
        optional: true,
        substitutes: [
          { ingredientId: "peanut-butter", similarity: 0.75 },
        ],
      },
    ],
    history: "Che covers a whole family of Vietnamese sweet soups and puddings that can be served hot, cold, or over ice, built from beans, tapioca, and other simple pantry foods. Che dau xanh centers on mung beans simmered with sugar until tender, with coconut milk stirred in near the end. Because mung beans are thought to be cooling, the chilled version is a favorite summer dessert.",
    funFact: "Two versions exist. Whole unpeeled beans stay separate with an earthy taste from the green skin, while peeled split beans break down into a smooth soup, and cooks warn against mixing the two.",
  },
];

export const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(
  DISHES.map((d) => [d.id, d]),
);

/** The starter set, in teaching order. */
export const STARTER_IDS: string[] = DISHES.filter(
  (d) => d.group === "starter",
).map((d) => d.id);
