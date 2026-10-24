import { DISH_BY_ID } from "../../data/dishes";
import { scoreDish } from "../scorer";

// The paper cases from the design, on the basket model: pick freely up to
// the dish's cap; each slot scores its best match; unused picks are dinged.
const pho = DISH_BY_ID["pho-bo"];
const EXACT: string[] = pho.slots.map((s) => s.ingredientId);

const swap = (basket: string[], outId: string, inId: string) =>
  basket.map((id) => (id === outId ? inId : id));
const drop = (basket: string[], outId: string) =>
  basket.filter((id) => id !== outId);

describe("phở bò: paper cases", () => {
  test("exact recipe scores 100 and gold", () => {
    const r = scoreDish(pho, EXACT);
    expect(r.percent).toBe(100);
    expect(r.medal).toBe("gold");
    expect(r.capped).toBe(false);
    expect(r.biggestMiss).toBeNull();
    expect(r.wrongPicks).toEqual([]);
  });

  test("one close substitute (0.93 beef shank) still reaches gold", () => {
    const r = scoreDish(pho, swap(EXACT, "beef-brisket", "beef-shank"));
    expect(r.percent).toBeGreaterThanOrEqual(95);
    expect(r.medal).toBe("gold");
  });

  test("missing signature ingredient is capped below the stamp", () => {
    const r = scoreDish(pho, drop(EXACT, "beef-brisket"));
    expect(r.capped).toBe(true);
    expect(r.percent).toBeLessThan(80);
    expect(r.medal).toBe("fail");
    expect(r.biggestMiss?.ingredientId).toBe("beef-brisket");
  });

  test("wrong-family signature pick (chicken in phở bò) drops the score hard", () => {
    const r = scoreDish(pho, swap(EXACT, "beef-brisket", "chicken"));
    // chicken is the beef slot's best (only) family match at 0.4: it scores
    // the slot, so no cap and no wrong-pick ding. The weight does the damage.
    expect(r.capped).toBe(false);
    expect(r.wrongPicks).toEqual([]);
    expect(r.percent).toBeLessThan(90);
  });

  test("missing one garnish lands around 95-97", () => {
    const r = scoreDish(pho, drop(EXACT, "lime"));
    expect(r.percent).toBeGreaterThanOrEqual(95);
    expect(r.percent).toBeLessThanOrEqual(97);
    expect(r.biggestMiss?.ingredientId).toBe("lime");
  });

  test("two close substitutes land silver", () => {
    const r = scoreDish(
      pho,
      swap(
        swap(EXACT, "flat-rice-noodle", "dried-rice-noodle"), // 0.88 signature
        "star-anise",
        "five-spice-powder", // 0.78 core
      ),
    );
    expect(r.medal).toBe("silver");
    expect(r.percent).toBeGreaterThanOrEqual(90);
    expect(r.percent).toBeLessThan(95);
  });

  test("sloppy execution costs at most 5 points", () => {
    const r = scoreDish(pho, EXACT, 0);
    expect(r.percent).toBe(95);
  });
});

describe("phở bò: the free basket", () => {
  test("hoarding all three noodles dings the extras and starves other slots", () => {
    // 3 noodles + 7 exact others = a full basket of 10; sprouts and lime
    // never made it in. The flat noodle scores the slot; the other two are
    // wrong picks at -6 each.
    const basket = [
      "beef-brisket",
      "flat-rice-noodle",
      "dried-rice-noodle",
      "round-rice-noodle",
      "fish-sauce",
      "star-anise",
      "ginger",
      "yellow-onion",
      "cinnamon",
      "thai-basil",
    ];
    const r = scoreDish(pho, basket);
    expect(r.wrongPicks).toEqual(["dried-rice-noodle", "round-rice-noodle"]);
    expect(r.wrongPickPenalty).toBe(12);
    expect(r.percent).toBe(81.5);
    expect(r.medal).toBe("stamped");
  });

  test("a foreign extra (chicken alongside brisket) is dinged, not scored", () => {
    // lime swapped out for chicken: the beef slot already has its exact
    // pick, so the chicken is used by no slot and dinged 6 on top of
    // the empty garnish slot.
    const r = scoreDish(pho, swap(EXACT, "lime", "chicken"));
    expect(r.wrongPicks).toEqual(["chicken"]);
    expect(r.percent).toBe(90.8);
    expect(r.medal).toBe("silver");
  });
});
