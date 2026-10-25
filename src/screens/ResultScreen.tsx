import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Dish } from "../data/types";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { medalFor, scoreDish, WRONG_PICK_PENALTY } from "../game/scorer";
import { colors } from "../theme";
import { VERB_COPY } from "./verbCopy";

const MEDAL_LABEL = {
  gold: "GOLD",
  silver: "SILVER",
  stamped: "STAMPED",
  fail: "NOT YET",
} as const;

const UNLOCK_NAMES: Record<number, string> = {
  80: "Prep note",
  90: "History",
  95: "Fun fact",
};

export default function ResultScreen({
  dish,
  pick,
  execution,
  prevBest,
  onRetry,
  retryLabel,
  onHome,
  trial,
  trialVerdict,
  trialCtaLabel,
  onTrialCta,
}: {
  dish: Dish;
  /** This cook's pick. Only the pick is judged, never the whole basket. */
  pick: string[];
  execution: number;
  /** Best percent for this dish before this cook; undefined if never cooked. */
  prevBest?: number;
  onRetry?: () => void;
  retryLabel?: string;
  onHome: () => void;
  /** When true this result is an owner trial, not a service day. */
  trial?: boolean;
  /** The owner's verdict line for a trial. */
  trialVerdict?: string;
  /** The trial's next step button. */
  trialCtaLabel?: string;
  onTrialCta?: () => void;
}) {
  const r = scoreDish(dish, pick, execution);
  // A failed trial hides the breakdown: the owner's one fix or one
  // direction is the whole help, and the breakdown would hand the recipe
  // to a dish that has not been approved yet.
  const trialFailed = trial === true && r.percent < 80;
  const prev = prevBest ?? 0;
  const newBest = Math.max(prev, r.percent);
  const crossed = [80, 90, 95].filter((t) => prev < t && t <= newBest);
  const miss = r.biggestMiss;
  const missName = miss ? INGREDIENT_BY_ID[miss.ingredientId]?.name : null;
  const missPickedName =
    miss?.pickedId != null ? INGREDIENT_BY_ID[miss.pickedId]?.name : null;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{dish.name}</Text>
      {trial && trialVerdict ? (
        <View style={styles.verdictBox}>
          <Text style={styles.verdictText}>{trialVerdict}</Text>
        </View>
      ) : null}

      <View style={styles.scoreBox}>
        <Text style={styles.percent}>{r.percent}%</Text>
        {r.medal === "gold" || r.medal === "silver" ? (
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{MEDAL_LABEL[r.medal]}</Text>
          </View>
        ) : r.medal === "fail" ? (
          <Text style={styles.noStamp}>Under 80.</Text>
        ) : null}
        <Text style={styles.execLine}>
          {VERB_COPY[dish.verb].execution}: {Math.round(execution * 100)}%
        </Text>
        {r.wrongPicks.length > 0 ? (
          <Text style={styles.wrongLine}>
            Dinged:{" "}
            {r.wrongPicks.map((id) => INGREDIENT_BY_ID[id]?.name).join(", ")} ·{" "}
            {r.wrongPicks.length} unused pick
            {r.wrongPicks.length === 1 ? "" : "s"} × {WRONG_PICK_PENALTY} = −
            {r.wrongPickPenalty}
          </Text>
        ) : null}
      </View>

      <Text style={styles.bestLine}>Best for this dish: {newBest}%</Text>
      {crossed.length > 0 ? (
        <View style={styles.unlockBox}>
          <Text style={styles.unlockTitle}>
            New best! {MEDAL_LABEL[medalFor(newBest)]}. Unlocked in your recipe book:
          </Text>
          <Text style={styles.unlockList}>
            {crossed.map((t) => UNLOCK_NAMES[t]).join(", ")}
          </Text>
        </View>
      ) : null}

      {!trialFailed ? (
        <>
          <Text style={styles.feedback}>
            {r.capped && missName
              ? `No ${missName.toLowerCase()} at all. That's a signature ingredient, so the dish is capped at 79 no matter what else you nailed.`
              : miss && miss.similarity < 1
                ? missPickedName
                  ? `Biggest miss: wanted ${missName}, got ${missPickedName}.`
                  : `Biggest miss: ${missName} was left out.`
                : "Every single slot got its exact ingredient."}
          </Text>

          <Text style={styles.section}>The breakdown</Text>
          {r.slots.map((s) => {
            const wanted = INGREDIENT_BY_ID[s.ingredientId]?.name;
            const got =
              s.pickedId != null
                ? INGREDIENT_BY_ID[s.pickedId]?.name
                : "(not picked)";
            const isMiss = miss != null && s.ingredientId === miss.ingredientId;
            return (
              <View key={s.ingredientId} style={[styles.row, isMiss && styles.rowMiss]}>
                <View style={styles.rowMain}>
                  <Text style={styles.rowWanted}>{wanted}</Text>
                  <Text style={styles.rowGot}>counted: {got}</Text>
                </View>
                <Text
                  style={[
                    styles.rowSim,
                    s.similarity === 1
                      ? styles.simGood
                      : s.similarity === 0
                        ? styles.simBad
                        : styles.simMid,
                  ]}
                >
                  {s.similarity === 1
                    ? "exact"
                    : s.similarity === 0
                      ? "missed"
                      : `${Math.round(s.similarity * 100)}%`}
                </Text>
              </View>
            );
          })}
        </>
      ) : null}

      <Pressable style={styles.cta} onPress={trial ? onTrialCta : onRetry}>
        <Text style={styles.ctaText}>
          {trial ? trialCtaLabel : (retryLabel ?? "Back to the market")}
        </Text>
      </Pressable>
      {!trial ? (
        <Pressable onPress={onHome} hitSlop={8} style={styles.homeWrap}>
          <Text style={styles.home}>Home</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  verdictBox: {
    marginTop: 18,
    backgroundColor: colors.panel,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  verdictText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  scoreBox: { alignItems: "center", marginTop: 22 },
  percent: { color: colors.text, fontSize: 56, fontWeight: "800" },
  stamp: {
    marginTop: 10,
    borderWidth: 3,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
    transform: [{ rotate: "-6deg" }] ,
  },
  stampText: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 3,
  },
  noStamp: { color: colors.bad, fontSize: 15, marginTop: 10, fontWeight: "600" },
  bestLine: { color: colors.muted, fontSize: 13, marginTop: 10, textAlign: "center" },
  unlockBox: {
    marginTop: 18,
    backgroundColor: colors.panel,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  unlockTitle: { color: colors.accent, fontSize: 15, fontWeight: "700", textAlign: "center" },
  unlockList: { color: colors.text, fontSize: 15, marginTop: 6, textAlign: "center" },
  execLine: { color: colors.muted, fontSize: 13, marginTop: 12 },
  wrongLine: {
    color: colors.warn,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  feedback: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 24,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.panelEdge,
  },
  rowMiss: { backgroundColor: "rgba(224, 122, 95, 0.08)" },
  rowMain: { flex: 1, flexShrink: 1, paddingRight: 10 },
  rowWanted: { color: colors.text, fontSize: 14, fontWeight: "600" },
  rowGot: { color: colors.muted, fontSize: 12, marginTop: 2 },
  rowSim: { fontSize: 14, fontWeight: "700" },
  simGood: { color: colors.good },
  simMid: { color: colors.warn },
  simBad: { color: colors.bad },
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
  homeWrap: { alignItems: "center", marginTop: 14 },
  home: { color: colors.accent, fontSize: 14, fontWeight: "600" },
});
