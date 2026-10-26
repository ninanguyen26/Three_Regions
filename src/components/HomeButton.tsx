import React from "react";
import { Pressable, StyleSheet } from "react-native";
import HomeIcon from "./HomeIcon";

export default function HomeButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go to home"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <HomeIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: "flex-end", marginHorizontal: 20, marginTop: 8, marginBottom: 4, minHeight: 44, justifyContent: "center" },
  pressed: { opacity: 0.7 },
});
