// Three Regions — the forecast generator (approved design, 2026-10-23).
//
// Forecasts are assembled from fragments, never pre-authored whole:
//   note = condition x phrasing x implication, tagged by craving/crowd.
// Pools draw as bags (no replacement until the pool empties) with
// cooldowns; weather comes from Tampa climate tables weighted by month
// and is sticky for 1-3 weeks (fresh phrasing each week); anchor events
// are pinned to calendar weeks and return every year. The full pick-2
// system runs from Week 3; Week 2 gets one gentle weather note.

export type NoteKind = "weather" | "event" | "season";

export interface ForecastNote {
  kind: NoteKind;
  id: string;
  text: string;
}

interface WeatherCondition {
  id: string;
  /** Weight per month, index 0 = January. 0 = never that month. */
  months: number[];
  phrases: string[];
  implications: string[];
}

const WEATHER: WeatherCondition[] = [
  {
    id: "cold-snap",
    months: [3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3],
    phrases: [
      "A cold snap is rolling through Tampa this week.",
      "Cold mornings and colder nights this week.",
      "A real chill has settled over the city this week.",
    ],
    implications: [
      "Most people will want soup and broth to warm up.",
      "Folks will be craving a bowl of something hot and brothy.",
      "Warm, steaming bowls will beat everything else on the menu.",
    ],
  },
  {
    id: "cool-breezy",
    months: [2, 3, 3, 2, 0, 0, 0, 0, 0, 1, 2, 2],
    phrases: [
      "Cool and breezy all week — jacket weather, finally.",
      "Dry, cool air this week, the kind Tampa waits all year for.",
      "Crisp mornings, easy afternoons this week.",
    ],
    implications: [
      "Good grilling weather — people will want something with char on it.",
      "Hearty plates will travel well this week.",
      "People eat like they mean it in weather like this.",
    ],
  },
  {
    id: "mild-perfect",
    months: [2, 2, 3, 3, 1, 0, 0, 0, 0, 1, 3, 2],
    phrases: [
      "Perfect weather this week — low seventies, blue skies.",
      "One of those weeks Tampa brags about — mild and bright.",
      "Windows-open weather all week long.",
    ],
    implications: [
      "Light, fresh dishes will sound good to everybody.",
      "People will linger — nobody's rushing home in this.",
      "Herby, fresh flavors are the week's mood.",
    ],
  },
  {
    id: "warm-humid",
    months: [0, 0, 1, 2, 3, 3, 3, 3, 3, 2, 1, 0],
    phrases: [
      "Warm and humid this week — the air feels like soup already.",
      "The humidity's back this week, heavy by noon.",
      "Sticky, swampy weather settling in this week.",
    ],
    implications: [
      "Cold and fresh will win — nobody wants a heavy bowl in this.",
      "People will reach for crisp, cool, herby things.",
      "Light dishes and cold drinks, that's the week.",
    ],
  },
  {
    id: "rainy-week",
    months: [0, 0, 0, 1, 2, 3, 3, 3, 3, 2, 0, 0],
    phrases: [
      "Rain, rain, and more rain this week.",
      "It's going to pour most of the week.",
      "Grey skies and wet streets all week.",
    ],
    implications: [
      "Soup weather, plain and simple — broth is what they'll want.",
      "Wet people want warm bowls; count on it.",
      "Comfort food carries a rainy week.",
    ],
  },
  {
    id: "afternoon-storms",
    months: [0, 0, 0, 0, 2, 3, 3, 3, 3, 1, 0, 0],
    phrases: [
      "Afternoon storms every day this week, right on schedule.",
      "The daily 4 p.m. thunderstorm is back this week.",
      "Mornings fine, afternoons electric this week.",
    ],
    implications: [
      "People will come in early to beat the storms — and want broth when they do.",
      "Lunch will be the rush; dinner depends on the sky.",
      "Hot bowls before the thunder — that's the pattern.",
    ],
  },
  {
    id: "heat-wave",
    months: [0, 0, 0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
    phrases: [
      "A heat wave this week — triple digits if the breeze quits.",
      "Dangerous hot this week, even for Tampa.",
      "The kind of heat that empties the sidewalks by two.",
    ],
    implications: [
      "Cold, fresh, and light — anything heavy will sit.",
      "Iced and crisp beats hot and heavy this week.",
      "People will eat like birds and drink like fish.",
    ],
  },
  {
    id: "dry-stretch",
    months: [1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 3, 1],
    phrases: [
      "A long dry stretch this week — not a cloud worth naming.",
      "Dry and dusty this week; the rain barrels are empty.",
      "No rain in sight this week, just sun.",
    ],
    implications: [
      "Grilled smoke smells like dinner in dry weather — lean into it.",
      "Outdoor appetites: char and crunch will move.",
      "People will be out and hungry in the evenings.",
    ],
  },
  {
    id: "storm-scare",
    months: [0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0],
    phrases: [
      "There's a storm brewing out in the Gulf this week.",
      "The weather radio won't shut up this week — something's forming offshore.",
      "A named storm is wandering the Gulf this week.",
    ],
    implications: [
      "People stock up and eat early in case it turns — then it gets quiet.",
      "Big, keeping dishes are what a nervous week wants.",
      "Expect a rush before it lands and a ghost town if it does.",
    ],
  },
];

const WEATHER_BY_ID: Record<string, WeatherCondition> = Object.fromEntries(
  WEATHER.map((w) => [w.id, w]),
);

/** Week-2's gentle subset — nothing scary in the tutorial. */
const GENTLE_IDS = ["cold-snap", "cool-breezy", "mild-perfect"];

interface Anchor {
  week: number; // week of year, 1-52
  id: string;
  kind: NoteKind;
  text: string;
}

const ANCHORS: Anchor[] = [
  {
    week: 5,
    id: "gasparilla",
    kind: "event",
    text: "Gasparilla weekend — pirate flotilla, parades, half of Tampa downtown in costume. Expect tourists and big, hungry crowds.",
  },
  {
    week: 6,
    id: "state-fair",
    kind: "event",
    text: "The Florida State Fair is on across town — families everywhere, and fair food competing for their appetites.",
  },
  {
    week: 7,
    id: "tet",
    kind: "event",
    text: "Tết week — Tampa's Vietnamese families are celebrating the new year. Homesick hearts and big family orders; this is your community's week.",
  },
  {
    week: 9,
    id: "spring-training",
    kind: "event",
    text: "Spring training is on — baseball fans wintering in the sun, eating out after day games.",
  },
  {
    week: 11,
    id: "spring-break",
    kind: "event",
    text: "Spring break — college kids and beach traffic all week.",
  },
  {
    week: 13,
    id: "snowbirds-leave",
    kind: "season",
    text: "The snowbirds are heading home — the dining room's about to get quieter for a while.",
  },
  {
    week: 19,
    id: "riverfest",
    kind: "event",
    text: "Riverfest downtown — the riverwalk will be packed all weekend.",
  },
  {
    week: 21,
    id: "rainy-season-start",
    kind: "season",
    text: "The rainy season is settling in — afternoon storms are about to become a daily thing.",
  },
  {
    week: 34,
    id: "usf-first-week",
    kind: "event",
    text: "First week of school — the place will be crowded with USF college kids.",
  },
  {
    week: 44,
    id: "snowbirds-return",
    kind: "season",
    text: "The snowbirds are back — northern plates on every car, early dinners, a full dining room by six.",
  },
  {
    week: 47,
    id: "thanksgiving",
    kind: "event",
    text: "Thanksgiving week — families in town, group dinners, and a quiet Friday while everyone recovers.",
  },
];

interface GenericEvent {
  id: string;
  text: string;
  /** Weeks of year it can fall in; undefined = any week. */
  weeks?: (weekOfYear: number) => boolean;
}

const GENERIC_EVENTS: GenericEvent[] = [
  {
    id: "food-festival",
    text: "There's a food festival downtown this weekend — curious eaters will be out hunting for something new.",
  },
  {
    id: "convention",
    text: "A big convention's in town — hotel crowds looking for dinner near the riverwalk.",
  },
  {
    id: "marathon",
    text: "Marathon Sunday — runners and their families, hungry early.",
  },
  {
    id: "beach-weekend",
    text: "A perfect beach weekend coming — half the city heads for the coast, and the other half eats out.",
  },
  {
    id: "farmers-market",
    text: "The farmers market's expanding this weekend — fresh everything, and people in a cooking mood.",
  },
  {
    id: "bucs-game",
    text: "Bucs home game Sunday — jerseys everywhere, groups eating before and after.",
    weeks: (w) => w >= 36 || w <= 4,
  },
  {
    id: "lightning-run",
    text: "The Lightning are on a run — game nights are busy nights downtown.",
    weeks: (w) => w >= 40 || w <= 24,
  },
  {
    id: "art-walk",
    text: "Art walk in Ybor this weekend — a younger, wandering crowd.",
  },
  {
    id: "wedding-season",
    text: "Wedding season — rehearsal dinners and out-of-town guests all week.",
    weeks: (w) => (w >= 9 && w <= 20) || (w >= 40 && w <= 47),
  },
  {
    id: "fishing-tournament",
    text: "A fishing tournament's in the bay — early risers, and seafood on everyone's mind.",
  },
];

export interface ForecastState {
  weatherDeck: string[];
  eventDeck: string[];
  lastConditionWeek: Record<string, number>;
  /** Recent phrase+implication combos per condition ("p:i"), newest last. */
  lastCombos: Record<string, string[]>;
  lastEventWeek: Record<string, number>;
  stickyId: string | null;
  stickyLeft: number;
}

export function initialForecastState(): ForecastState {
  return {
    weatherDeck: [],
    eventDeck: [],
    lastConditionWeek: {},
    lastCombos: {},
    lastEventWeek: {},
    stickyId: null,
    stickyLeft: 0,
  };
}

export type Rng = () => number;

function shuffled<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function monthOfWeek(weekOfYear: number): number {
  return Math.min(12, Math.floor(((weekOfYear - 1) * 12) / 52) + 1);
}

function composeWeatherNote(
  state: ForecastState,
  conditionId: string,
  absWeek: number,
  rng: Rng,
): ForecastNote {
  const cond = WEATHER_BY_ID[conditionId];
  const history = state.lastCombos[conditionId] ?? [];
  // Pick a phrase+implication combo this condition hasn't worn recently —
  // a sticky pattern can hold for 3 weeks without ever repeating its text.
  let pIdx = 0;
  let iIdx = 0;
  for (let tries = 0; tries < 12; tries++) {
    pIdx = Math.floor(rng() * cond.phrases.length);
    iIdx = Math.floor(rng() * cond.implications.length);
    if (!history.includes(`${pIdx}:${iIdx}`)) break;
  }
  state.lastCombos[conditionId] = [...history, `${pIdx}:${iIdx}`].slice(-3);
  state.lastConditionWeek[conditionId] = absWeek;
  return {
    kind: "weather",
    id: conditionId,
    text: `${cond.phrases[pIdx]} ${cond.implications[iIdx]}`,
  };
}

function refillWeatherDeck(state: ForecastState, month: number, rng: Rng) {
  const deck: string[] = [];
  for (const cond of WEATHER) {
    const w = cond.months[month - 1];
    for (let i = 0; i < w; i++) deck.push(cond.id);
  }
  state.weatherDeck = shuffled(deck, rng);
}

const CONDITION_COOLDOWN = 4; // weeks before a condition can return (stickiness aside)
const EVENT_COOLDOWN = 8;

function drawWeatherCondition(
  state: ForecastState,
  absWeek: number,
  month: number,
  rng: Rng,
  excludeId?: string,
): string | null {
  // Stickiness: last week's pattern often holds, wearing fresh phrasing.
  if (
    state.stickyId != null &&
    state.stickyId !== excludeId &&
    state.stickyLeft > 0 &&
    WEATHER_BY_ID[state.stickyId].months[month - 1] > 0 &&
    rng() < 0.6
  ) {
    state.stickyLeft -= 1;
    return state.stickyId;
  }
  let guard = 0;
  while (guard++ < 300) {
    if (state.weatherDeck.length === 0) refillWeatherDeck(state, month, rng);
    const id = state.weatherDeck.pop()!;
    if (id === excludeId) continue; // never the same condition twice in a week
    const cond = WEATHER_BY_ID[id];
    if (cond.months[month - 1] === 0) continue; // out of season — discard
    const last = state.lastConditionWeek[id];
    if (last != null && absWeek - last < CONDITION_COOLDOWN) continue; // cooling down
    // New pattern: it may stick around for 1-2 more weeks.
    state.stickyId = id;
    state.stickyLeft = rng() < 0.5 ? (rng() < 0.5 ? 2 : 1) : 0;
    return id;
  }
  return null;
}

function drawGenericEvent(
  state: ForecastState,
  absWeek: number,
  weekOfYear: number,
  rng: Rng,
): ForecastNote | null {
  let guard = 0;
  while (guard++ < 100) {
    if (state.eventDeck.length === 0) {
      state.eventDeck = shuffled(GENERIC_EVENTS.map((e) => e.id), rng);
    }
    const id = state.eventDeck.pop()!;
    const ev = GENERIC_EVENTS.find((e) => e.id === id)!;
    if (ev.weeks && !ev.weeks(weekOfYear)) continue;
    const last = state.lastEventWeek[id];
    if (last != null && absWeek - last < EVENT_COOLDOWN) continue;
    state.lastEventWeek[id] = absWeek;
    return { kind: "event", id, text: ev.text };
  }
  return null;
}

/** Week 2: one gentle weather note, owner-read. Doesn't touch stickiness. */
export function gentleForecast(state: ForecastState, absWeek: number, rng: Rng): ForecastNote {
  const s: ForecastState = {
    ...state,
    weatherDeck: [...state.weatherDeck],
    lastCombos: Object.fromEntries(
      Object.entries(state.lastCombos).map(([k, v]) => [k, [...v]]),
    ),
    lastConditionWeek: { ...state.lastConditionWeek },
  };
  const id = GENTLE_IDS[Math.floor(rng() * GENTLE_IDS.length)];
  const note = composeWeatherNote(s, id, absWeek, rng);
  Object.assign(state, s);
  return note;
}

/**
 * The full pick-2 forecast (Week 3+). Mutates and returns `state` so the
 * caller can persist it inside the save.
 */
export function generateForecast(
  state: ForecastState,
  absWeek: number,
  rng: Rng = Math.random,
): ForecastNote[] {
  const weekOfYear = ((absWeek - 1) % 52) + 1;
  const month = monthOfWeek(weekOfYear);
  const notes: ForecastNote[] = [];

  const anchor = ANCHORS.find((a) => a.week === weekOfYear);
  if (anchor) notes.push({ kind: anchor.kind, id: anchor.id, text: anchor.text });

  // With no anchor, a generic event often takes one of the two slots.
  if (!anchor && notes.length < 2 && rng() < 0.55) {
    const ev = drawGenericEvent(state, absWeek, weekOfYear, rng);
    if (ev) notes.push(ev);
  }
  if (notes.length < 2) {
    const condId = drawWeatherCondition(state, absWeek, month, rng);
    if (condId) notes.push(composeWeatherNote(state, condId, absWeek, rng));
  }
  if (notes.length < 2) {
    // Fallback: whatever's left — another event, or a second weather draw
    // (never the same condition twice in one week).
    const ev = anchor ? null : drawGenericEvent(state, absWeek, weekOfYear, rng);
    if (ev) notes.push(ev);
    else {
      const usedWeather = notes.find((n) => n.kind === "weather")?.id;
      const condId = drawWeatherCondition(state, absWeek, month, rng, usedWeather);
      if (condId) notes.push(composeWeatherNote(state, condId, absWeek, rng));
    }
  }
  return notes.slice(0, 2);
}
