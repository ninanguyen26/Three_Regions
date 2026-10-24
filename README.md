# Three Regions

A cozy Vietnamese restaurant game. You're hired as a cook apprentice by a Vietnamese immigrant couple who run a restaurant in Tampa, FL. Learn 28 real dishes — North, Central, South — from market clue to stamped dish, save up, and one day buy the restaurant itself. *One kitchen, three regions.*

## Status

Scaffold (2026-10-23). Stack mirrors Green_Thumb: Expo SDK 57, React Native 0.86, Skia 2.6.2, Reanimated 4.5.1, TypeScript strict. No Expo Go — dev client builds only.

What's in:

- `src/data/` — the content schema (`types.ts`), the ingredient list, and the first dish record: phở bò with its market decoys and similarity scores.
- `src/game/scorer.ts` — the medal scorer as a pure function (stamp ≥ 80, silver ≥ 90, gold ≥ 95; a missed signature ingredient caps the dish at 79). `src/game/__tests__/scorer.test.ts` holds the design's paper cases.
- `App.tsx` + `src/screens/` — the phở slice: home → market (clue + 28-ingredient shelf + basket) → pour (hold-and-release into the band = execution) → result (percent, medal stamp, per-slot breakdown, biggest-miss line).

Design docs live in `docs/` (DESIGN.md = index, APPROVED.md = decided list, JOURNEY.md = proposals/history/open questions, PHOTO_CATALOG.md = the 28-photo catalog; the photo files themselves stay in Muse's workspace).

## First run

npm install, then npm test (scorer paper cases), then npm run ios for a device build.

## Next step

The week loop shell: forecast → Saturday shop → Sunday prep → Mon–Fri service → Friday close, with the other 3 starter dishes (gỏi cuốn/Wrap, bánh mì/Chop, cơm tấm sườn/Sear) joining phở.
