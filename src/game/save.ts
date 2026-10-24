import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medal } from "./scorer";
import type { ForecastNote, ForecastState } from "./forecast";
import { initialForecastState } from "./forecast";
import { DISH_BY_ID } from "../data/dishes";

// Three Regions: the save. One JSON blob in AsyncStorage: the week loop's
// whole state (week, phase, basket, results, savings, forecast machinery),
// so closing the app mid-week resumes where you left off.

export type Phase = "weekend" | "market" | "prep" | "trial" | "service" | "close";

export interface DayResult {
  day: string;
  percent: number;
  medal: Medal;
  earned: number;
}

/** Placeholder prices. The real economy numbers are still undecided. */
export const EARNINGS: Record<Medal, number> = {
  gold: 20,
  silver: 16,
  stamped: 12,
  fail: 4,
};

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export interface SaveState {
  week: number;
  phase: Phase;
  savings: number;
  totalStamps: number;
  /** This week's forecast notes (Weeks 1: none, 2: one gentle note). */
  notes: ForecastNote[];
  forecastState: ForecastState;
  /** This week's menu (dish ids). Saturday's basket serves all of it. */
  menuIds: string[];
  /** Saturday's basket. The week's menu is cooked from it all week. */
  basket: string[] | null;
  results: DayResult[];
  /** Best percent per dish id, across trial and service cooks. The medal
   * derives from it; it only ever moves up. */
  bestByDish: Record<string, number>;
  /** Hands-on execution of the latest cook (0..1), so a result screen
   * still scores right after a reload. */
  execution: number;
  /** Trial cooks completed this Sunday (first free, then one re-trial). */
  trialAttempts: number;
  /** Where a Sunday trial stands, so a reload resumes it exactly. */
  trialStep: "market" | "cook" | "result" | null;
}

const KEY = "three-regions-save-v1";

export function freshSave(): SaveState {
  return {
    week: 1,
    phase: "weekend",
    savings: 0,
    totalStamps: 0,
    notes: [],
    forecastState: initialForecastState(),
    // The menu starts empty. Dishes join it one at a time by passing
    // the owner's trial, never by being starters.
    menuIds: [],
    basket: null,
    results: [],
    bestByDish: {},
    execution: 1,
    trialAttempts: 0,
    trialStep: null,
  };
}

export async function loadSave(): Promise<SaveState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveState;
    // Saves from before best tracking have no bestByDish: start empty
    // rather than failing to load. Unknown ids are dropped.
    const best: Record<string, number> = {};
    if (parsed.bestByDish && typeof parsed.bestByDish === "object") {
      for (const [id, v] of Object.entries(parsed.bestByDish)) {
        if (DISH_BY_ID[id] && typeof v === "number") best[id] = v;
      }
    }
    parsed.bestByDish = best;
    // The menu is approval-only: an old save's starter menu drops every
    // dish that never passed a trial, instead of failing to load.
    const known = Array.isArray(parsed.menuIds)
      ? parsed.menuIds.filter(
          (id) => DISH_BY_ID[id] && (best[id] ?? 0) >= 80,
        )
      : [];
    parsed.menuIds = known;
    parsed.execution =
      typeof parsed.execution === "number" ? parsed.execution : 1;
    parsed.trialAttempts =
      typeof parsed.trialAttempts === "number" ? parsed.trialAttempts : 0;
    parsed.trialStep =
      parsed.trialStep === "market" ||
      parsed.trialStep === "cook" ||
      parsed.trialStep === "result"
        ? parsed.trialStep
        : null;
    return parsed;
  } catch {
    return null;
  }
}

export async function storeSave(save: SaveState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Storage full/blocked. The in-memory game continues regardless.
  }
}

export async function clearSave(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Already gone or storage blocked; the fresh save overwrites anyway.
  }
}
