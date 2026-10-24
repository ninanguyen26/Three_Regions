import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Dish } from "../data/types";
import { colors } from "../theme";
import { VERB_COPY } from "./verbCopy";

// The placeholder cooking step: hold to fill; release inside the band for
// a clean execution. Where you stop becomes the scorer's execution input
// (0..1). The same interaction wears every dish's verb (pour, wrap, chop,
// sear...) until the real verb games replace this screen's innards, not
// its contract: it still hands (execution) to the result.
const BAND_MIN = 78;
const BAND_MAX = 92;
const FILL_MS = 2200;

function executionFor(fill: number): number {
  if (fill >= BAND_MIN && fill <= BAND_MAX) return 1;
  const distance = fill < BAND_MIN ? BAND_MIN - fill : fill - BAND_MAX;
  return Math.max(0, Math.round((1 - distance / 50) * 100) / 100);
}

export default function CookScreen({
  dish,
  onServe,
  onBack,
}: {
  dish: Dish;
  onServe: (execution: number) => void;
  onBack: () => void;
}) {
  const [fill, setFill] = useState(0);
  const [holding, setHolding] = useState(false);
  const [finished, setFinished] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fillRef = useRef(0);

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const finish = (finalFill: number) => {
    stopTimer();
    setHolding(false);
    setFinished(executionFor(finalFill));
  };

  useEffect(() => {
    if (!holding) return;
    timer.current = setInterval(() => {
      const next = fillRef.current + 100 / (FILL_MS / 16);
      if (next >= 100) {
        fillRef.current = 100;
        setFill(100);
        finish(100);
        return;
      }
      fillRef.current = next;
      setFill(next);
    }, 16);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holding]);

  const reset = () => {
    stopTimer();
    setHolding(false);
    fillRef.current = 0;
    setFill(0);
    setFinished(null);
  };

  const fillPct = Math.round(fill);
  const copy = VERB_COPY[dish.verb];
  const holdLower = copy.hold.charAt(0).toLowerCase() + copy.hold.slice(1);

  return (
    <View style={styles.root}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.backWrap}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.sub}>
        {dish.name} · {holdLower}, let go inside the golden band
      </Text>

      <View style={styles.gaugeWrap}>
        <View style={styles.gauge}>
          <View
            style={[
              styles.band,
              {
                bottom: `${BAND_MIN}%`,
                height: `${BAND_MAX - BAND_MIN}%`,
              },
            ]}
          />
          <View style={[styles.fill, { height: `${fill}%` }]} />
        </View>
        <Text style={styles.pct}>{fillPct}%</Text>
      </View>

      {finished === null ? (
        <Pressable
          style={[styles.hold, holding && styles.holdActive]}
          onPressIn={() => setHolding(true)}
          onPressOut={() => finish(fillRef.current)}
        >
          <Text style={styles.holdText}>{holding ? copy.holding : copy.hold}</Text>
        </Pressable>
      ) : (
        <View style={styles.doneBox}>
          <Text style={styles.doneText}>
            {finished === 1
              ? `${copy.clean} Stopped at ${fillPct}%, right in the band.`
              : `Stopped at ${fillPct}%. Execution ${Math.round(finished * 100)}%.`}
          </Text>
          <Pressable style={styles.cta} onPress={() => onServe(finished)}>
            <Text style={styles.ctaText}>Serve it →</Text>
          </Pressable>
          <Pressable onPress={reset} hitSlop={8}>
            <Text style={styles.again}>{copy.again}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  backWrap: { alignSelf: "flex-start" },
  back: { color: colors.accent, fontSize: 15, fontWeight: "600" },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 10 },
  sub: { color: colors.muted, fontSize: 14, marginTop: 6 },
  gaugeWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
    marginTop: 36,
  },
  gauge: {
    width: 150,
    height: 280,
    borderWidth: 2,
    borderColor: colors.panelEdge,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.panel,
    position: "relative",
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(217, 185, 138, 0.35)",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.accent,
  },
  fill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#c98f3d",
  },
  pct: { color: colors.text, fontSize: 22, fontWeight: "700", minWidth: 64 },
  hold: {
    marginTop: 36,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
  },
  holdActive: { backgroundColor: colors.panelEdge },
  holdText: { color: colors.text, fontSize: 17, fontWeight: "700" },
  doneBox: { marginTop: 36, alignItems: "center" },
  doneText: { color: colors.text, fontSize: 15, textAlign: "center", lineHeight: 21 },
  cta: {
    marginTop: 18,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 34,
    alignItems: "center",
  },
  ctaText: { color: "#241a0e", fontSize: 16, fontWeight: "700" },
  again: { color: colors.accent, fontSize: 14, fontWeight: "600", marginTop: 14 },
});
