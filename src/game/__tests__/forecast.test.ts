import {
  generateForecast,
  gentleForecast,
  initialForecastState,
} from "../forecast";

// Seeded RNG so the generator's behavior is testable deterministically.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("forecast generator", () => {
  test("week 2 gets one gentle weather note", () => {
    const state = initialForecastState();
    const note = gentleForecast(state, 2, mulberry32(7));
    expect(["cold-snap", "cool-breezy", "mild-perfect"]).toContain(note.id);
    expect(note.kind).toBe("weather");
  });

  test("every Week 3+ forecast has exactly 2 notes", () => {
    const state = initialForecastState();
    const rng = mulberry32(42);
    for (let week = 3; week <= 104; week++) {
      expect(generateForecast(state, week, rng)).toHaveLength(2);
    }
  });

  test("anchors land on their calendar weeks", () => {
    const state = initialForecastState();
    const rng = mulberry32(99);
    const byWeek = new Map<number, string[]>();
    for (let week = 3; week <= 52; week++) {
      byWeek.set(week, generateForecast(state, week, rng).map((n) => n.id));
    }
    expect(byWeek.get(5)).toContain("gasparilla");
    expect(byWeek.get(7)).toContain("tet");
    expect(byWeek.get(34)).toContain("usf-first-week");
  });

  test("a weather condition never repeats except as a sticky run, then waits out its cooldown", () => {
    const state = initialForecastState();
    const rng = mulberry32(1234);
    const lastWeek = new Map<string, number>();
    for (let week = 3; week <= 156; week++) {
      for (const n of generateForecast(state, week, rng)) {
        if (n.kind !== "weather") continue;
        const last = lastWeek.get(n.id);
        if (last != null) {
          const gap = week - last;
          expect(gap === 1 || gap >= 4).toBe(true);
        }
        lastWeek.set(n.id, week);
      }
    }
  });
});
