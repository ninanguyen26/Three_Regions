import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Dish } from "../data/types";
import { INGREDIENTS } from "../data/ingredients";
import { MARKET_SECTIONS } from "../data/markets";
import { colors } from "../theme";

export default function MarketScreen({
  dishes,
  onDone,
  onBack,
  initialBasket,
  repair,
}: {
  dishes: Dish[];
  onDone: (basket: string[]) => void;
  onBack: () => void;
  /** A basket to start from, for rebuilding after a failed trial. */
  initialBasket?: string[];
  /** Week 1 guided repair: the CTA re-scores instead of cooking. */
  repair?: boolean;
}) {
  // Free picking (Ngoc): anything on the shelf, no cap. One basket serves
  // the whole menu; the scorer takes each slot's best match, and picks no
  // dish on the menu uses get dinged six points each. That ding is the
  // only brake: buying the whole shelf scores zero.
  const [basket, setBasket] = useState<string[]>(initialBasket ?? []);

  const toggle = (ingredientId: string) =>
    setBasket((b) =>
      b.includes(ingredientId)
        ? b.filter((x) => x !== ingredientId)
        : [...b, ingredientId],
    );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} hitSlop={10}>
        <Text style={styles.back}>← Home</Text>
      </Pressable>
      <Text style={styles.title}>The Market</Text>
      <View style={styles.clueCard}>
        <Text style={styles.clueLabel}>This week's menu</Text>
        <Text style={styles.clue}>{dishes.map((d) => d.name).join(" · ")}</Text>
        <Text style={styles.clueHint}>
          One basket covers the whole menu. Pick anything you like. Every
          dish this week is cooked and judged from this basket.
        </Text>
      </View>

      <Text style={styles.section}>
        Your basket · {basket.length}
      </Text>
      <View style={styles.basket}>
        {basket.length === 0 ? (
          <Text style={styles.basketEmpty}>Nothing yet. Tap the shelf.</Text>
        ) : (
          basket.map((id) => (
            <Pressable key={id} style={styles.basketChip} onPress={() => toggle(id)}>
              <Text style={styles.basketChipText}>
                {INGREDIENTS.find((i) => i.id === id)?.name} ✕
              </Text>
            </Pressable>
          ))
        )}
      </View>

      {MARKET_SECTIONS.map((market) => (
        <View key={market.title}>
          <Text style={styles.section}>
            {market.title} ·{" "}
            {market.subsections.flatMap((s) => s.ids).length}
          </Text>
          {market.subsections.map((sub) => (
            <View key={sub.title ?? market.title}>
              {sub.title ? (
                <Text style={styles.subSection}>{sub.title}</Text>
              ) : null}
              <View style={styles.shelf}>
                {sub.ids.map((id) => {
                  const ing = INGREDIENTS.find((i) => i.id === id);
                  if (!ing) return null;
                  const selected = basket.includes(id);
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
            </View>
          ))}
        </View>
      ))}


      <Pressable style={styles.cta} onPress={() => onDone(basket)}>
        <Text style={styles.ctaText}>
          {repair ? "Show the owner →" : "Start cooking →"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  clueCard: {
    marginTop: 14,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  clueLabel: { color: colors.accent, fontSize: 13, fontWeight: "700" },
  clue: { color: colors.text, fontSize: 16, marginTop: 6, lineHeight: 22 },
  clueHint: { color: colors.muted, fontSize: 13, marginTop: 8, lineHeight: 18 },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subSection: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 6,
  },
  basket: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  basketEmpty: { color: colors.muted, fontSize: 14 },
  basketChip: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  basketChipText: { color: "#241a0e", fontSize: 13, fontWeight: "700" },
  fullHint: { color: colors.muted, fontSize: 13, marginTop: 10, lineHeight: 18 },
  shelf: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextSelected: { color: "#241a0e", fontWeight: "700" },
  warn: { color: colors.warn, fontSize: 13, marginTop: 18, lineHeight: 18 },
  cta: {
    marginTop: 22,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
});
