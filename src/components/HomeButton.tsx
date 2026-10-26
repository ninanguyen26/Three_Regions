import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Text from "./AppText";
import { colors, fonts } from "../theme";

export default function HomeButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go to home"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>← Home</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: "flex-end", marginHorizontal: 20, marginTop: 8, marginBottom: 4, minHeight: 44, paddingHorizontal: 16, justifyContent: "center", backgroundColor: colors.panel, borderColor: colors.panelEdge, borderWidth: 1, borderRadius: 12 },
  text: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 15 },
  pressed: { opacity: 0.7 },
});
