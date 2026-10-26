import type { SaveState } from "./save";
import { consumePortions } from "./inventory";

export type CookProgress = { fill: number; finished: number | null };
export type CookAttempt = {
  dishId: string;
  kind: "trial" | "service";
  pick: string[];
  status: "cooking" | "result";
  progress: CookProgress;
};

/** A paid attempt is a persisted transaction, not a screen-entry side effect. */
export function startCook(state: SaveState, dishId: string, pick: string[], kind: CookAttempt["kind"]) {
  if (state.activeCook) return { ok: true as const, save: state };
  const consumed = consumePortions(state.inventory, pick);
  if (!consumed.ok) return consumed;
  const uniquePick = [...new Set(pick)];
  const next: SaveState = {
    ...state,
    inventory: consumed.inventory,
    pick: uniquePick,
    execution: 1,
    phase: kind === "trial" ? "trial" : "service",
    trialStep: kind === "trial" ? "cook" : null,
    activeCook: { dishId, kind, pick: uniquePick, status: "cooking", progress: { fill: 0, finished: null } },
  };
  return { ok: true as const, save: next };
}

/** Duplicate Serve events cannot finish or count an attempt twice. */
export function finishCook(state: SaveState, execution: number): SaveState {
  if (!state.activeCook || state.activeCook.status !== "cooking") return state;
  return {
    ...state,
    execution,
    activeCook: { ...state.activeCook, status: "result" },
    trialStep: state.activeCook.kind === "trial" ? "result" : null,
    trialAttempts: state.trialAttempts + (state.activeCook.kind === "trial" ? 1 : 0),
  };
}

/** Tutorial guidance revises the same dish; it is not another paid cook. */
export function repairPick(state: SaveState, pick: string[]): SaveState {
  if (state.phase !== "trial" || state.trialStep !== "repair") return state;
  return { ...state, pick: [...new Set(pick)], trialStep: "result" };
}

/** All unused portions and pending purchases spoil at the weekly boundary. */
export function spoilStock(state: SaveState): SaveState {
  return { ...state, inventory: {}, cart: {}, activeCook: null, pick: null };
}
