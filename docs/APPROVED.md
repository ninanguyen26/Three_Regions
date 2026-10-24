# Three Regions — APPROVED

The clean list. Everything here is **decided by Ngoc** (2026-10-23 unless noted). No proposals, no discussion — for proposals, history, and open questions, see `JOURNEY.md`.

**Title: *Three Regions*** (decided by Ngoc 2026-10-23 — the English form of the "Ba Miền" idea, chosen because his main audience is American: it has to be easy to remember, say, and search).

Status: **build started 2026-10-23** — scaffolded at `~/Documents/Projs/Three_Regions` on Ngoc's Mac (Expo SDK 57 stack mirroring Green_Thumb): data schema, the phở bò record, the scorer, and its paper-case tests are in. Next step: the phở slice (market → cook → serve → stamp).

---

## The game

- Vietnamese food only. The player is hired as a cook apprentice by a Vietnamese immigrant couple who own a restaurant in **Tampa, FL**.
- Real recipes, real techniques. Substitution in America (out of stock, frozen not fresh, wrong brand) is part of the cooking, not just an error.
- Graphics stay light. (Ngoc is not concerned about graphics cost for *customers* — the constraint binds environments and animation, not faces.)

## The owners & the knowledge map

- Two owners, a married couple. He is alive, working, and a full co-teacher.
- Their roles are shared and swappable — either can run the market, lead prep, teach a dish, or judge a menu approval — **except the grilling step, which is his alone** (cơm tấm sườn, bún chả, nem lụi are always his teaching scenes).
- The story-memory channels are hers: **she is from the South with Central origins**; **her sister lives in the North** and is the northern-food authority.
  - South = she teaches firsthand. Central = her origins, half-remembered family recipes — the deepest reconstruction material. North = the sister, reached by texting.
- **Her daughter is Vietnamese-American.**

## The player

- An undefined "you" — not Vietnamese-American, not a defined outsider. Defined by skill (a novice cook new to Vietnamese food), never by identity. All dialogue keys off the player's knowledge gaps.
- Character creation is a **name input only**. First-person view (hands/counter); the player never needs a face or body.

## Ending & after

- Arc: cook apprentice → restaurant owner. The player **buys the restaurant from the owners with cash saved across the game**; the savings are the visible long-term goal.
- Finale gates — **both**: every dish mastered **and** savings reach the buyout price. Then the owners **move to the North to reunite with her sister**; the buyout and the goodbye are the same beat.
- **Finale beat (decided):** in the finale, the owner brings up **"One Kitchen, Three Regions"** — why they named the restaurant for that idea. One small kitchen in Tampa that cooks the North, the Center, and the South: it's why the menu spans all three regions, why she taught all three, and what the player is actually buying. The game's title is her sentence, shortened.
- **The game is infinite after the finale**: the week loop runs forever (menu planning, forecasts, seasonal events, Tết yearly, gold-chasing, guest arcs).
- Post-game, the owners (from the North) and the daughter still text — check-ins, menu arguments, and **new dishes to add** (the designed hook for future dish additions).

## The week

