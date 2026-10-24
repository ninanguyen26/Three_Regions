# Three Regions — Build path

Ordered from `APPROVED.md` (decided points only, as of 2026-10-24). One step at a time: a step is done when it plays on device, not when it compiles. Placeholders stay placeholders until their decision lands (prices, real verbs, model). Nothing in this path needs a new decision to start.

## Already built (do not redo)

- [x] Data: 28 dishes, 164 ingredients, scorer, jest suite (Mac total to confirm: 29 expected).
- [x] Week loop shell: menu-based weeks (4 starters), Saturday basket (cap 38), Sunday prep stub, Mon–Fri service rotation, Friday close (placeholder earnings 20/16/12/4, savings), AsyncStorage save, forecast generator parked.
- [x] Screens: Home, Market, Cook (placeholder hold-release, verbCopy for all 8 verbs), Result.
- [x] Cleanup owed: remove the rejected Wrap v1 test entry (HomeScreen/App `wrapTest`). Done 2026-10-24: test button, screen, prop, and union entry removed; WrapCook kept, it still drives live wrap cooks in service.

## Phase 1 — Dish medals + unlock gating (on the existing loop)

- [x] Save: per-dish best score + medal. Service cooks update best; medal never drops. Done 2026-10-24: bestByDish in save.ts, updated in the App retry step, old saves normalize to {}.
- [x] Result screen: show day score + best medal. On crossing a threshold, show the unlock immediately (prep note / history / fun fact). Done 2026-10-24: prevBest prop, unlock banner, best line.
- [x] Recipe book: gate fields by best. Stamp + image + prep note at ok; history added at silver; fun fact added at gold. Undiscovered stays silhouette + `???`. Done 2026-10-24: RecipeBookScreen (index + one page per dish, recipe at approval).
- [ ] Locked recipe pages: unapproved dish shows one empty slot per ingredient instead of locked text.
- [ ] Verify on device: cook a starter to silver, recipe book gains history, medal persists across reload.
- [x] Data check (Muse alone, no device needed): paper cases for the 24 new dish records — exact = 100 gold, missing signature caps below 80, one close substitute stays gold, foreign pick dinged −6. Done 2026-10-24: 99 VM checks pass, jest cases landed (Mac suite should total 128 when run).

## Phase 2 — Owner trial (Sunday after prep)

- [ ] Week loop: weeks with a new dish get a Sunday trial step after prep, before Monday service.
- [ ] Menu grows one dish at a time: only one new dish enters trial at a time, and tutorial weeks use the same trial and approval systems, no bypass or pre-approval.
- [ ] Trial cook: reuse Market/Cook/Result with a trial flag (no pay, no menu, verdict screen instead of Friday close). Trial grades basket + execution, using the current placeholder execution until real verbs land.
- [ ] Verdicts: 80+ approved, dish joins that week's menu. Bad (60–79): one-fix line naming the biggest miss exactly, from the scorer. Really bad (below 60): one-direction line naming only the worst part, from a new grouping function over slot losses by ingredient category (never an ingredient name).
- [ ] Attempts: Saturday buys trial quantity only (taught from day 1). First Sunday trial free. One paid re-trial the same Sunday before opening, no more that Sunday. Failed dish: week runs on approved dishes. Fresh trial cycle in a later week.
- [ ] Costs: attempt counting now. Money and quantity mechanics stay placeholders until economy (prices) lands. Trial flow does not wait for prices.
- [ ] If approved: buy service quantity before opening at normal price (placeholder until prices exist).
- [ ] Verify on device: new-dish trial Sunday, approved, serves Mon–Fri; failed trial, week runs without it.

## Phase 3 — Diary + generated names

- [ ] Save: diary array (week, dish, tier, score, name, owner line). Written once, never regenerated.
- [ ] List screen on the Album pattern. Bad: specific name. Really bad: vague name + owner line + mystery slot that annotates itself on approval.
- [ ] Names: template fallback first (scorer facts in, name out). On-device model swapped in later behind the same function. No cloud, no new dependency for v1.
- [ ] Verify on device: fail a trial, diary entry appears, never changes on re-view.

## Phase 4 — Customer request separation

- [ ] Order ticket: dish + request as two lines. Request lives on the order, never edits the dish record.
- [ ] Result screen: dish score and customer score side by side, never blended into one percent.
- [ ] Rule: slot-changing request cooks count for the customer (traits, tips, relationships), not the medal. Taste-only request cooks (Taste and Adjust) still count for the medal.
- [ ] Start with a minimal request set (omit / swap / taste) on hand-authored service orders. The guest/trait system is a later phase, not a blocker.
- [ ] Verify on device: vegetarian swap cook, dish fail, customer delighted, medal unmoved.

## Phase 5 — Chapters, economy, post-game (in order, one at a time)

- [ ] Chapters: chapter menu presentation, owner approval, next chapter. Per-dish gating is Phase 2.
- [ ] Economy: ingredient prices, then trial re-trial + buy-more + midweek top-up (150%) become real money. Buyout price, dish prices, earnings replace placeholders.
- [ ] Post-game: buyout, infinite loop, forecast unparked for post-game menu planning, weekly menu cap.
- [ ] Finale texts + post-game texting cadence.

## Explicitly NOT in this path until Ngoc reopens

- Sister reconstruction puzzle (parked after the complexity flag).
- Full texting threads, regulars' lines, quest scripts.
- Real verb games (trial and service use placeholder execution until then).
- Music.

## Rules for building from this path

- One step at a time; device verification closes each step.
- Data and logic are Muse's to verify alone (paper cases, tests). UX is only testable on a real game surface.
- No full-file overwrites on files Ngoc is actively editing. Targeted edits, read back after.
- Proposals stay in chat. This doc is the decided order.
