import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medal } from "./scorer";
import type { ForecastNote, ForecastState } from "./forecast";
import { initialForecastState } from "./forecast";

// Three Regions — the save. One JSON blob in AsyncStorage: the week loop's
// whole state (week, phase, basket, results, savings, forecast machinery),
// so closing the app mid-week resumes where you left off.

export type Phase = "weekend" | "market" | "prep" | "service" | "close";

export interface DayResult {
  day: string;
  percent: number;
  medal: Medal;
  earned: number;
}

/** Placeholder prices — the real economy numbers are still undecided. */
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
  /** Saturday's basket — the week's phở is cooked from it all week. */
  basket: string[] | null;
  results: DayResult[];
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
    basket: null,
    results: [],
  };
}

export async function loadSave(): Promise<SaveState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SaveState) : null;
  } catch {
    return null;
  }
}

export async function storeSave(save: SaveState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Storage full/blocked — the in-memory game continues regardless.
  }
}
