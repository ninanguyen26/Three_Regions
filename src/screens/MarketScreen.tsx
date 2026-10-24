import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Dish, IngredientCategory } from "../data/types";
import { INGREDIENTS } from "../data/ingredients";
import { colors } from "../theme";

const CATEGORY_ORDER: IngredientCategory[] = [
  "protein",
  "noodle",
  "bread",
  "seasoning",
  "aromatic",
  "produce",
  "herb",
  "garnish",
];

const CATEGORY_LABEL: Record<IngredientCategory, string> = {
  protein: "Protein",
  noodle: "Noodles",
  bread: "Bread",
  seasoning: "Seasonings",
  aromatic: "Aromatics",
  produce: "Produce",
  herb: "Herbs",
  garnish: "Garnish",
};

export default function MarketScreen({
  dishes,
  onDone,
  onBack,
}: {
  dishes: Dish[];
  onDone: (basket: string[]) => void;
  onBack: () => void;
}) {
  // Free picking (Ngoc): anything on the shelf, up to the menu's cap (the
  // slots of every dish on the menu, added together). One basket serves
  // the whole menu; the scorer takes each slot's best match, and picks no
  // dish on the menu uses get dinged.
  const allSlots = dishes.flatMap((d) => d.slots);
  const cap = allSlots.length;
  const [basket, setBasket] = useState<string[]>([]);
  const full = basket.length >= cap;

  const toggle = (ingredientId: string) =>
    setBasket((b) =>
      b.includes(ingredientId)
        ? b.filter((x) => x !== ingredientId)
        : b.length < cap
          ? [...b, ingredientId]
          : b,
    );

  const covered = (slot: Dish["slots"][number]) =>
    basket.includes(slot.ingredientId) ||
    slot.substitutes.some((s) => basket.includes(s.ingredientId));
  const uncoveredCount = allSlots.filter((s) => !covered(s)).length;
  const uncoveredSignature = allSlots.some(
    (s) => s.tier === "signature" && !covered(s),
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
          One basket covers the whole menu. Pick anything you like, up to{" "}
          {cap} ingredients. Every dish this week is cooked and judged from
          this basket.
        </Text>
      </View>

      <Text style={styles.section}>
        Your basket · {basket.length}/{cap}
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
      {full ? (
        <Text style={styles.fullHint}>
          Basket's full. Tap a basket item to put it back before adding
          another.
        </Text>
      ) : null}

      {CATEGORY_ORDER.map((cat) => (
        <View key={cat}>
          <Text style={styles.section}>{CATEGORY_LABEL[cat]}</Text>
          <View style={styles.shelf}>
            {INGREDIENTS.filter((i) => i.category === cat).map((ing) => {
              const selected = basket.includes(ing.id);
              return (
                <Pressable
                  key={ing.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggle(ing.id)}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {ing.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      {uncoveredSignature ? (
        <Text style={styles.warn}>
          {full
            ? "A doubled-up pick is crowding out a signature ingredient. That caps its dish at 79."
            : "A signature slot on the menu still has nothing at all. That caps its dish below the stamp, no matter what else you picked."}
        </Text>
      ) : uncoveredCount > 0 ? (
        <Text style={styles.warn}>
          {full
            ? uncoveredCount === 1
              ? "One pick is doubling up, and the slot it crowds out scores zero."
              : `${uncoveredCount} picks are doubling up, and the slots they crowd out score zero.`
            : uncoveredCount === 1
              ? "1 of the menu's slots has nothing yet. Empty slots score zero."
              : `${uncoveredCount} of the menu's slots have nothing yet. Empty slots score zero.`}
        </Text>
      ) : null}

      <Pressable style={styles.cta} onPress={() => onDone(basket)}>
        <Text style={styles.ctaText}>Start cooking →</Text>
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
