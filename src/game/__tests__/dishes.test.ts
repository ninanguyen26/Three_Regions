import { DISH_BY_ID, DISHES } from "../../data/dishes";
import { INGREDIENT_BY_ID, INGREDIENTS } from "../../data/ingredients";
import { scoreDish, TIER_WEIGHTS } from "../scorer";

// Paper cases for the three starter records added 2026-10-24 (gỏi cuốn,
// bánh mì, cơm tấm sườn), mirroring the phở acceptance cases: exact = 100,
// a missing signature caps below the stamp, one close sub stays gold, and
// a foreign pick is dinged as unused.
const swap = (b: string[], o: string, i: string) =>
  b.map((x) => (x === o ? i : x));
const drop = (b: string[], o: string) => b.filter((x) => x !== o);

const CASES: {
  dishId: string;
  signatureId: string;
  goldSub: [string, string];
  garnishId: string;
}[] = [
  { dishId: "goi-cuon", signatureId: "rice-paper", goldSub: ["green-leaf-lettuce", "romaine"], garnishId: "garlic-chives" },
  { dishId: "banh-mi", signatureId: "vietnamese-baguette", goldSub: ["mayonnaise", "kewpie-mayo"], garnishId: "red-chili" },
  { dishId: "com-tam-suon", signatureId: "broken-rice", goldSub: ["broken-rice", "jasmine-rice"], garnishId: "cucumber" },
];

describe("starter dish records", () => {
  test("every slot and substitute references a real shelf ingredient", () => {
    for (const c of CASES) {
      const dish = DISH_BY_ID[c.dishId];
      for (const s of dish.slots) {
        expect(INGREDIENT_BY_ID[s.ingredientId]).toBeDefined();
        for (const sub of s.substitutes) {
          expect(INGREDIENT_BY_ID[sub.ingredientId]).toBeDefined();
        }
      }
    }
  });

  for (const c of CASES) {
    describe(c.dishId, () => {
      const dish = DISH_BY_ID[c.dishId];
      const exact = dish.slots.map((s) => s.ingredientId);

      test("exact basket = 100 gold, no wrong picks", () => {
        const r = scoreDish(dish, exact);
        expect(r.percent).toBe(100);
        expect(r.medal).toBe("gold");
        expect(r.wrongPicks).toEqual([]);
      });

      test("missing signature caps below the stamp", () => {
        const r = scoreDish(dish, drop(exact, c.signatureId));
        expect(r.capped).toBe(true);
        expect(r.percent).toBeLessThan(80);
        expect(r.biggestMiss?.ingredientId).toBe(c.signatureId);
      });

      test("one close substitute stays gold", () => {
        const r = scoreDish(dish, swap(exact, c.goldSub[0], c.goldSub[1]));
        expect(r.percent).toBeGreaterThanOrEqual(95);
        expect(r.medal).toBe("gold");
      });

      test("a foreign pick is dinged as unused", () => {
        const r = scoreDish(dish, swap(exact, c.garnishId, "chicken"));
        expect(r.wrongPicks).toEqual(["chicken"]);
        expect(r.wrongPickPenalty).toBe(6);
      });
    });
  }
});

describe("menu scoring", () => {
  const pho = DISH_BY_ID["pho-bo"];
  const goi = DISH_BY_ID["goi-cuon"];
  const menu = [pho, goi];
  const union = [
    ...new Set([
      ...pho.slots.map((s) => s.ingredientId),
      ...goi.slots.map((s) => s.ingredientId),
    ]),
  ];

  test("a shared basket scores every menu dish clean", () => {
    for (const d of menu) {
      const r = scoreDish(d, union, 1, menu);
      expect(r.percent).toBe(100);
      expect(r.wrongPicks).toEqual([]);
    }
  });

  test("a pick no menu dish uses still dings", () => {
    const r = scoreDish(pho, [...union, "tofu"], 1, menu);
    expect(r.wrongPicks).toEqual(["tofu"]);
    expect(r.percent).toBe(94);
  });

  test("a family loser across the whole menu dings", () => {
    const r = scoreDish(pho, [...union, "dried-rice-noodle"], 1, menu);
    expect(r.wrongPicks).toEqual(["dried-rice-noodle"]);
  });
});

