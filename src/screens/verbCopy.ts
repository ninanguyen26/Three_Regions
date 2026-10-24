import type { Verb } from "../data/types";

// Display copy for the cooking step, per verb. The cook screen is one
// placeholder interaction (hold, release inside the band) wearing each
// verb's words until the real verb games land; the result screen reuses
// the execution label.
export interface VerbCopy {
  title: string;
  hold: string;
  holding: string;
  again: string;
  clean: string;
  execution: string;
}

export const VERB_COPY: Record<Verb, VerbCopy> = {
  pour: {
    title: "Pour it over",
    hold: "Hold to pour",
    holding: "Pouring…",
    again: "Pour again",
    clean: "Clean pour.",
    execution: "Pour execution",
  },
  wrap: {
    title: "Wrap the rolls",
    hold: "Hold to roll",
    holding: "Rolling…",
    again: "Wrap again",
    clean: "Tight wrap.",
    execution: "Wrap execution",
  },
  chop: {
    title: "Chop and build",
    hold: "Hold to chop",
    holding: "Chopping…",
    again: "Chop again",
    clean: "Clean cuts.",
    execution: "Chop execution",
  },
  sear: {
    title: "Sear it hot",
    hold: "Hold to sear",
    holding: "Searing…",
    again: "Sear again",
    clean: "Clean sear.",
    execution: "Sear execution",
  },
  toss: {
    title: "Toss it together",
    hold: "Hold to toss",
    holding: "Tossing…",
    again: "Toss again",
    clean: "Even toss.",
    execution: "Toss execution",
  },
  pound: {
    title: "Pound it out",
    hold: "Hold to pound",
    holding: "Pounding…",
    again: "Pound again",
    clean: "Even pounding.",
    execution: "Pound execution",
  },
  simmer: {
    title: "Mind the simmer",
    hold: "Hold to simmer",
    holding: "Simmering…",
    again: "Simmer again",
    clean: "Gentle simmer.",
    execution: "Simmer execution",
  },
  whisk: {
    title: "Whisk the foam",
    hold: "Hold to whisk",
    holding: "Whisking…",
    again: "Whisk again",
    clean: "Silky foam.",
    execution: "Whisk execution",
  },
};
