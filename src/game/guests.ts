// Guest album reveal: staged, mirroring the recipe book.
// Serves per regular live in save.servesByRegular. Serve events do not
// exist yet (service days have no customers): until customer-days land,
// every regular sits at 0 serves and shows unmet. That is sequencing,
// not a missing piece of this file.

// Knobs: serves needed for each reveal stage.
export const SERVES_MET = 1;
export const SERVES_LEARNED = 3;
export const SERVES_KNOWN = 5;

export type RevealState = "unmet" | "met" | "learned" | "known";

export function revealState(serves: number): RevealState {
  if (serves >= SERVES_KNOWN) return "known";
  if (serves >= SERVES_LEARNED) return "learned";
  if (serves >= SERVES_MET) return "met";
  return "unmet";
}

// Miss Pat's season, from the game week. Week 1 is the first week of
// January on a 52-week year: Jan weeks 1-4, Feb 5-8, Mar 9-13, Apr 14-17,
// May 18-21, Jun 22-26, Jul 27-30, Aug 31-34, Sep 35-39, Oct 40-43,
// Nov 44-47, Dec 48-52. In season November through April.
export function patAway(week: number): boolean {
  const w = ((week - 1) % 52) + 1;
  return w >= 18 && w <= 43;
}

// The reviewer never appears in the album until the review event lands.
// There is no event flag yet, so the reviewer is hidden for now.
export function isAlbumVisible(regularId: string): boolean {
  return regularId !== "reviewer";
}