- One week = one cycle: **weekend forecast + menu planning → Saturday grocery shopping → Sunday prep → Mon–Fri service → Friday close.**
- The forecast is **group-level only**, and each week it **picks 2 of season / weather / event**, written as short text notes with the implication spelled out — e.g. weather: "rainy and cold this week — most people will want soup and broth"; event: "first week of school — the place will be crowded with USF college kids." The player plans the week's **menu** from those two notes.
- **Calendar (Ngoc, 2026-10-23):** the in-fiction year starts in **early January** — Week 1 is the first week of January. Tết + Gasparilla land around weeks 5–7 as the first festival test.
- **Placement (Ngoc, 2026-10-24):** the pick-2 forecast is a **post-game system**. It switches on when the player owns the restaurant (all 28 dishes learned, buyout done), because that is when menu planning becomes the player's job; with the full roster and menu responsibility, the notes drive real choices (what to feature, how much to prep, Friday's sold-vs-waste). Before the buyout there is **no player-facing forecast**: Week 1 has none, and Week 2's single gentle weather note is the *owner's*, shown as teaching while she still plans the menu. The apprentice cooks and learns; the owners plan.
- **Forecast generation (Ngoc approved Muse's proposal, 2026-10-23):** forecasts are **assembled, not pre-authored** — the game is infinite, so notes are composed from fragments (condition × phrasing variant × implication clause, tagged by craving and crowd). Anchor events are pinned to calendar dates and return yearly (tradition, not repetition). Weather is drawn from **Tampa climate tables** weighted by month and is **sticky** (a pattern holds 1–3 weeks, wearing a fresh phrasing each week). Every fragment pool draws as a **bag** — no replacement until the pool empties — plus a **~10-week cooldown** per fragment, so a note can't resurface for most of a game-year. No runtime AI text generation.
- Friday close is scored twice: how well you cooked, and how well you planned (sold vs waste). Earnings tick into the buyout savings.

## Cold start

- **Weeks 1–2 are tutorial mode; the official game starts Week 3.** The calendar (seasons, Tết countdown) ticks from day 1; only the rules change.
- The restaurant does not start empty — only the player does: **house dishes** (the restaurant's existing menu, visible but grey, "not yours yet") vs **player stamps** (earned at 80%+; zero at start).
- **Week 1 — Apprentice:** the owner drives; the 4 starter dishes are taught; guided shopping and prep; exact orders by name; forecast/spoilage/quests/cravings OFF; **cannot fail** (under 80% → she rescues the dish, it becomes the staff meal, same-day guided repair: she names the worst group and its exact fixes, the player fixes the basket and re-scores without re-cooking, repeating until it passes).
- **Week 2 — Assisted:** simple weather-only forecast (the owner's note, teaching; the player-facing forecast is post-game only, see Placement above); she proposes the menu (player may override); prices on, waste forgiven; **texting opens** (the sister's first thread); first quest.
- **Week 3 — graduation:** she hands over the menu book and market list and takes Sunday off. Full loop ON.

## Progression

- Chapters unlock by **story beats**: master the current chapter → present the chapter menu → **an owner approves it** → next chapter opens. No chapter is time-gated or money-gated.

## Shopping

- The shopping puzzle stays: a clue/description → go to market → pick the correct ingredients among plausible lookalikes, in a **limited set per dish**.
- **Picking is free (Ngoc, 2026-10-23):** the basket has no cap (removed 2026-10-24): a dish with 10 slots can hold 12 picks, and the 2 extra picks ding. Anything on the shelf can go in — all three noodles, if you want. The scorer takes each slot's **best match** from the basket; every pick no slot ends up using is a **wrong pick, dinged −6 each** (tuning constant in the scorer; Ngoc raised it from −3 the same night — too generous). A signature slot with *nothing* from its family still caps the dish.
- Market picks **become** the cooking counter — a bad shop shows up in the cooking score; a missed signature ingredient caps it.
- Weekly layer: quantities are the risk; market notes from the forecast (in-season, storms, scarcity) move prices and availability.

## Cooking & scoring

- Hands-on cooking. **Verbs (provisionally locked — "use those for now"):**
  - **CHOP, POUND, TOSS, SEAR, POUR, WRAP, SIMMER** — each dish has exactly **one primary verb**; scored **secondary** verbs are allowed at lower weight (first case: nem lụi = Sear + Pound secondary).
  - **TASTE & ADJUST** — universal finisher on every dish (showcase: bún đậu mắm tôm).
  - Cà phê trứng's whisk runs on the Toss engine.
- **Scoring (Ngoc's numbers): stamp at 80% similarity, Silver at 90%+, Gold at 95%+.** Framing: 80 = on the menu, 90 = house favorite, 95 = signature. Below stamp: **bad 60–79** (recognizable, not approved), **really bad below 60** (unrecognizable).
- A **missing signature ingredient caps the medal**.
- **Trial cooking steps, ingredient-level grouping (Ngoc, 2026-10-24):** trial cook steps are grouped by ingredient category, not by dish slot. Each ingredient has one fixed category (protein, noodle, bread, seasoning, aromatic, produce, herb, garnish); each category has one generic instruction (examples: sear the proteins, cut the produce). The trial cook screen builds steps from the trial basket, grouping picks by category; a category with no picks is skipped, with no step shown. An ingredient's category never changes per dish; a different use needs a different ingredient entry (shredded cabbage is garnish, not produce).

## The two judges (owner trial + customer service) — agreed 2026-10-24

- The first cook of a dish the player has not yet put on the menu is an **owner trial**: the owner judges the recipe (basket vs the dish record). **80%+ approves the dish and puts it on the menu**; below 80% it stays off the menu and the player retries the trial. The owner is the secret scorer in front of the menu: customers never taste an unapproved dish.
- Two different verdicts for the two failing tiers, both cheap: **bad (60–79) gets the owner's one fix** — the verdict line names the biggest miss exactly (the scorer already computes it), and the player retries by rebuilding the basket in the market. **Really bad (below 60) gets the owner's one direction** — the verdict line names only the worst part (meat, noodles, seasoning, and so on, computed by grouping the slot losses by the correct ingredient's category), never an ingredient name.
- Once a dish is on the menu, its score improves **only through customer cooks**. There is no re-trialing for a better medal. A dish's medal is its best score across its trial and all customer cooks after approval, and never goes down: the trial seeds the best, and each customer cook updates it only when it beats the current best. A customer day below best never lowers the medal or revokes approval; that day's score still drives that day's pay and tips. Daily pay uses the day's score; the medal uses the best score.
- **Unlocks follow the best score:** ok (80–89) unlocks the prep note, silver (90–94) unlocks the history, gold (95+) unlocks the fun fact.
- **Dish and customer request are separate.** The dish record is canonical and never changes per customer; a customer's request (no cilantro, extra spicy, vegetarian) lives on that one service order only. The dish score and the customer score are shown separately, never blended into one percent. A cook whose request changes a slot counts for the customer (traits, relationships, tips), not for the dish medal; a cook with only a taste request, handled in Taste and Adjust, still counts for the medal.
- **Failed trials get diary names.** The on-device text model names what the player actually made, from scorer facts (attempted dish, verb, score and tier, biggest miss with its similarity, other swaps, wrong picks), in the owner's voice. Free and offline: the model is the one already planned for live craving talk, reconstruction, and texting, so naming is one more generation on infrastructure already paid for, and no cloud model exists anywhere in this game. The name, week, attempted dish, tier and score, and owner line are stored in the save on first generation, so the diary entry never changes on later views. Bad gets a specific name; really bad gets a vague name plus the owner's line plus a mystery slot that annotates itself once the dish is approved. The diary is not the menu: a failed dish never goes on the main menu (a separate experiments / house-specials section is proposal only).
- **Trial placement (decided 2026-10-24):** the trial sits on **Sunday, right after Sunday prep, before the week's service opens**. In a week with a new dish, the trial comes first, then the restaurant opens.
- **The owner trial grades execution as well as the basket (decided 2026-10-24):** she tastes the cooked dish, not the raw picks, so the verb performance and the Taste and Adjust step count in the trial score just as they do in a customer cook.
- **Judgment moment (decided 2026-10-24):** a dish's medal upgrades **immediately, on that customer cook's Result screen**, the moment a cook crosses a threshold. The Friday close review is flavor only: the owner comments on what was earned, but it never holds an unlock.
- **Starters follow the same steps as every other dish (decided 2026-10-24):** the 4 starters go through the owner trial and then customer service like any dish. Weeks 1–2 tutorial teaches the player **how the game works** (shopping, cooking, serving), not the dishes themselves; Week 1's cannot-fail rescue is the tutorial safety net on the trial, not a separate approval path.
- **Tutorial weeks use the same systems (decided 2026-10-24):** Weeks 1–2 teach the game, but trial, approval, and unlocking work exactly as in other weeks. No bypass, no pre-approval: a dish is approved only by passing its trial.
- **One dish unlocks at a time (decided 2026-10-24):** only one new dish enters trial at a time, so the menu grows one approved dish at a time.
- **Trial cost (decided 2026-10-24):** Saturday shopping buys **trial quantity only** for a new dish, and the game teaches this from day 1. The **first Sunday trial is free**: nothing beyond the trial quantity already bought. **One re-trial is allowed that same Sunday before opening**, and it costs real ingredient price (a fresh portion bought at normal price); no more attempts that Sunday. If the trial is approved, the player buys **service quantity before the restaurant opens, at normal price** (not the 150% midweek top-up rate, because service has not started), and the dish serves that week. If both attempts fail, the dish stays off the menu that week and the week runs on the approved dishes. A dish that fails both attempts gets a fresh trial cycle in a later week: same as before, Saturday trial quantity, Sunday first trial free plus one paid re-trial.

## Albums & guests

- **Dish album:** one book of all dish records; each dish has one page holding the full set (recipe, prep note, history, fun fact), revealed progressively. Undiscovered = silhouette + `???` + clue only. Locked recipe (decided 2026-10-24): an unapproved dish's recipe section shows one empty slot per ingredient in that dish, names hidden. **Full recipe on approval (Ngoc, 2026-10-24):** once a dish is approved and on the menu, its page reveals the full recipe, and service cooks use the known recipe (wrong picks ding as usual). A stamped dish earns its **stamp + full dish image + prep note**; **silver adds the history, gold adds the fun fact** (unlock ladder, see the two judges). After approval, customer cooks chase Silver → Gold.
- **Guest album:** each guest's page shows their **traits** (spice ceiling, allergy, home region, dislikes), discovered by serving/asking, `???` until learned. The album serves *service*, not forecasting.
- **Regulars carry the stories** (arcs, quests, judging). **Walk-ins just pay normal prices — no rating.**

## Quests

- **Anti-grind rule: a dish is never recooked bare.** Recooks happen only inside a quest, with a twist and a person attached. A dish already Golded auto-completes any recook quest as "already mastered."

## Texting & NLP

- **An NLP library is in** — to add spice and take focus off graphics.
- **NLP never touches the medal scorer.** Scoring stays deterministic.
- Recipe reconstruction (the owner's messy memory) happens in a **texting app**; contacts are memory-holders (the owner at night, her sister, a former cook, the market auntie/supplier, Trâm, the daughter).
- The only guest-facing NLP mode is **live cravings** during Mon–Fri service.
- **The husband never texts.** His story beats are **told by the daughter** (she quotes/reports him).
- **Food rule for threads: teaching is roster-only; life is anything.** Non-roster food may appear as light life-sharing (a character's breakfast, what they ate today) — never a lesson, never a card, never graded.

## Photos (real photos, shot by Ngoc)

- Photos appear **only inside diegetic frames** (the texting app, a postcard, the reviewer's article) — never loose in the game world.
- Photos are the **story layer, never the gameplay layer** (cooked dishes stay composed art, so the player's picks and mistakes show).
- **No people as subjects, ever.** A photo is the sender's POV — food, restaurant tables, stalls, places. No photo ever depicts a named character. Anonymous distant market bustle is acceptable texture.
- **No domestic interiors, ever** — inside nobody's house, including Ngoc's. (Tabletop food photos are food photos, not interiors.)
- **No fictional props or artifacts** in story beats (no invented notebook, no old photo of a fictional event). Beats may only use photos of real things.
- **Found, not staged:** real public places and real food, as they occur. No arranged narrative set-ups.
- **Catalog-first supply:** no shot list; beats are designed around photos that exist (`PHOTO_CATALOG.md`). Standing rule: **no photo, no photo-beat.**
- One warm grade across all photos.

## The roster — 28 dishes

- **Starters / house (4):** phở *(beef — phở gà is not a roster dish)* — Pour · gỏi cuốn — Wrap · bánh mì — Chop · cơm tấm sườn — Sear
- **North (8):** bún chả — Sear · bánh cuốn — Pour · chả cá Lã Vọng — Sear · bún riêu — Simmer · cà phê trứng — Whisk (Toss engine) · bún đậu mắm tôm — Sear · bánh tôm Hồ Tây — Pour · xôi xéo — Chop
- **Central (6):** bún bò Huế — Pound · mì Quảng — Toss · cao lầu — Toss · bánh bèo — Simmer · nem lụi — Sear (+ Pound secondary) · cơm gà Hội An — Chop
- **South / Mekong (8):** hủ tiếu — Pour · bánh xèo — Pour · canh chua — Simmer · cá kho tộ — Simmer · chả giò — Wrap · thịt kho — Simmer *(Tết anchor)* · bò kho — Simmer · gà chiên nước mắm — Sear
- **Home / nationwide (2):** nui xào bò — Sear · chè đậu xanh — Simmer
- **Research rule:** every dish verified against 2–3 sources, paraphrased — never one chef's recipe copied verbatim.

## Ruled out (decided — do not re-add)

- Per-customer forecasts, predictions, and reservation notes.
- The Week-1 self-declaration question ("have you had Vietnamese food before?").
- The hand-over / second-location ending (replaced by the buyout).
- A deceased-husband backstory (he is alive and working).
- Domestic-interior photos; people-as-subjects photos; fictional story props.
- OUT of the roster: chè ba màu, bún thang, cơm hến.

## Content rules
- **No em-dashes anywhere in the game's database** (Ngoc, 2026-10-23): every authored data text (forecast fragments, dish clues, histories, ingredient text) is written without the "—" character; commas, colons, and full sentences do the joining instead. Scrubbed to zero the night the rule was set: the forecast fragments, the phở clue and history, the schema, and every screen's UI copy and code comments. Note: forecast notes persist as text in the save, so a note generated before a text fix keeps its old wording on screen until the next week generates fresh notes.
- **Midweek top-up shopping** (Ngoc's proposal, 2026-10-23, shape agreed in discussion): service days cook from Saturday's basket; if something is missing or wrong, the player can buy it midweek at **150%** of the Saturday price. Top-up only (no full re-shop), applies from the purchase day forward, never rewrites days already served. Needs ingredient prices to exist; a simple per-ingredient price list comes first when this is built.
