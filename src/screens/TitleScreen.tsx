import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { colors } from "../theme";

const logo = require("../../assets/runtime/ui/three-regions-logo.png");
const playButton = require("../../assets/runtime/ui/play-button.png");
const logoRatio = Image.resolveAssetSource(logo).width / Image.resolveAssetSource(logo).height;

export default function TitleScreen({ onPlay }: { onPlay: () => void }) {
  const { width, height } = useWindowDimensions();
  const logoWidth = Math.min(560, width * 0.62, height * 0.96);
  const logoHeight = logoWidth / logoRatio;
  const playSize = height < 450 ? 72 : 88;
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);
  const entrance = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;
  const welcome = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    }, () => {
      if (mounted) setReduceMotion(true);
    });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion === null) return;
    if (reduceMotion !== false) {
      entrance.setValue(1);
      float.setValue(0);
      breath.setValue(0);
      welcome.setValue(0);
      return;
    }

    entrance.setValue(0);
    welcome.setValue(0);
    breath.setValue(0);
    const reveal = Animated.timing(entrance, {
      toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true,
    });
    const drift = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(float, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(breath, { toValue: 0, duration: 1900, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
    ]));
    const introduction = Animated.sequence([
      reveal,
      Animated.delay(150),
      Animated.timing(welcome, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true, isInteraction: false }),
      Animated.timing(welcome, { toValue: -0.18, duration: 240, easing: Easing.inOut(Easing.sin), useNativeDriver: true, isInteraction: false }),
      Animated.timing(welcome, { toValue: 0, duration: 160, easing: Easing.out(Easing.cubic), useNativeDriver: true, isInteraction: false }),
    ]);
    introduction.start(({ finished }) => {
      if (finished) pulse.start();
    });
    drift.start();
    return () => {
      introduction.stop();
      drift.stop();
      pulse.stop();
    };
  }, [reduceMotion, entrance, float, breath, welcome]);

  useEffect(() => () => press.stopAnimation(), [press]);

  const animatePress = (pressed: boolean) => {
    if (reduceMotion !== false) return;
    Animated.spring(press, {
      toValue: pressed ? 0.93 : 1,
      speed: 28,
      bounciness: pressed ? 0 : 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ImageBackground
      source={require("../../assets/runtime/tampa-bay-flat-map-inland-v4.png")}
      resizeMode="stretch"
      style={styles.root}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Animated.View
            accessible
            accessibilityLabel="Three Regions"
            accessibilityRole="image"
            style={{
              width: logoWidth,
              height: logoHeight,
              opacity: entrance,
              transform: [
                { translateY: Animated.add(
                  entrance.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
                  float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
                ) },
                { scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
              ],
            }}
          >
            <Image source={logo} resizeMode="contain" blurRadius={4} style={[styles.logoShadow, { width: logoWidth, height: logoHeight }]} accessible={false} />
            <Image source={logo} resizeMode="contain" style={{ width: logoWidth, height: logoHeight }} accessible={false} />
          </Animated.View>
          <Animated.View style={{
            opacity: entrance,
            transform: [
              { translateY: welcome.interpolate({ inputRange: [-0.18, 0, 1], outputRange: [1, 0, -8] }) },
              { scale: Animated.multiply(
                Animated.multiply(press, breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] })),
                welcome.interpolate({ inputRange: [-0.18, 0, 1], outputRange: [0.97, 1, 1.16] }),
              ) },
            ],
          }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Play"
              onPress={onPlay}
              onPressIn={() => animatePress(true)}
              onPressOut={() => animatePress(false)}
              style={({ pressed }) => [styles.play, pressed && reduceMotion !== false && styles.pressedStatic]}
            >
              <Animated.View pointerEvents="none" style={[
                styles.halo,
                { width: playSize * 0.92, height: playSize * 0.92, borderRadius: playSize,
                  opacity: breath.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.22] }),
                  transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [1.06, 1.2] }) }],
                },
              ]} />
              <Image source={playButton} resizeMode="contain" blurRadius={3} style={[styles.playShadow, { width: playSize, height: playSize }]} accessible={false} />
              <Image source={playButton} resizeMode="contain" style={{ width: playSize, height: playSize }} accessible={false} />
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safeArea: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, padding: 20 },
  logoShadow: { position: "absolute", top: 6, left: 0, tintColor: colors.overlay, opacity: 0.22 },
  play: { minHeight: 56, justifyContent: "center", alignItems: "center" },
  playShadow: { position: "absolute", top: 5, tintColor: colors.overlay, opacity: 0.24 },
  halo: { position: "absolute", backgroundColor: colors.onPrimary },
  pressedStatic: { opacity: 0.75 },
});
