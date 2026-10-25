import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { FORECAST_PARKED, type ForecastNote } from "../game/forecast";
import type { Dish } from "../data/types";
import { colors, fonts } from "../theme";

// The home hub: where each week starts. Forecast (parked), the menu,
// savings. Then Saturday shopping kicks the week off.
export default function HomeScreen({
  week,
  notes,
  pool,
  savings,
  onStart,
  onRecipeBook,
  onGuests,
  onReset,
}: {
  week: number;
  notes: ForecastNote[];
  pool: Dish[];
  savings: number;
  onStart: () => void;
  onRecipeBook: () => void;
  onGuests: () => void;
  onReset: () => void;
}) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Three Regions</Text>
      <Text style={styles.sub}>One kitchen. Three regions.</Text>

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
        {pool.length > 0 ? (
          <View style={styles.dishRow}>
            {pool.map((d) => (
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
        <Text style={styles.hint}>Savings: ${savings}</Text>
      </View>

      <Pressable style={styles.cta} onPress={onStart}>
        <Text style={styles.ctaText}>
          {pool.length >= 5
            ? "Saturday: go to the market →"
            : "Saturday: shop with the owners →"}
        </Text>
      </Pressable>

      <Pressable onPress={onRecipeBook} hitSlop={8} style={styles.bookLink}>
        <Text style={styles.bookText}>Recipe book →</Text>
      </Pressable>

      <Pressable onPress={onGuests} hitSlop={8} style={styles.guestsLink}>
        <Text style={styles.guestsText}>Guests →</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Start over?",
            "This erases your current save and starts a new game.",
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
  title: { color: colors.text, fontSize: 34, fontFamily: fonts.display, marginTop: 12 },
  sub: { color: colors.accent, fontSize: 16, fontFamily: fonts.body, marginTop: 6 },
  card: {
    marginTop: 16,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  cardLabel: { color: colors.accent, fontSize: 13, fontFamily: fonts.bodyBold },
  dishRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  dishChip: {
    backgroundColor: colors.bg,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dishChipText: { color: colors.text, fontSize: 14, fontFamily: fonts.bodySemi },
  note: { color: colors.text, fontSize: 16, fontFamily: fonts.body, marginTop: 8, lineHeight: 22 },
  hint: { color: colors.muted, fontSize: 13, fontFamily: fonts.body, marginTop: 10, lineHeight: 18 },
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontFamily: fonts.bodyBold },
  bookLink: { alignItems: "center", marginTop: 16, paddingVertical: 6 },
  bookText: { color: colors.accent, fontSize: 14, fontFamily: fonts.bodySemi },
  guestsLink: { alignItems: "center", marginTop: 8, paddingVertical: 6 },
  guestsText: { color: colors.accent, fontSize: 14, fontFamily: fonts.bodySemi },
  resetLink: { alignItems: "center", marginTop: 8, paddingVertical: 6 },
  resetText: { color: colors.muted, fontSize: 14, fontFamily: fonts.bodySemi },
});
