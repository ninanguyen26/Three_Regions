import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import type { Dish } from "../data/types";
import type { DayResult } from "../game/save";
import { colors } from "../theme";

// One service day: pick the week's dish from Saturday's basket, or top
// up at the market first.
export default function DayScreen({
  week,
  day,
  dish,
  results,
  onCook,
  onMarket,
}: {
  week: number;
  day: string;
  dish: Dish;
  results: DayResult[];
  onCook: () => void;
  onMarket: () => void;
}) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{day}</Text>
      <Text style={styles.sub}>
        Week {week} · service. Pick today's dish from the basket, or top up
        at the market.
      </Text>

      {results.length > 0 ? (
        <>
          <Text style={styles.section}>So far this week</Text>
          {results.map((r) => (
            <Text key={r.day} style={styles.row}>
              {r.day}: {r.percent}% · +${r.earned}
            </Text>
          ))}
        </>
      ) : null}

      <Pressable style={styles.cta} onPress={onCook}>
        <Text style={styles.ctaText}>Cook {dish.name} →</Text>
      </Pressable>
      <Pressable style={styles.market} onPress={onMarket}>
        <Text style={styles.marketText}>Market →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 8, lineHeight: 20 },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: { color: colors.text, fontSize: 14, paddingVertical: 4 },
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
  market: {
    marginTop: 12,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  marketText: { color: colors.accent, fontSize: 16, fontWeight: "700" },
});