describe("24 new dish records", () => {
  const NEW = DISHES.filter((d) => d.group !== "starter");

  test("integrity: unique ids, refs resolve, 2 signatures, 8-10 slots", () => {
    expect(new Set(DISHES.map((d) => d.id)).size).toBe(DISHES.length);
    expect(new Set(INGREDIENTS.map((i) => i.id)).size).toBe(INGREDIENTS.length);
    for (const d of DISHES) {
      expect(d.slots.length).toBeGreaterThanOrEqual(8);
      expect(d.slots.length).toBeLessThanOrEqual(10);
      expect(d.slots.filter((s) => s.tier === "signature").length).toBe(2);
      for (const s of d.slots) {
        expect(INGREDIENT_BY_ID[s.ingredientId]).toBeDefined();
        for (const sub of s.substitutes) {
          expect(INGREDIENT_BY_ID[sub.ingredientId]).toBeDefined();
          expect(sub.similarity).toBeGreaterThan(0);
          expect(sub.similarity).toBeLessThan(1);
        }
      }
    }
  });

  test("texts present, no em-dash, no draft marks", () => {
    for (const d of DISHES) {
      for (const text of [d.clue, d.prepNote, d.history, d.funFact]) {
        expect(text.length).toBeGreaterThan(0);
        expect(text).not.toContain("—");
        expect(text).not.toContain("[draft]");
      }
      expect(d.name).not.toContain("—");
    }
  });

  test("secondaryVerb only on nem-lui", () => {
    for (const d of DISHES) {
      if (d.id === "nem-lui") expect(d.secondaryVerb).toBe("pound");
      else expect(d.secondaryVerb).toBeUndefined();
    }
  });

  for (const dish of NEW) {
    describe(dish.id, () => {
      const exact = dish.slots.map((s) => s.ingredientId);
      const sig = dish.slots.find((s) => s.tier === "signature")!;

      test("exact basket = 100 gold, no wrong picks", () => {
        const r = scoreDish(dish, exact);
        expect(r.percent).toBe(100);
        expect(r.medal).toBe("gold");
        expect(r.wrongPicks).toEqual([]);
      });

      test("missing signature caps below the stamp", () => {
        const r = scoreDish(dish, drop(exact, sig.ingredientId));
        expect(r.capped).toBe(true);
        expect(r.percent).toBeLessThan(80);
        expect(r.biggestMiss?.ingredientId).toBe(sig.ingredientId);
      });

      test("closest substitute stays gold", () => {
        let best: { slot: string; sub: string; loss: number } | null = null;
        for (const s of dish.slots) {
          for (const sub of s.substitutes) {
            const loss = TIER_WEIGHTS[s.tier] * (1 - sub.similarity);
            if (!best || loss < best.loss) {
              best = { slot: s.ingredientId, sub: sub.ingredientId, loss };
            }
          }
        }
        expect(best).not.toBeNull();
        const r = scoreDish(dish, swap(exact, best!.slot, best!.sub));
        expect(r.percent).toBeGreaterThanOrEqual(95);
        expect(r.medal).toBe("gold");
      });

      test("one foreign pick is dinged as unused", () => {
        const used = new Set<string>();
        for (const s of dish.slots) {
          used.add(s.ingredientId);
          for (const sub of s.substitutes) used.add(sub.ingredientId);
        }
        const foreign = INGREDIENTS.find((i) => !used.has(i.id))!;
        const r = scoreDish(dish, [...exact, foreign.id]);
        expect(r.wrongPicks).toContain(foreign.id);
        expect(r.wrongPickPenalty).toBe(6);
        expect(r.percent).toBe(94);
      });
    });
  }
});
