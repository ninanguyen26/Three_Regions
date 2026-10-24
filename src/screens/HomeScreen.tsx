import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FORECAST_PARKED, type ForecastNote } from "../game/forecast";
import { DISHES } from "../data/dishes";
import { colors } from "../theme";

// The week hub: where every week starts. Forecast (from Week 2), the menu,
// savings. Then Saturday shopping kicks the week off.
export default function HomeScreen({
  week,
  notes,
  bestByDish,
  savings,
  totalStamps,
  onStart,
  onRecipeBook,
  onReset,
}: {
  week: number;
  notes: ForecastNote[];
  bestByDish: Record<string, number>;
  savings: number;
  totalStamps: number;
  onStart: () => void;
  onRecipeBook: () => void;
  onReset: () => void;
}) {
  const approved = DISHES.filter((d) => (bestByDish[d.id] ?? 0) >= 80);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Three Regions</Text>
      <Text style={styles.sub}>One kitchen. Three regions.</Text>

      <Text style={styles.week}>Week {week}</Text>

      {!FORECAST_PARKED && (
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
            Your first week. The owners guide you while you learn the
            kitchen.
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
            Her note, not yours.
          </Text>
        ) : null}
      </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>On the menu this week</Text>
        {approved.length > 0 ? (
          <View style={styles.dishRow}>
            {approved.map((d) => (
              <View key={d.id} style={styles.dishChip}>
                <Text style={styles.dishChipText}>{d.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.note}>No dishes approved yet.</Text>
        )}
        <Text style={styles.note}>
          Dishes join the menu by passing the owner's trial.
        </Text>
        <Text style={styles.hint}>
          Savings: ${savings} · Stamps so far: {approved.length}
        </Text>
      </View>

      <Pressable style={styles.cta} onPress={onStart}>
        <Text style={styles.ctaText}>
          {week === 1
            ? "Saturday: shop with the owners →"
            : "Saturday: go to the market →"}
        </Text>
      </Pressable>

      <Pressable onPress={onRecipeBook} hitSlop={8} style={styles.bookLink}>
        <Text style={styles.bookText}>Recipe book →</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Start over?",
            "This erases your current save and starts a new game at Week 1.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", style: "destructive", onPress: onReset },
            ],
          )
        }
        hitSlop={8}
        style={styles.resetLink}
      >
        <Text style={styles.resetText}>Reset save</Text>
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
  dishRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  dishChip: {
    backgroundColor: colors.bg,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dishChipText: { color: colors.text, fontSize: 14, fontWeight: "600" },
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
  bookLink: { alignItems: "center", marginTop: 16, paddingVertical: 6 },
  bookText: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  resetLink: { alignItems: "center", marginTop: 8, paddingVertical: 6 },
  resetText: { color: colors.muted, fontSize: 14, fontWeight: "600" },
});
