import React from "react";
import { Image, StyleSheet } from "react-native";

export type HomeHubIconName = "recipes" | "guests" | "menu";

const artwork = {
  recipes: require("../../assets/runtime/ui/recipes.png"),
  guests: require("../../assets/runtime/ui/guests.png"),
  menu: require("../../assets/runtime/ui/menu.png"),
};

export default function HomeHubIcon({ name, onReady }: { name: HomeHubIconName; onReady?: (source: number) => void }) {
  return <Image source={artwork[name]} resizeMode="contain" style={styles.icon} onLoad={() => onReady?.(artwork[name])} onError={() => onReady?.(artwork[name])} accessible={false} />;
}

const styles = StyleSheet.create({
  icon: { width: 36, height: 36 },
});
