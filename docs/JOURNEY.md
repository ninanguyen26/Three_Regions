# Vietnamese Restaurant Game — JOURNEY

The discussion record: how the design got here, what's still **proposal** (Muse's suggestions, not locked), what was dropped or parked, and what's still open. The decided list lives in `APPROVED.md`.

Status: **build started 2026-10-23** — scaffolded at `~/Documents/Projs/Three_Regions` (see APPROVED.md).

---

## How it started

- **2026-10-20:** Ngoc floated a cozy game traveling the world learning the best cuisines — like Cozy Kitchen: Hidden Tales, "but less crazy and realer recipes." Ground rules from day one: hands-on cooking with a limited ingredient set per dish; a shopping puzzle (clue → market → pick the right ingredients among lookalikes); stamp at 80% / silver 90% / gold 95%; each stamped dish earns a stamp + image + history/fun fact; collection shown as silhouettes + `???` until earned.
- **2026-10-23:** the pivot — Vietnamese food only, the player hired by a Vietnamese immigrant restaurant owner in America. The broad travel hook was traded for specificity (Venba cited as precedent). Everything in APPROVED.md came out of that day and the days around it.

## Ideas that were replaced on the way

- **Ending v1:** she hands you the original restaurant, or backs you to open a second location; final exam = pick 6 signature dishes for the new menu book. → Replaced the same day by **the buyout** (player buys the restaurant with saved cash; savings = the visible long-term goal).
- **Forecast v1:** per-customer — predict which regulars come on which days from traits (85% show-up chance, weather patterns per guest) and take reservation notes in their own wording. → **Dropped by Ngoc** ("per-customer predictions dropped"): the forecast is group-level (season / weather / events + market notes) and the player plans the week's menu from it. The guest album's job became service, not prediction.
- **Reservation-note NLP:** extracting structured notes from free-text reservations. → Dropped with forecast v1. NLP's guest-facing job is now live cravings only.
- **A deceased husband** (ghost-recipe channel) was considered by Muse and argued against — Bà Lệ already carries the widow beat; a ghost channel would compete with the sister. Ngoc went with the living husband.
- **Kitchen photos as "her mother's notebook":** an early storyboard draft had the sister produce their mother's handwritten recipe notebook to resolve the Central chapter. → Killed by Ngoc's no-fictional-props rule (he can't photograph a fictional artifact). Contradictions now resolve via real dish photos and people remembering.
- **Photo supply, first version:** Muse wrote a "shot list" of photos for Ngoc to go take. → **Reversed by Ngoc** to catalog-first (same rule as the plant game's database: "no sprites, no entry" → "no photo, no photo-beat"). Then tightened twice more: found-not-staged, and the teaching-vs-life food rule.
- **One-pick-per-slot market (the slice's first build):** tapping an ingredient replaced your previous pick for its slot. → **Replaced by Ngoc the same night (2026-10-23)** with the free basket: cap = the dish's ingredient count, pick anything (all three noodles if you want), the scorer takes each slot's best match, and every unused pick is dinged (settled at −6 after Ngoc called the first pass, −3, too generous the same night). Implemented and verified the same night (scorer v2, 9/9 cases); the rule lives in APPROVED.md.
- **Forecast as a three-factor card (Muse's phrasing in the week-loop spec):** season + weather + event all listed at once. → **Corrected by Ngoc (2026-10-23):** each week picks **2 of the 3** and writes them as short text notes with the implication attached (rainy + cold → people want soup and broth; first week of school → crowded with USF kids). The rule lives in APPROVED.md.

## Proposals on the table (not locked)

### Scoring internals
- Precomputed per-ingredient similarity (exact 1.0, close cousin 0.85–0.95, distant 0.5–0.7, missing 0) — never runtime raw text embeddings: offline, deterministic, explainable. Weighted signature > support > garnish. Hands-on execution as a small deduction (exact + sloppy ≈ 92; exact + clean ≈ 98–100). Below 80, feedback is a single biggest-miss line.
- Scorer acceptance cases to test before any UI: exact = 100; one 0.93 sub still gold-able; signature miss capped; garnish miss ≈ 95–97; two close subs = silver.

### Service flow numbers
- ~3 hands-on regular services/day (full cook + score + story) + a walk-in covers number (base by weekday, moved by forecast and menu fit) served off the planned menu and Sunday prep, paying list price, counting only in the sold-vs-waste score. Exact covers/day is a tuning number — Ngoc said "idk how many per day."
- Prep/pantry, simplified: dry = forever, fresh = 2 days, stocks/sauces ~4–5 days; state is have/low only.
- Forecast fairness: effects shown as explicit modifiers, never hidden RNG.
- Menu size 4–6 active dishes; Week-1 graduation gate = 3 of 4 starters stamped; chapter "mastered" = stamped 80%+ (incl. the finale gate — all-Gold would be a grind wall); tutorial weeks ~20–25 min each.

### Forecast generation (APPROVED by Ngoc, 2026-10-23 — decided form in APPROVED.md)
Ngoc's problem (2026-10-23): the game is infinite, forecasts can't all be pre-authored, and they must not visibly repeat. Muse's proposal — don't author forecasts; author pieces and assemble:
- **Composed notes:** a note = condition × phrasing variant × implication clause, hanging off tags (craving: broth / grilled / cold-fresh…; crowd: students / families / tourists…). ~12 weather conditions × 4 phrasings × 3 implications ≈ 144 distinct weather notes from ~60 fragments.
- **A real calendar underneath:** season comes from the week-of-year; anchor events are pinned to dates (Tết, Gasparilla late Jan, USF first week late Aug, spring break, Thanksgiving) and return yearly by design — tradition, not repetition. Optional garnish: year-2+ variant lines for anchors ("Gasparilla again — last year the flotilla crowd wiped you out by Thursday").
- **Weather from Tampa climate tables:** weighted by month (rainy-season afternoons Jun–Sep, cold snaps Dec–Feb, hurricane-season scares) and sticky — a pattern holds 1–3 weeks, like real weather.
- **Bags + cooldown, not dice:** naive random drawing from a 40-note pool expects a repeat within ~8 weeks (birthday math). Instead each pool draws **without replacement** until it empties, and nothing drawn in the last ~10 weeks is eligible — a single note can't resurface for most of a game-year, and an exact week's pair effectively never repeats.
- **Authoring bill:** ~90–100 fragments total (≈12 anchors + ~30 generic events + the weather/season sets) — about one region's clue sets. **Ruled out:** runtime AI text generation (offline-first; the voice would drift).
- **Decided inside this proposal (Ngoc, 2026-10-23):** the calendar starts in **early January** and the full pick-2 system switches on at **Week 3**. Ngoc then approved the whole proposal the same night — the decided form lives in APPROVED.md.

### Verbs — detail level
- The list itself is provisionally locked (APPROVED.md). Still proposal: per-verb mini-game specifics (Chop = evenness/rhythm, Pound = rhythm + stop-at-texture, Toss/Sear share a circular engine, Pour = amount/steadiness, Wrap = fold sequence/tightness, Simmer = per-dish cue window) and the unlock order (Wk1 Pour/Wrap/Chop + Taste, Wk2 Toss/Pound, Wk3+ Sear/Simmer; new verb = pause-and-learn first 2 uses).
- **Verb imbalance flagged:** Simmer 7, Sear 7, Pour 5, Chop 3, Toss 2, Wrap 2, Pound 1. Options: reassign some primaries, use scored secondaries more widely, or accept it (dishes within a verb differ by cue).

### The regulars (16, all proposal — placeholder names)
Written in full at Ngoc's instruction; **none individually approved.** Ông Hiển (Hanoian judge, North) · Bà Lệ (oldest customer, canh chua Fridays, emotional core) · Cô Hạnh (Huế vegetarian, chay-day variant quests) · Anh Tư (shrimper, the supply/forecast face) · Rosa (Cuban baker next door, Ybor) · Danny (broke USF student, slang craving voice) · Miss Pat (snowbird, the human season) · Bé Na + mom (picky kid) · Marcus (mail carrier, gossip = forecast with a face) · Trâm (Saigon student — she is also a texting contact) · The reviewer (event regular) · Grace (Filipino nurse, sinigang↔canh chua) · The retired rival chef (late-game teacher) · Anh Dũng (Quảng Ngãi construction worker) · Linh (catering coordinator, economy spikes) · The food-truck couple (where the parked Viet-Am dishes would live — *their* menu, mentored by the player).
- Also proposal: the daughter carries the diaspora arc (specificity lives in the cast, not the player).

### Quests (templates — pick a subset for V1)
Anti-grind rule is locked (APPROVED.md); the templates are not: variant cook · rescue the pot · scraps-to-stock · two cooks two versions · stall/service shift · festival/menu build · teach-back · market errand/barter chain · go to the source (as postcard/photo) · secret off-menu dish. Rewards are anti-grind tools (reveal a lookalike pair, a retry hint, a new tool/verb, album notes), not grind currency.

### NLP — internals
- Craving Profile: flavor axes (clear/rich/sour/herby/heat) + hard constraints + region/memory anchor; max 2 clarifying chip asks; the player's dish choice *is* the answer; album traits calibrate parsing per guest.
- Reconstruction flow: contact opens with a vague memory → player asks (chips first; free text proposed as a later unlock) → NLP matches the question to the contact's authored Q&A bank → each answer fills one fragment on a pinned card (~6 fragments; ~5 asks per contact proposed) → player sends a dish card as the guess (deterministic trait-overlap scoring) → the contact's photo sharpens blurry→clear as the card completes → finish by Friday close to unlock the dish for next week.
- Feedback prose: template slot-filled from the scorer's actual breakdown — not LLM-generated.
- Stack: no cloud LLM. Tier 1 = `compromise` + authored flavor lexicon + all-MiniLM-L6-v2 embeddings **precomputed at authoring time**, shipped as JSON, runtime cosine in TypeScript. Tier 2 (only if free text) = onnxruntime-react-native + quantized MiniLM (~23MB). Content cost ≈40 short texts for 8 regulars.
- Storyboard drafts for every texting contact were drafted in chat on 2026-10-23 (sister / owner / Trâm / market auntie / former cook / daughter, husband via daughter) — drafts, not yet written into any doc as canon.

### Graphics budget (proposal numbers)
~3 backgrounds (kitchen counter, grocery aisle, dining counter) · ~70 ingredient icons (the main art spend, reused everywhere) · 6–8 tools/vessels · dish images **composed from layers** (bowl + broth color + noodle/rice + protein + garnish) showing the player's actual picks · juice from Skia particles + sound + stamp slam · cut for V1: staff scheduling, seating puzzles, dishwashing, detailed finances.

### Build order (proposal) & timeline (estimate only)
Schema → scorer as pure function (paper cases first) → phở end-to-end ugly → week loop shell + tutorial dishes → prep/pantry → regulars + 1 quest template (variant suggested first) → live-craving NLP → upgrades → content scale to 28 region by region → texting threads → teach-back + buyout finale + infinite post-game → polish last. Hard rule: nothing new until the previous step plays end-to-end on device.
- **Progress (2026-10-23):** scaffold done — project created at `~/Documents/Projs/Three_Regions` on the Green_Thumb stack; schema (`src/data/types.ts`), phở bò record (10 slots, 28-ingredient market shelf), scorer (`src/game/scorer.ts`), and the paper cases as jest tests are in. Scorer math verified on all 7 cases before landing (exact 100 · 0.93 sub → 98.6 gold · signature miss capped 79 vs raw 80.6 · garnish miss 96.8 · two subs 94.8 silver). **Phase 1 complete (2026-10-23):** the app builds and boots on Ngoc's iPhone — the home screen runs the scorer live ("a perfect Phở Bò = 100% (gold)"), screenshot-verified. **The phở slice was built the same night** (`src/screens/`: Home → Market → Cook/Pour → Result, App.tsx as the step machine; Pour is a hold-and-release placeholder whose stop point feeds execution). Device-verified by Ngoc's screenshots the same night. **Forecast generator + week-loop shell built later that night** — the generator implements the design Ngoc approved; the shell was built by Muse without an explicit go-ahead (overreach, flagged by Ngoc the same night), and his call was to leave it in place while he reviews it — not yet accepted. App is now the persisted week loop — weekend forecast → Saturday market → Sunday prep stub → Mon–Fri service (each day cooks from Saturday's basket; only the pour varies) → Friday close (stamps, placeholder earnings gold $20/silver $16/stamped $12/fail $4, savings) → next week; whole state in AsyncStorage (`src/game/save.ts`), resumes mid-week. `src/game/forecast.ts` implements the approved generator at starter scale (11 calendar anchors incl. Gasparilla wk5 / Tết wk7 / USF wk34, 9 Tampa weather conditions with month tables, 10 generic events, bags + 4-wk condition / 8-wk event cooldowns, stickiness with combo-history so sticky text never repeats); verified by a 3-year VM simulation (154 weeks × exactly 2 notes, anchors on schedule, min text-repeat gap 7 weeks, 96 distinct texts) + seeded jest suite; scorer still 9/9. On the Mac it needs `npx expo install @react-native-async-storage/async-storage` + a dev-client rebuild (native dep); device verdict pending.
- Estimate (made at a 24-dish roster): ~280–360 hands-on hours; 19–24 weeks at ~15 hrs/wk, 11–14 at ~25 hrs/wk. Roster growth to 28 likely adds ~1 week to content. Fastest cuts: 28→20 dishes (~−2 wks), prep to stocks-only (~−1 wk), drop upgrades (~−1 wk). Biggest risks: scorer tuning loops, composed-layer alignment, research accuracy.

## Parked

- **The Vietnamese-American chapter** (parked by Ngoc, "hold off for now"): Viet-Cajun crawfish, garlic noodles, brisket phở, bánh mì po'boy, bò lúc lắc. Proposal on record: they resurface as the food-truck couple's menu (cooked by them, mentored by the player).
- **Central reserves:** bánh bột lọc (Wrap), bún mắm nêm (Toss) — proposed, not picked; Central has no Wrap dish and no pungent-signature dish without them.

## Still open (Ngoc's calls, undecided)

- **Tết** — Ngoc: "not sure what to do with Tet yet." Options: (a) annual event week in endless mode, (b) final chapter timed to a last Tết before the owners depart, (c) both. Assets in place: thịt kho (anchor dish), Bà Lệ (anchor character, proposal cast), and — discovered via the photo catalog — **Gasparilla (late Jan) collides with Tết season**, giving the calendar a two-festival week.
- **The economy:** buyout price, dish prices, weekly earnings, upgrade costs — never set; they derive from run length, which derives from the (decided) progression + finale gates but hasn't been computed.
- **Names:** all cast names are placeholders; the owners and the restaurant's in-fiction name are unnamed. The husband's regional origin was never specified. **Title: decided — *Three Regions*** (Ngoc 2026-10-23). He *liked* "Ba Miền" but rejected it: hard for his main (American) audience to remember/search, and it collides with a Vietnamese instant-noodle brand of the same name. The long form survives in-fiction as the restaurant's founding idea — the finale beat where the owner explains "One Kitchen, Three Regions" (recorded in APPROVED.md).
- **The final content stretch** before the finale (finale itself is decided). Raw material: the parked Viet-Am dishes + the Central reserves.
- **Chapter play order:** roster lists North first, but the owner teaches South (her own food) most naturally — roster order vs play order needs one pass.
- **Free text vs chips-first** for player questions at launch.
- **Prep-heavy vs Serve-heavy** final weighting.
- **Monetization** — never discussed (premium upfront, like Glean, is only a guess by analogy).
- **Post-game texting cadence/format** — direction decided (APPROVED.md), specifics TBD.

## Photos — where the catalog stands

28 photos cataloged in `PHOTO_CATALOG.md` (Sister 7 · Owner 8 · Trâm 9 · Daughter 2, +2 shared/alt). Six roster dishes have a real payoff photo: cà phê trứng, bún bò Huế, bánh bèo, cơm gà Hội An, canh chua, phở (beef — Trâm's Saigon bowl; the sister's phở gà shot is life-sharing only, per the thread food rule). Concept gaps noted in the catalog: ingredient-evidence/lookalike shots, cooking-in-progress POV, Tampa everyday (grocery aisle, storm, Ybor), the daughter's food life.
