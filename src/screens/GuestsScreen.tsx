import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { REGULARS } from "../data/regulars";
import { DISH_BY_ID } from "../data/dishes";
import { isAlbumVisible, patAway, revealState } from "../game/guests";
import { colors } from "../theme";

// Guest album: the regulars, revealed in stages. Unmet regulars show
// as ???. Meeting one (first serve) reveals name, who, and routine.
// More serves reveal taste and signature order. Knowing one well
// reveals story and quirk. Serve events do not exist yet (service days
// have no customers), so every regular starts unmet.
export default function GuestsScreen({
  servesByRegular,
  week,
  onBack,
}: {
  servesByRegular: Record<string, number>;
  week: number;
  onBack: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected =
    selectedId != null
      ? (REGULARS.find((r) => r.id === selectedId) ?? null)
      : null;

  if (selected != null) {
    const serves = servesByRegular[selected.id] ?? 0;
    const state = revealState(serves);
    const away = selected.id === "miss-pat" && patAway(week);
    const favName =
      selected.favDishId != null
        ? (DISH_BY_ID[selected.favDishId]?.name ?? selected.favDishId)
        : null;
    return (
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Pressable onPress={() => setSelectedId(null)} hitSlop={8} style={styles.topLink}>
          <Text style={styles.link}>← All guests</Text>
        </Pressable>
        <Text style={styles.title}>{state === "unmet" ? "???" : selected.name}</Text>
        <View style={styles.art}>
          <Text style={styles.artText}>{state === "unmet" ? "?" : selected.name[0]}</Text>
        </View>
        {state === "unmet" ? (
          <Text style={styles.note}>
            {away ? "Away until November." : "Not met yet."}
          </Text>
        ) : (
          <>
            <Text style={styles.fieldLabel}>Who</Text>
            <Text style={styles.fieldText}>{selected.who}</Text>
            <Text style={styles.fieldLabel}>Routine</Text>
            <Text style={styles.fieldText}>{selected.routine}</Text>
            {away ? (
              <Text style={styles.fieldText}>Away until November.</Text>
            ) : null}
            {state === "learned" || state === "known" ? (
              <>
                <Text style={styles.fieldLabel}>Taste</Text>
                <Text style={styles.fieldText}>{selected.taste}</Text>
                {favName != null ? (
                  <>
                    <Text style={styles.fieldLabel}>Signature order</Text>
                    <Text style={styles.fieldText}>{favName}</Text>
                  </>
                ) : null}
              </>
            ) : null}
            {state === "known" ? (
              <>
                <Text style={styles.fieldLabel}>Story</Text>
                <Text style={styles.fieldText}>{selected.story}</Text>
                <Text style={styles.fieldLabel}>Quirk</Text>
                <Text style={styles.fieldText}>{selected.quirk}</Text>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Guests</Text>
      <Text style={styles.sub}>The regulars, as you get to know them.</Text>
      {REGULARS.filter((r) => isAlbumVisible(r.id)).map((r) => {
        const state = revealState(servesByRegular[r.id] ?? 0);
        const away = r.id === "miss-pat" && patAway(week);
        return (
          <Pressable
            key={r.id}
            onPress={() => setSelectedId(r.id)}
            style={styles.row}
          >
            <View style={styles.rowArt}>
              <Text style={styles.rowArtText}>
                {state === "unmet" ? "?" : r.name[0]}
              </Text>
            </View>
            <View style={styles.rowMain}>
              <Text style={styles.rowName}>
                {state === "unmet" ? "???" : r.name}
              </Text>
              <Text style={styles.rowSub}>
                {away
                  ? "Away until November"
                  : state === "unmet"
                    ? "Not met yet."
                    : r.routine}
              </Text>
            </View>
          </Pressable>
        );
      })}
      <Pressable onPress={onBack} hitSlop={8} style={styles.backLink}>
        <Text style={styles.link}>← Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 8 },
  topLink: { marginTop: 10, paddingVertical: 6 },
  link: { color: colors.accent, fontSize: 14, fontWeight: "600" },
  backLink: { alignItems: "center", marginTop: 20, paddingVertical: 6 },
  art: {
    marginTop: 16,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
  artText: { color: colors.text, fontSize: 28, fontWeight: "700" },
  fieldLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 18,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldText: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 6 },
  note: { color: colors.muted, fontSize: 15, marginTop: 16, lineHeight: 22 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  rowArt: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bg,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowArtText: { color: colors.text, fontSize: 18, fontWeight: "700" },
  rowMain: { flex: 1, flexShrink: 1, paddingLeft: 12 },
  rowName: { color: colors.text, fontSize: 16, fontWeight: "700" },
  rowSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
