import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../theme";

export default function SceneLoading({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <View style={styles.cover} accessibilityViewIsModal accessibilityLabel="Preparing screen" accessibilityRole="progressbar"><ActivityIndicator color={colors.secondary} /></View>;
}

const styles = StyleSheet.create({
  cover: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(244, 239, 227, 0.12)" },
});
