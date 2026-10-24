import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import type { DayResult } from "../game/save";
import { colors } from "../theme";

const MEDAL_LABEL = {
  gold: "GOLD",
  silver: "SILVER",
  stamped: "STAMPED",
  fail: "no stamp",
} as const;

// Friday close: the week's reckoning — stamps, earnings, savings.
export default function CloseScreen({
  week,
  results,
  savings,
  onNext,
}: {
  week: number;
  results: DayResult[];
  savings: number;
  onNext: () => void;
}) {
  const stamps = results.filter((r) => r.medal !== "fail").length;
  const earned = results.reduce((a, r) => a + r.earned, 0);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Friday Close</Text>
      <Text style={styles.sub}>Week {week} · done</Text>

      {results.map((r) => (
        <Text key={r.day} style={styles.row}>
          {r.day} — {r.percent}% {MEDAL_LABEL[r.medal]} · +${r.earned}
        </Text>
      ))}

      <Text style={styles.total}>
        Stamps this week: {stamps}/5 · Earned: ${earned}
      </Text>
      <Text style={styles.total}>Savings: ${savings}</Text>
      <Text style={styles.hint}>
        Prices are placeholders while the economy gets tuned.
      </Text>

      <Pressable style={styles.cta} onPress={onNext}>
        <Text style={styles.ctaText}>Start Week {week + 1} →</Text>
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
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
});
