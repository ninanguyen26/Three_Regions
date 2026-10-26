import React, { useState } from "react";
import { Image, Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { MARKET_SECTIONS, type MarketSection } from "../data/markets";
import { colors } from "../theme";
import { MARKET_ART } from "../data/marketArt";

// Ground anchors use the full map coordinates, independent of HUD/safe-area sizing.
// Each sprite's ground line is about 86% down its transparent square canvas.
const markets = [
  {
    title: "Meat market",
    x: 0.44, y: 0.25, scale: 1,
  },
  {
    title: "Seafood market",
    x: 0.18, y: 0.61, scale: 1,
  },
  {
    title: "Produce market",
    x: 0.61, y: 0.36, scale: 1,
  },
  {
    title: "Grocery",
    x: 0.85, y: 0.24, scale: 1,
  },
  {
    title: "Vietnamese specialty",
    x: 0.90, y: 0.61, scale: 1,
  },
];

export default function MarketTown({ onMarket, onImageReady }: { onMarket: (market: MarketSection) => void; onImageReady?: (source: ImageSourcePropType) => void }) {
  const [area, setArea] = useState({ width: 0, height: 0 });
  const baseSize = Math.min(156, area.width * 0.14, area.height * 0.25);
  const restaurantSize = baseSize * 1.1;

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
      onLayout={({ nativeEvent: { layout } }) => setArea({ width: layout.width, height: layout.height })}
    >
      {area.width > 0 && area.height > 0 && (
        <>
          {MARKET_SECTIONS.map((section) => {
            const { title } = section;
            const market = markets.find((entry) => entry.title === title);
            if (!market) return null;
            const size = baseSize * market.scale;
            const badgeSize = Math.max(24, Math.min(38, size * 0.32));
            return (
              <Pressable
                key={title}
                accessibilityRole="button"
                accessibilityLabel={`Open ${title}`}
                onPress={() => onMarket(section)}
                style={({ pressed }) => [styles.building, {
                  width: size, height: size,
                  left: area.width * market.x - size / 2,
                  top: area.height * market.y - size * 0.86,
                }, pressed && styles.pressed]}
              >
                <Image onLoad={() => onImageReady?.(MARKET_ART[title].building)} onError={() => onImageReady?.(MARKET_ART[title].building)} source={MARKET_ART[title].building} resizeMode="contain" style={styles.art} accessible={false} />
                <View pointerEvents="none" style={[styles.badge, {
                  width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2,
                  top: size * 0.08, left: (size - badgeSize) / 2,
                }]}>
                  <Image onLoad={() => onImageReady?.(MARKET_ART[title].icon)} onError={() => onImageReady?.(MARKET_ART[title].icon)} source={MARKET_ART[title].icon} resizeMode="contain" style={styles.icon} accessible={false} />
                </View>
              </Pressable>
            );
          })}
          <Image
            onLoad={() => onImageReady?.(require("../../assets/runtime/restaurant-building.png"))}
            onError={() => onImageReady?.(require("../../assets/runtime/restaurant-building.png"))}
            source={require("../../assets/runtime/restaurant-building.png")}
            resizeMode="contain"
            accessibilityLabel="Three Regions restaurant"
            style={[styles.building, {
              width: restaurantSize, height: restaurantSize,
              left: area.width * 0.73 - restaurantSize / 2,
              top: area.height * 0.67 - restaurantSize * 0.86,
            }]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  building: { position: "absolute" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  art: { width: "100%", height: "100%" },
  badge: { position: "absolute", backgroundColor: colors.panel, borderColor: colors.panelEdge, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  icon: { width: "80%", height: "80%" },
});
