import { changeQuantity, checkout, consumePortions, normalizeQuantities, quantitiesFromIds } from "../inventory";
import { finishCook, repairPick, spoilStock, startCook } from "../cooking";
import { freshSave } from "../save";

jest.mock("@react-native-async-storage/async-storage", () => ({ __esModule: true, default: {} }));

function paidCook(kind: "trial" | "service" = "service") {
  const initial = { ...freshSave(), inventory: { chicken: 3, "jasmine-rice": 2, "fish-sauce": 4 } };
  const started = startCook(initial, "pho-bo", ["chicken", "jasmine-rice", "fish-sauce"], kind);
  if (!started.ok) throw new Error("Expected sufficient stock");
  return started.save;
}

test("counter taps add whole portions to a receipt; minus never creates negative quantities", () => {
  let cart = changeQuantity({}, "chicken", 1);
  cart = changeQuantity(cart, "chicken", 1);
  cart = changeQuantity(cart, "chicken", 1);
  expect(cart).toEqual({ chicken: 3 });
  expect(changeQuantity(cart, "chicken", -1)).toEqual({ chicken: 2 });
  expect(changeQuantity({ chicken: 1 }, "chicken", -1)).toEqual({});
  expect(changeQuantity({}, "chicken", -1)).toEqual({});
  expect(changeQuantity(cart, "chicken", 0.5)).toBe(cart);
});

test("checkout transfers the visible receipt once and leaves other shops' pending purchases untouched", () => {
  const stock = { chicken: 1, shrimp: 2 };
  const cart = { chicken: 3, shrimp: 4 };
  const bought = checkout(stock, cart, new Set(["chicken"]));
  expect(bought).toEqual({ inventory: { chicken: 4, shrimp: 2 }, cart: { shrimp: 4 } });
  expect(checkout(bought.inventory, bought.cart, new Set(["chicken"]))).toEqual(bought);
  expect(stock).toEqual({ chicken: 1, shrimp: 2 });
  expect(cart).toEqual({ chicken: 3, shrimp: 4 });
});

test("premium and regular fish sauce have independent quantities", () => {
  expect(consumePortions({ "fish-sauce": 3, "regular-fish-sauce": 2 }, ["fish-sauce"]))
    .toEqual({ ok: true, inventory: { "fish-sauce": 2, "regular-fish-sauce": 2 } });
});

test("cooking uses one portion per selected ingredient, including wrong picks, and leaves unselected stock", () => {
  const result = consumePortions({ chicken: 3, shrimp: 2, "jasmine-rice": 2 }, ["chicken", "chicken", "shrimp"]);
  expect(result).toEqual({ ok: true, inventory: { chicken: 2, shrimp: 1, "jasmine-rice": 2 } });
  expect(consumePortions({ chicken: 1 }, ["chicken"])).toEqual({ ok: true, inventory: {} });
});

test("an unavailable pick fails atomically without spending other ingredients", () => {
  const inventory = { chicken: 2 };
  expect(consumePortions(inventory, ["chicken", "shrimp"])).toEqual({ ok: false, missing: ["shrimp"] });
  expect(inventory).toEqual({ chicken: 2 });
});

test.each(["trial", "service"] as const)("Cook pays once and Serve cannot charge or finish the %s attempt twice", (kind) => {
  const cooking = paidCook(kind);
  expect(cooking.inventory).toEqual({ chicken: 2, "jasmine-rice": 1, "fish-sauce": 3 });
  expect(cooking.activeCook?.status).toBe("cooking");
  expect(startCook(cooking, "pho-bo", cooking.pick!, kind)).toEqual({ ok: true, save: cooking });
  const result = finishCook(cooking, 0.8);
  expect(result.inventory).toEqual(cooking.inventory);
  expect(result.execution).toBe(0.8);
  expect(result.activeCook?.status).toBe("result");
  expect(result.trialAttempts).toBe(kind === "trial" ? 1 : 0);
  expect(finishCook(result, 1)).toBe(result);
  expect(startCook(result, "pho-bo", result.pick!, kind)).toEqual({ ok: true, save: result });
});

test("a newly cooked retry costs another portion while correcting a completed attempt does not", () => {
  const result = finishCook(paidCook("trial"), 1);
  const guidance = repairPick({ ...result, trialStep: "repair" }, ["chicken"]);
  expect(guidance.inventory).toEqual(result.inventory);
  expect(guidance.pick).toEqual(["chicken"]);
  expect(guidance.trialAttempts).toBe(1);
  const retry = startCook({ ...result, activeCook: null, trialStep: "pick" }, "pho-bo", ["chicken"], "trial");
  expect(retry.ok && retry.save.inventory.chicken).toBe(1);
});

test("the weekly boundary spoils stock and pending purchases and clears the paid attempt", () => {
  const next = spoilStock({ ...paidCook(), cart: { shrimp: 5 }, savings: 30 });
  expect(next.inventory).toEqual({});
  expect(next.cart).toEqual({});
  expect(next.activeCook).toBeNull();
  expect(next.pick).toBeNull();
  expect(next.savings).toBe(30);
});

test("only known ingredients and safe positive whole portions survive normalization", () => {
  expect(normalizeQuantities({ chicken: 3, shrimp: 0, eggs: -1, tofu: 2.5, ham: "2", unknown: 4, butter: Infinity }))
    .toEqual({ chicken: 3 });
  expect(quantitiesFromIds(["chicken", "shrimp", "not-an-ingredient"])).toEqual({ chicken: 1, shrimp: 1 });
});
