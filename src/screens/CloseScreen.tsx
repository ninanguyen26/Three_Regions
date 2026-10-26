import React from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import Text from "../components/AppText";
import type { Dish } from "../data/types";
import type { DayResult } from "../game/save";
import { colors } from "../theme";

// Friday close: the week's reckoning. Earnings, savings, and the
// owner's request for next week's trial dish, so Saturday shopping has
// a target. The named dish is the same derivation the trial uses (first
// dish in book order not yet approved), so it always agrees with the
// trial that follows.
export default function CloseScreen({
  results,
  savings,
  nextTrialDish,
  onNext,
}: {
  results: DayResult[];
  savings: number;
  /** Next week's trial dish, if one is still locked. */
  nextTrialDish?: Dish | null;
  onNext: () => void;
}) {
  const earned = results.reduce((a, r) => a + r.earned, 0);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Friday Close</Text>

      {results.map((r, i) => (
        <Text key={`${r.day}-${i}`} style={styles.row}>
          {r.day}: {r.percent}% · +${r.earned}
        </Text>
      ))}

      <Text style={styles.total}>Earned: ${earned}</Text>
      <Text style={styles.total}>Savings: ${savings}</Text>
      <Text style={styles.hint}>
        Prices are placeholders while the economy gets tuned.
      </Text>

      <Text style={styles.section}>Next week's trial</Text>
      <Text style={styles.body}>
        {nextTrialDish
          ? `Next week, the owner wants to trial ${nextTrialDish.name}.`
          : "Every dish is on the menu now."}
      </Text>

      <Pressable style={styles.cta} onPress={onNext}>
        <Text style={styles.ctaText}>Next week →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 8 },
  row: { color: colors.text, fontSize: 15, paddingVertical: 5, marginTop: 2 },
  total: { color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 18 },
  hint: { color: colors.muted, fontSize: 13, marginTop: 10 },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  cta: {
    marginTop: 26,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: colors.onPrimary, fontSize: 16, fontWeight: "700" },
});
