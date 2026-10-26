import { INGREDIENT_BY_ID } from "../data/ingredients";

/** Whole portions, keyed by ingredient. Zero quantities are omitted. */
export type Quantities = Record<string, number>;

export function normalizeQuantities(value: unknown): Quantities {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, count]) =>
    Object.hasOwn(INGREDIENT_BY_ID, id) && typeof count === "number" && Number.isSafeInteger(count) && count > 0));
}

export function quantitiesFromIds(ids: unknown): Quantities {
  const result: Quantities = {};
  if (Array.isArray(ids)) for (const id of ids) {
    if (typeof id === "string" && Object.hasOwn(INGREDIENT_BY_ID, id)) result[id] = (result[id] ?? 0) + 1;
  }
  return result;
}

export function changeQuantity(quantities: Quantities, id: string, delta: number): Quantities {
  if (!Object.hasOwn(INGREDIENT_BY_ID, id) || !Number.isSafeInteger(delta)) return quantities;
  const count = Math.max(0, (quantities[id] ?? 0) + delta);
  if (!Number.isSafeInteger(count)) return quantities;
  const next = { ...quantities };
  if (count) next[id] = count;
  else delete next[id];
  return next;
}

/** Checkout only the current shop's receipt; other pending purchases stay pending. */
export function checkout(inventory: Quantities, cart: Quantities, ids?: Set<string>) {
  const nextInventory = { ...inventory };
  const nextCart = { ...cart };
  for (const [id, count] of Object.entries(cart)) {
    if (ids && !ids.has(id)) continue;
    const total = (nextInventory[id] ?? 0) + count;
    if (!Number.isSafeInteger(total)) continue;
    nextInventory[id] = total;
    delete nextCart[id];
  }
  return { inventory: nextInventory, cart: nextCart };
}

/** Validate the whole pick before spending anything. Wrong picks also consume a portion. */
export function consumePortions(inventory: Quantities, pick: string[]) {
  const ids = [...new Set(pick)];
  const missing = ids.filter((id) => !Object.hasOwn(INGREDIENT_BY_ID, id) || !(inventory[id] > 0));
  if (missing.length) return { ok: false as const, missing };
  const next = { ...inventory };
  for (const id of ids) {
    if (next[id] === 1) delete next[id];
    else next[id] -= 1;
  }
  return { ok: true as const, inventory: next };
}
