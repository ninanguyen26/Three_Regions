import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  type ImageSourcePropType,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Text from "../components/AppText";
import { FORECAST_PARKED, type ForecastNote } from "../game/forecast";
import type { Dish } from "../data/types";
import type { MarketSection } from "../data/markets";
import { colors, fonts } from "../theme";
import HomeHubIcon from "../components/HomeHubIcon";
import MarketTown from "../components/MarketTown";
import SceneReveal from "../components/SceneReveal";
import { HOME_ASSETS } from "../rendering/sceneAssets";
import { imageKey } from "../rendering/prepareImages";

const homeImageKeys = new Set(HOME_ASSETS.map(imageKey));

// The weekend hub keeps the town in view, with the weekly menu a tap away.
export default function HomeScreen({
  week,
  notes,
  pool,
  shoppingDishes,
  savings,
  onStart,
  onMarket,
  startLabel,
  onRecipeBook,
  onGuests,
  onReset,
}: {
  week: number;
  notes: ForecastNote[];
  pool: Dish[];
  shoppingDishes: Dish[];
  savings: number;
  onStart: () => void;
  onMarket: (market: MarketSection) => void;
  startLabel?: string;
  onRecipeBook: () => void;
  onGuests: () => void;
  onReset: () => void;
}) {
  const [ready, setReady] = useState(false);
  const loaded = useRef(new Set<string>());
  const onImageReady = useCallback((source: ImageSourcePropType) => {
    loaded.current.add(imageKey(source));
    if (Array.from(homeImageKeys).every((key) => loaded.current.has(key))) setReady(true);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(timeout);
  }, []);
  const [menuVisible, setMenuVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const compact = width < 650;
  const short = height < 450;

  return (
    <SceneReveal ready={ready}><ImageBackground
      source={require("../../assets/runtime/tampa-bay-flat-map-inland-v4.png")}
      onLoad={() => onImageReady(HOME_ASSETS[0])}
      onError={() => onImageReady(HOME_ASSETS[0])}
      resizeMode="stretch"
      style={styles.root}
    >
      <MarketTown onMarket={onMarket} onImageReady={onImageReady} />
      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      <View style={[styles.hud, short && styles.hudShort]} pointerEvents="box-none">
        <View style={[styles.header, compact && styles.headerCompact]} pointerEvents="box-none">
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>SATURDAY</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>SAVINGS</Text>
              <Text style={styles.statValue}>${savings}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapSpace} pointerEvents="none" />

        <View style={[styles.footer, compact && styles.footerCompact]}>
          <View style={styles.navGroup}>
            <Pressable accessibilityRole="button" accessibilityLabel="Recipe book" onPress={onRecipeBook} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
              <HomeHubIcon onReady={onImageReady} name="recipes" />
              <Text style={styles.navText}>Recipes</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Guests" onPress={onGuests} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
              <HomeHubIcon onReady={onImageReady} name="guests" />
              <Text style={styles.navText}>Guests</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="On the menu this week" onPress={() => setMenuVisible(true)} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}>
              <HomeHubIcon onReady={onImageReady} name="menu" />
              <Text style={styles.navText}>Menu</Text>
            </Pressable>
          </View>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
              onPress={onStart}
            >
              <Text style={styles.ctaText}>
                {startLabel ?? (pool.length >= 5 ? "Go to the market →" : "Shop with the owners →")}
              </Text>
            </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert(
              "Start over?",
              "This erases your current save and starts a new game.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: onReset },
              ],
            )}
            style={({ pressed }) => [styles.resetLink, pressed && styles.pressed]}
          >
            <Text style={styles.resetText}>Reset save</Text>
          </Pressable>
        </View>
      </View>
      </SafeAreaView>
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)} supportedOrientations={["landscape", "portrait"]}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="Dismiss menu" onPress={() => setMenuVisible(false)} />
          <View style={styles.menuPanel} accessibilityViewIsModal>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>On the menu this week</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>
            <ScrollView
              style={styles.menuScroll}
              contentContainerStyle={styles.menuContent}
              showsVerticalScrollIndicator
            >
              {!FORECAST_PARKED && (
                <View style={styles.forecast}>
                  <Text style={styles.cardLabel}>
                    {week === 1 ? "Your first week" : week === 2 ? "The owner's forecast" : "This week's forecast"}
                  </Text>
                  {week === 1 ? (
                    <Text style={styles.note}>Your first week. The owners guide you while you learn the kitchen.</Text>
                  ) : notes.map((n) => <Text key={n.id} style={styles.note}>{n.text}</Text>)}
                  {week === 2 && <Text style={styles.hint}>Her note, not yours.</Text>}
                </View>
              )}
              <View style={styles.clueCard}>
                <Text style={styles.clueLabel}>This week's menu</Text>
                {shoppingDishes.map((dish) => (
                  <View key={dish.id}>
                    <Text style={styles.clue}>{dish.name}</Text>
                    <Text style={styles.clueHint}>{dish.clue}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>
    </ImageBackground></SceneReveal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safeArea: { flex: 1 },
  mapSpace: { flex: 1 },
  hud: { flex: 1, padding: 20, gap: 16 },
  hudShort: { padding: 12, gap: 10 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  headerCompact: { flexWrap: "wrap" },
  titlePanel: {
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: { color: colors.text, fontSize: 32, fontFamily: fonts.display },
  titleShort: { fontSize: 26 },
  sub: { color: colors.accent, fontSize: 14, fontFamily: fonts.body, marginTop: 2 },
  stats: { flexDirection: "row", gap: 8 },
  stat: {
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 100,
  },
  statLabel: { color: colors.accent, fontSize: 11, fontFamily: fonts.bodyBold, letterSpacing: 1 },
  statValue: { color: colors.text, fontSize: 20, fontFamily: fonts.display, marginTop: 2 },
  menuPanel: {
    width: "90%",
    maxWidth: 520,
    maxHeight: "85%",
    flexShrink: 1,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  modalBackdrop: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(44, 36, 30, 0.65)" },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalTitle: { flex: 1, color: colors.text, fontSize: 22, fontFamily: fonts.display },
  closeButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: colors.bg },
  closeText: { color: colors.text, fontSize: 30, lineHeight: 34 },
  cardLabel: { color: colors.accent, fontSize: 15, fontFamily: fonts.bodyBold },
  menuScroll: { flexShrink: 1, marginVertical: 8 },
  menuContent: { paddingBottom: 4 },
  forecast: { marginBottom: 12 },
  clueCard: { backgroundColor: colors.panel, borderColor: colors.panelEdge, borderWidth: 1, borderRadius: 14, padding: 16 },
  clueLabel: { color: colors.accent, fontSize: 13, fontFamily: fonts.bodyBold },
  clue: { color: colors.text, fontSize: 16, fontFamily: fonts.body, marginTop: 6, lineHeight: 22 },
  clueHint: { color: colors.muted, fontSize: 13, fontFamily: fonts.body, marginTop: 8, lineHeight: 18 },
  note: { color: colors.text, fontSize: 15, fontFamily: fonts.body, marginTop: 4, lineHeight: 20 },
  hint: { color: colors.muted, fontSize: 13, fontFamily: fonts.body, marginTop: 8, lineHeight: 18 },
  cta: { marginLeft: "auto", maxWidth: 280, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 13, minHeight: 48, alignItems: "center", justifyContent: "center" },
  ctaText: { color: colors.onPrimary, fontSize: 16, fontFamily: fonts.bodyBold, textAlign: "center" },
  footer: { flexDirection: "row", alignItems: "center", gap: 10 },
  footerCompact: { flexWrap: "wrap" },
  navGroup: { flexDirection: "row", gap: 4 },
  navButton: { backgroundColor: colors.panel, borderColor: colors.panelEdge, borderWidth: 1, borderRadius: 14, width: 69, height: 69, padding: 4, flexShrink: 0, overflow: "hidden", alignItems: "center", justifyContent: "center", gap: 1 },
  navText: { color: colors.text, fontSize: 12, lineHeight: 16, fontFamily: fonts.bodyBold },
  resetLink: { backgroundColor: colors.panel, borderColor: colors.panelEdge, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 46, justifyContent: "center" },
  resetText: { color: colors.muted, fontSize: 13, fontFamily: fonts.bodySemi },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
