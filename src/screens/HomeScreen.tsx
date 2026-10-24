import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { ForecastNote } from "../game/forecast";
import { colors } from "../theme";

// The week hub: where every week starts. Forecast (from Week 2), the menu,
// savings — then Saturday shopping kicks the week off.
export default function HomeScreen({
  week,
  notes,
  savings,
  totalStamps,
  onStart,
}: {
  week: number;
  notes: ForecastNote[];
  savings: number;
  totalStamps: number;
  onStart: () => void;
}) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Three Regions</Text>
      <Text style={styles.sub}>One kitchen. Three regions.</Text>

      <Text style={styles.week}>Week {week}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          {week === 1
            ? "Your first week"
            : week === 2
              ? "The owner's forecast"
              : "This week's forecast"}
        </Text>
        {week === 1 ? (
          <Text style={styles.note}>
            The owners are running the show — no forecast yet. Learn the
            kitchen; the forecast becomes yours in Week 3.
          </Text>
        ) : (
          notes.map((n) => (
            <Text key={n.id} style={styles.note}>
              {n.text}
            </Text>
          ))
        )}
        {week === 2 ? (
          <Text style={styles.hint}>
            One note for now — from Week 3 you get two, and they're yours to
            plan from.
          </Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>On the menu this week</Text>
        <Text style={styles.note}>Phở Bò</Text>
        <Text style={styles.hint}>
          Savings: ${savings} · Stamps so far: {totalStamps}
        </Text>
      </View>

      <Pressable style={styles.cta} onPress={onStart}>
        <Text style={styles.ctaText}>
          {week === 1
            ? "Saturday — shop with the owners →"
            : "Saturday — go to the market →"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 34, fontWeight: "700", marginTop: 12 },
  sub: { color: colors.accent, fontSize: 16, marginTop: 6 },
  week: { color: colors.text, fontSize: 24, fontWeight: "700", marginTop: 34 },
  card: {
    marginTop: 16,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  cardLabel: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  note: { color: colors.text, fontSize: 16, marginTop: 8, lineHeight: 22 },
  hint: { color: colors.muted, fontSize: 13, marginTop: 10, lineHeight: 18 },
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
});
