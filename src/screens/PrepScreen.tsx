import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { colors } from "../theme";

// Sunday prep — a stub for now: the real prep mechanics (broths, pickles,
// marinades) plug in here later. Today it frames the week: everything
// Mon-Fri cooks from Saturday's basket.
export default function PrepScreen({
  basket,
  onStart,
}: {
  basket: string[];
  onStart: () => void;
}) {
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sunday Prep</Text>
      <Text style={styles.body}>
        Broth bones in the stockpot, herbs washed, onions ready to char. The
        kitchen is set for the week.
      </Text>
      <Text style={styles.body}>
        Everything Monday to Friday cooks from Saturday's basket:
      </Text>
      <View style={styles.chips}>
        {basket.map((id) => (
          <View key={id} style={styles.chip}>
            <Text style={styles.chipText}>{INGREDIENT_BY_ID[id]?.name}</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.cta} onPress={onStart}>
        <Text style={styles.ctaText}>Monday — start service →</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  body: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 14 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  chip: {
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: { color: colors.text, fontSize: 13 },
  cta: {
    marginTop: 26,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
});
