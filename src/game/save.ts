import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medal } from "./scorer";
import type { ForecastNote, ForecastState } from "./forecast";
import { initialForecastState } from "./forecast";
import { DISH_BY_ID } from "../data/dishes";

// Three Regions: the save. One JSON blob in AsyncStorage: the week loop's
// whole state (week, phase, basket, pick, results, savings, forecast
// machinery), so closing the app mid-week resumes where you left off.

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
  /** This week's forecast notes (Weeks 1: none, 2: one gentle note). */
  notes: ForecastNote[];
  forecastState: ForecastState;
  /** This week's menu (dish ids). Saturday's basket serves all of it. */
  menuIds: string[];
  /** FIFO rotation order over approved dish ids. The weekly pool is
   * the first 5. Dishes join it by passing the owner's trial. */
  poolQueue: string[];
  /** Shared market basket, saved after each add/removal and cleared for
   * a new week. Each dish is picked from it; only the pick is judged. */
  basket: string[] | null;
  /** The latest cook's pick, so a result screen still scores right
   * after a reload, and repair and re-trial picks start from it. */
  pick: string[] | null;
  results: DayResult[];
  /** Best percent per dish id, across trial and service cooks. The medal
   * derives from it; it only ever moves up. */
  bestByDish: Record<string, number>;
  /** Hands-on execution of the latest cook (0..1), so a result screen
   * still scores right after a reload. */
  execution: number;
  /** Trial cooks completed this Sunday (first free, then one re-trial). */
  trialAttempts: number;
  /** Where a Sunday trial stands, so a reload resumes it exactly.
   * pick = picking (first trial or a re-trial); repair = tutorial guided
   * loop: picker, then a direct re-score. "market" is legacy: old
   * re-trial saves resume as a re-trial pick. */
  trialStep: "market" | "pick" | "cook" | "result" | "repair" | null;
  /** Serves per regular id, across all weeks. Drives the guest album
      reveal. Serve events do not exist yet (service days have no
      customers), so this starts empty and stays empty until then. */
  servesByRegular: Record<string, number>;
}

const KEY = "three-regions-save-v1";

// Rapid basket changes, phase transitions, and resets must reach storage in order.
let pendingStorage: Promise<void> = Promise.resolve();

function queueStorage(operation: () => Promise<void>): Promise<void> {
  pendingStorage = pendingStorage.then(operation).catch(() => {
    // Storage full/blocked. Keep the in-memory game running and allow later saves.
  });
  return pendingStorage;
}

export function freshSave(): SaveState {
  return {
    week: 1,
    phase: "weekend",
    savings: 0,
    notes: [],
    forecastState: initialForecastState(),
    // The menu starts empty. Dishes join it one at a time by passing
    // the owner's trial, never by being starters.
    menuIds: [],
    // The pool rotation queue starts empty; dishes join it by trial.
    poolQueue: [],
    basket: null,
    pick: null,
    results: [],
    bestByDish: {},
    execution: 1,
    trialAttempts: 0,
    trialStep: null,
    servesByRegular: {},
  };
}

export async function loadSave(): Promise<SaveState | null> {
  try {
    await pendingStorage;
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
    // The pool queue: keep known dish ids in order, drop anything else.
    // Saves from before the pool start from the menu order.
    const queue = Array.isArray(parsed.poolQueue)
      ? [
          ...new Set(
            parsed.poolQueue.filter(
              (id) => typeof id === "string" && known.includes(id),
            ),
          ),
        ]
      : known;
    parsed.poolQueue = queue;
    parsed.execution =
      typeof parsed.execution === "number" ? parsed.execution : 1;
    parsed.trialAttempts =
      typeof parsed.trialAttempts === "number" ? parsed.trialAttempts : 0;
    parsed.trialStep =
      parsed.trialStep === "market" ||
      parsed.trialStep === "pick" ||
      parsed.trialStep === "cook" ||
      parsed.trialStep === "result" ||
      parsed.trialStep === "repair"
        ? parsed.trialStep
        : null;
    parsed.pick = Array.isArray(parsed.pick) ? parsed.pick : null;
    // Stamps are a per-dish mark, not a count: drop the retired counter
    // from old saves instead of carrying it forward.
    delete (parsed as unknown as { totalStamps?: unknown }).totalStamps;
    // Serves per regular: keep numeric counts, drop anything else.
    const serves: Record<string, number> = {};
    if (parsed.servesByRegular && typeof parsed.servesByRegular === "object") {
      for (const [id, v] of Object.entries(parsed.servesByRegular)) {
        if (typeof v === "number") serves[id] = v;
      }
    }
    parsed.servesByRegular = serves;
    return parsed;
  } catch {
    return null;
  }
}

export async function storeSave(save: SaveState): Promise<void> {
  try {
    const raw = JSON.stringify(save);
    await queueStorage(() => AsyncStorage.setItem(KEY, raw));
  } catch {
    // An invalid save snapshot must not interrupt the in-memory game.
  }
}

export function clearSave(): Promise<void> {
  return queueStorage(() => AsyncStorage.removeItem(KEY));
}
