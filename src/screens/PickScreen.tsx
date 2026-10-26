import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import type { Dish } from "../data/types";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { colors } from "../theme";
import type { Quantities } from "../game/inventory";

// Choose ingredient identities from stored portions. Quantity never changes scoring.
// Tutorial guidance can reuse the consumed attempt without paying for another cook.
type PickProps = {
  dish: Dish;
  inventory: Quantities;
  initialPick: string[];
  guidance?: string;
  repair?: boolean;
  onDone: (pick: string[]) => void;
  onBack: () => void;
  onMarket: (pick: string[]) => void;
};

export default function PickScreen(props: PickProps) {
  const borrowed = new Set(props.repair ? props.initialPick : []);
  const [pick, setPick] = useState<string[]>(() => [...new Set(props.initialPick)].filter((id) =>
    INGREDIENT_BY_ID[id] && ((props.inventory[id] ?? 0) > 0 || borrowed.has(id))));
  const toggle = (id: string) => {
    if (!(props.inventory[id] > 0) && !borrowed.has(id)) return;
    setPick((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };
  return <PickScreenView {...props} pick={pick} onToggle={toggle} />;
}

export function PickScreenView({ dish, inventory, initialPick, guidance, repair, onDone, onBack, onMarket, pick, onToggle }: PickProps & {
  pick: string[];
  onToggle: (id: string) => void;
}) {
  const availableIds = [...new Set([...Object.keys(inventory).filter((id) => inventory[id] > 0), ...(repair ? initialPick : [])])];
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Pressable onPress={onBack} hitSlop={10}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>Pick for {dish.name}</Text>
      <Text style={styles.sub}>
        Tap what goes in. {repair ? "This guidance uses no additional portions." : "Cook uses one portion of every selected ingredient. Unselected stock stays in storage."}
      </Text>
      {guidance ? (
        <View style={styles.guideCard}>
          <Text style={styles.guideText}>{guidance}</Text>
        </View>
      ) : null}

      <Text style={styles.section}>Your pick · {pick.length}</Text>
      <View style={styles.chips}>
        {pick.length === 0 ? (
          <Text style={styles.empty}>Nothing yet. Pick from storage.</Text>
        ) : (
          pick.map((id) => (
            <Pressable
              key={id}
              style={styles.pickChip}
              onPress={() => onToggle(id)}
            >
              <Text style={styles.pickChipText}>
                {INGREDIENT_BY_ID[id]?.name} ✕
              </Text>
            </Pressable>
          ))
        )}
      </View>

      <Text style={styles.section}>{repair ? "For this guidance" : "In storage"} · {availableIds.length} ingredients</Text>
      {availableIds.length === 0 ? (
        <Text style={styles.empty}>
          Storage is empty. Buy ingredients first, then pick.
        </Text>
      ) : (
        <View style={styles.chips}>
          {availableIds.map((id) => {
            const ing = INGREDIENT_BY_ID[id];
            if (!ing) return null;
            const selected = pick.includes(id);
            return (
              <Pressable
                key={id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => onToggle(id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                  ]}
                >
                  {ing.name} · {inventory[id] ?? 0} in stock{repair && !(inventory[id] > 0) ? " · from this attempt" : ""}
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
