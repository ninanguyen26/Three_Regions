import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Dish } from "../data/types";
import { colors } from "../theme";
import { VERB_COPY } from "./verbCopy";

// Wrap, for goi cuon: the first real verb built on the Pour pattern.
// Same skeleton and contract as Pour (hold to progress, release inside
// the golden band for a clean execution, where you stop becomes the
// scorer's execution input 0..1, Serve hands it to the result).
// What is different is the feel, because wrapping is not pouring:
//   - You watch a rice paper sheet roll up into a roll, not a gauge fill.
//   - Both sides miss, in different ways: stop early and the roll is
//     loose and falls apart; stop late and the tight paper tears.
//   - The band sits lower and tighter than Pour's, and the roll takes
//     a little longer, so it has its own timing.
// Tune it here: band edges and roll speed are the knobs.
const WRAP_BAND_MIN = 68;
const WRAP_BAND_MAX = 82;
const WRAP_FILL_MS = 2600;

function executionFor(fill: number): number {
  if (fill >= WRAP_BAND_MIN && fill <= WRAP_BAND_MAX) return 1;
  const distance = fill < WRAP_BAND_MIN ? WRAP_BAND_MIN - fill : fill - WRAP_BAND_MAX;
  return Math.max(0, Math.round((1 - distance / 50) * 100) / 100);
}

export default function WrapCook({
  dish,
  onServe,
  onBack,
  trial,
  trialSteps,
}: {
  dish: Dish;
  onServe: (execution: number) => void;
  onBack: () => void;
  /** When true this cook is an owner trial, and the steps below apply. */
  trial?: boolean;
  trialSteps?: string[];
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
      const next = fillRef.current + 100 / (WRAP_FILL_MS / 16);
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
  const inBand = fill >= WRAP_BAND_MIN && fill <= WRAP_BAND_MAX;
  const over = fill > WRAP_BAND_MAX;

  // The sheet shrinks as the roll grows: paper and roll share one width.
  const paperPct = Math.max(5, 58 - fill * 0.53);
  const rollWidth = 30 + fill * 0.62;

  const feelLine =
    finished !== null
      ? null
      : over
        ? "Too tight, the paper is straining"
        : inBand
          ? "That feels tight, let go"
          : "Still loose, keep rolling";

  return (
    <View style={styles.root}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.backWrap}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.sub}>
        {dish.name} · hold to roll, let go when it feels tight. Too loose falls
        apart, too tight tears the paper.
      </Text>
      {trial ? (
        <View style={styles.trialBox}>
          <Text style={styles.trialLabel}>Trial cook</Text>
          {(trialSteps ?? []).map((s) => (
            <Text key={s} style={styles.trialStep}>
              · {s}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.stage}>
        <View style={styles.rollRow}>
          <View style={[styles.paper, { width: `${paperPct}%` }]}>
            <View style={styles.paperDotRow}>
              <View style={[styles.dot, styles.dotShrimp]} />
              <View style={[styles.dot, styles.dotHerb]} />
              <View style={[styles.dot, styles.dotNoodle]} />
            </View>
          </View>
          <View style={[styles.roll, { width: rollWidth }]}>
            <View style={[styles.dot, styles.dotShrimp]} />
            <View style={[styles.dot, styles.dotHerb]} />
          </View>
        </View>
        {feelLine ? (
          <Text
            style={[
              styles.feel,
              inBand && styles.feelGood,
              over && styles.feelBad,
            ]}
          >
            {feelLine}
          </Text>
        ) : null}
      </View>

      <View style={styles.meterWrap}>
        <View style={styles.meter}>
          <View
            style={[
              styles.meterBand,
              {
                left: `${WRAP_BAND_MIN}%`,
                width: `${WRAP_BAND_MAX - WRAP_BAND_MIN}%`,
              },
            ]}
          />
          <View style={[styles.meterFill, { width: `${fill}%` }]} />
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
              : fill < WRAP_BAND_MIN
                ? `Stopped at ${fillPct}%. Too loose, the roll would fall apart. Execution ${Math.round(finished * 100)}%.`
                : `Stopped at ${fillPct}%. Too tight, the rice paper would tear. Execution ${Math.round(finished * 100)}%.`}
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
  sub: { color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
  trialBox: {
    marginTop: 20,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  trialLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  trialStep: { color: colors.text, fontSize: 14, marginTop: 4 },
  stage: {
    marginTop: 36,
    height: 180,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  rollRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    height: 58,
    backgroundColor: "rgba(245, 233, 211, 0.82)",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    paddingLeft: 10,
  },
  paperDotRow: { flexDirection: "row", gap: 7 },
  roll: {
    height: 76,
    backgroundColor: "#e8d5ae",
    borderColor: colors.accent,
    borderWidth: 2,
    borderRadius: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dot: { width: 11, height: 11, borderRadius: 6 },
  dotShrimp: { backgroundColor: "#e07a5f" },
  dotHerb: { backgroundColor: "#9ec49a" },
  dotNoodle: { backgroundColor: "#fff7e8" },
  feel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 22,
  },
  feelGood: { color: colors.good },
  feelBad: { color: colors.bad },
  meterWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 28,
  },
  meter: {
    flex: 1,
    height: 22,
    borderWidth: 2,
    borderColor: colors.panelEdge,
    borderRadius: 11,
    overflow: "hidden",
    backgroundColor: colors.panel,
    position: "relative",
  },
  meterBand: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(217, 185, 138, 0.35)",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.accent,
  },
  meterFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#c98f3d",
  },
  pct: { color: colors.text, fontSize: 22, fontWeight: "700", minWidth: 64 },
  hold: {
    marginTop: 32,
    backgroundColor: colors.panel,
    borderColor: colors.panelEdge,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
  },
  holdActive: { backgroundColor: colors.panelEdge },
  holdText: { color: colors.text, fontSize: 17, fontWeight: "700" },
  doneBox: { marginTop: 32, alignItems: "center" },
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
