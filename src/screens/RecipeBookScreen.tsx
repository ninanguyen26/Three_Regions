import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import HomeIcon from "../components/HomeIcon";
import { DISHES } from "../data/dishes";
import type { Dish } from "../data/types";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { medalFor } from "../game/scorer";
import { colors } from "../theme";

const MEDAL_LABEL = {
  gold: "GOLD",
  silver: "SILVER",
  stamped: "STAMPED",
  fail: "NOT YET",
} as const;

function Field({
  label,
  revealed,
  text,
  locked,
}: {
  label: string;
  revealed: boolean;
  text: string;
  locked: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {revealed ? (
        <Text style={styles.fieldText}>{text}</Text>
      ) : (
        <Text style={styles.locked}>{locked}</Text>
      )}
    </View>
  );
}

// The recipe book: one page per dish, fields revealed progressively.
// Undiscovered: silhouette, ???, clue only. Approved: the full recipe.
// Best 80+: prep note. Best 90+: history. Best 95+: fun fact.
export default function RecipeBookScreen({
  bestByDish,
  menuIds,
  onBack,
}: {
  bestByDish: Record<string, number>;
  menuIds: string[];
  onBack: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: Dish | null =
    selectedId != null
      ? (DISHES.find((d) => d.id === selectedId) ?? null)
      : null;

  if (selected != null) {
    const best = bestByDish[selected.id] ?? 0;
    const approved = best >= 80;
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Pressable onPress={() => setSelectedId(null)} hitSlop={8} style={styles.topLink}>
          <Text style={styles.link}>← All recipes</Text>
        </Pressable>
        <Text style={styles.title}>{approved ? selected.name : "???"}</Text>
        {best >= 80 ? (
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{MEDAL_LABEL[medalFor(best)]}</Text>
          </View>
        ) : null}
        <View style={styles.page}>
          <View style={styles.art}>
            <Text style={styles.artText}>{approved ? selected.name : "?"}</Text>
          </View>
          <Text style={styles.fieldLabel}>Recipe</Text>
          {approved ? (
            selected.slots
              .filter((s) => !s.optional)
              .map((s) => (
                <Text key={s.ingredientId} style={styles.recipeRow}>
                  · {INGREDIENT_BY_ID[s.ingredientId]?.name ?? s.ingredientId}
                </Text>
              ))
          ) : (
            selected.slots
              .filter((s) => !s.optional)
              .map((s) => (
                <View key={s.ingredientId} style={styles.emptySlot} />
              ))
          )}
          {selected.slots.some((s) => s.optional) ? (
            <>
              <Text style={styles.fieldLabel}>Finish (optional)</Text>
              {approved ? (
                selected.slots
                  .filter((s) => s.optional)
                  .map((s) => (
                    <Text key={s.ingredientId} style={styles.recipeRow}>
                      · {INGREDIENT_BY_ID[s.ingredientId]?.name ?? s.ingredientId}
                    </Text>
                  ))
              ) : (
                <Text style={styles.locked}>
                  Optional finish, not required for approval.
                </Text>
              )}
            </>
          ) : null}
          <Field
            label="Prep note"
            revealed={best >= 80}
            text={selected.prepNote}
            locked="Locked: reach 80 or higher to reveal."
          />
          <Field
            label="History"
            revealed={best >= 90}
            text={selected.history}
            locked="Locked: reach silver (90 or higher) to reveal."
          />
          <Field
            label="Fun fact"
            revealed={best >= 95}
            text={selected.funFact}
            locked="Locked: reach gold (95 or higher) to reveal."
          />
          {!approved ? (
            <View style={styles.clueBox}>
              <Text style={styles.clueText}>{selected.clue}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Recipe Book</Text>
      <Text style={styles.sub}>Every dish, one page. Cook well to reveal more.</Text>
      {DISHES.map((d) => {
        const best = bestByDish[d.id] ?? 0;
        const known = best >= 80;
        return (
          <Pressable key={d.id} style={styles.row} onPress={() => setSelectedId(d.id)}>
            <Text style={styles.rowName}>{known ? d.name : "???"}</Text>
            {best >= 80 ? (
              <Text style={styles.rowMedal}>{MEDAL_LABEL[medalFor(best)]}</Text>
            ) : null}
          </Pressable>
        );
      })}
      <Pressable accessibilityRole="button" accessibilityLabel="Go to home" onPress={onBack} hitSlop={8} style={styles.bottomLink}>
        <HomeIcon />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  sub: { color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
  topLink: { alignSelf: "flex-start", paddingVertical: 6 },
  bottomLink: { alignItems: "center", marginTop: 20, paddingVertical: 6 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.panelEdge,
  },
  rowName: { color: colors.text, fontSize: 16, fontWeight: "600" },
  rowMedal: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  stamp: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderWidth: 3,
    borderColor: colors.panelEdge,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    transform: [{ rotate: "-6deg" }],
  },
  stampText: { color: colors.accent, fontSize: 18, fontWeight: "800", letterSpacing: 3 },
  page: {
    marginTop: 16,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  art: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.panelEdge,
    marginBottom: 16,
  },
  artText: { color: colors.accent, fontSize: 20, fontWeight: "700", textAlign: "center" },
  field: { marginTop: 18 },
  fieldLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldText: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 6 },
  locked: { color: colors.muted, fontSize: 14, marginTop: 6, fontStyle: "italic" },
  recipeRow: { color: colors.text, fontSize: 14, marginTop: 4 },
  emptySlot: {
    height: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.panelEdge,
    borderRadius: 6,
  },
  clueBox: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.panelEdge,
    paddingTop: 14,
  },
  clueText: { color: colors.text, fontSize: 15, lineHeight: 22 },
});
