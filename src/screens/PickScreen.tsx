import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import type { Dish } from "../data/types";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { colors } from "../theme";

// One dish's pick: tap from the purchased basket. Only the pick is
// judged, so anything left in the basket dings nothing. The pick starts
// empty for service and first-trial cooks (tedious for now, Ngoc's
// call); repair and re-trial picks start from the failed pick. The
// recipe is never shown here, trial or service.
export default function PickScreen({
  dish,
  basket,
  initialPick,
  guidance,
  repair,
  onDone,
  onBack,
  onMarket,
}: {
  dish: Dish;
  /** The purchased basket: the only ingredients the pick can draw on. */
  basket: string[];
  initialPick: string[];
  /** The owner's line, shown for repair and re-trial picks. */
  guidance?: string;
  /** Week 1 guided repair: the CTA re-scores instead of cooking. */
  repair?: boolean;
  onDone: (pick: string[]) => void;
  onBack: () => void;
  /** Jump to the market to buy more; the pick is kept on return. */
  onMarket: (pick: string[]) => void;
}) {
  const [pick, setPick] = useState<string[]>(initialPick);

  const toggle = (id: string) =>
    setPick((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} hitSlop={10}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Pick for {dish.name}</Text>
      <Text style={styles.sub}>
        Tap what goes in. Only the pick is judged, so anything you leave
        in the basket dings nothing.
      </Text>
      {guidance ? (
        <View style={styles.guideCard}>
          <Text style={styles.guideText}>{guidance}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Your pick · {pick.length}</Text>
      <View style={styles.chips}>
        {pick.length === 0 ? (
          <Text style={styles.empty}>Nothing yet. Tap the basket.</Text>
        ) : (
          pick.map((id) => (
            <Pressable
              key={id}
              style={styles.pickChip}
              onPress={() => toggle(id)}
            >
              <Text style={styles.pickChipText}>
                {INGREDIENT_BY_ID[id]?.name} ✕
              </Text>
            </Pressable>
          ))
        )}
      </View>

      <Text style={styles.section}>From the basket · {basket.length}</Text>
      {basket.length === 0 ? (
        <Text style={styles.empty}>
          Nothing in the basket. Buy first, then pick.
        </Text>
      ) : (
        <View style={styles.chips}>
          {basket.map((id) => {
            const ing = INGREDIENT_BY_ID[id];
            if (!ing) return null;
            const selected = pick.includes(id);
            return (
              <Pressable
                key={id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggle(id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                  ]}
                >
                  {ing.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Pressable style={styles.cta} onPress={() => onDone(pick)}>
        <Text style={styles.ctaText}>
          {repair ? "Show the owner →" : "Cook →"}
        </Text>
      </Pressable>
      <Pressable style={styles.marketWrap} onPress={() => onMarket(pick)}>
        <Text style={styles.market}>Market →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 8, lineHeight: 20 },
  guideCard: {
    marginTop: 14,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  guideText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  empty: { color: colors.muted, fontSize: 14 },
  pickChip: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  pickChipText: { color: colors.onSecondary, fontSize: 13, fontWeight: "700" },
  chip: {
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextSelected: { color: colors.onSecondary, fontWeight: "700" },
  cta: {
    marginTop: 22,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: colors.onPrimary, fontSize: 16, fontWeight: "700" },
  marketWrap: { alignItems: "center", marginTop: 14 },
  market: { color: colors.accent, fontSize: 14, fontWeight: "600" },
});
