import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, ActivityIndicator, Animated, StyleSheet, View } from "react-native";
import { colors } from "../theme";

// Keep the mounted scene measurable and loading, but reveal it as a single layer.
export default function SceneReveal({ ready, children }: { ready: boolean; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let animation: Animated.CompositeAnimation | undefined;
    if (!ready) {
      opacity.setValue(0);
      setRevealed(false);
    } else {
      void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
        if (cancelled) return;
        // Allow native image and layout updates to commit before revealing.
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            animation = Animated.timing(opacity, { toValue: 1, duration: reduceMotion ? 0 : 220, useNativeDriver: true });
            animation.start(({ finished }) => { if (finished && !cancelled) setRevealed(true); });
          });
        });
      });
    }
    return () => { cancelled = true; cancelAnimationFrame(frame); animation?.stop(); };
  }, [ready, opacity]);
  return <View style={styles.root}>
    {!revealed && <View style={styles.loading} accessibilityRole="progressbar" accessibilityLabel="Preparing screen"><ActivityIndicator color={colors.secondary} /></View>}
    <Animated.View style={[styles.scene, { opacity }]} pointerEvents={revealed ? "auto" : "none"} accessibilityElementsHidden={!revealed} importantForAccessibility={revealed ? "auto" : "no-hide-descendants"}>
      {children}
    </Animated.View>
  </View>;
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scene: { flex: 1 },
  loading: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
});
