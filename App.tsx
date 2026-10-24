import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DISH_BY_ID } from "./src/data/dishes";
import { colors } from "./src/theme";
import {
  generateForecast,
  gentleForecast,
  type ForecastNote,
} from "./src/game/forecast";
import { scoreDish } from "./src/game/scorer";
import {
  DAYS,
  EARNINGS,
  freshSave,
  loadSave,
  storeSave,
  type DayResult,
  type SaveState,
} from "./src/game/save";
import HomeScreen from "./src/screens/HomeScreen";
import MarketScreen from "./src/screens/MarketScreen";
import CookScreen from "./src/screens/CookScreen";
import ResultScreen from "./src/screens/ResultScreen";
import PrepScreen from "./src/screens/PrepScreen";
import DayScreen from "./src/screens/DayScreen";
import CloseScreen from "./src/screens/CloseScreen";

type Screen =
  | "loading"
  | "weekend"
  | "market"
  | "prep"
  | "day"
  | "cook"
  | "result"
  | "close";

// Three Regions — the week loop:
// weekend (forecast) -> Saturday market -> Sunday prep -> Mon-Fri service
// (cook from Saturday's basket) -> Friday close -> next week. The whole
// loop state persists in AsyncStorage.
export default function App() {
  const [save, setSave] = useState<SaveState | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [execution, setExecution] = useState(0);
  const dish = DISH_BY_ID["pho-bo"];

  const beginWeek = (week: number, prev: SaveState | null): SaveState => {
    const base = prev ?? freshSave();
    const forecastState = base.forecastState;
    let notes: ForecastNote[] = [];
    if (week === 2) notes = [gentleForecast(forecastState, week, Math.random)];
    else if (week >= 3) notes = generateForecast(forecastState, week);
    return {
      ...base,
      week,
      phase: "weekend",
      notes,
      forecastState,
      basket: null,
      results: [],
    };
  };

  useEffect(() => {
    (async () => {
      const loaded = await loadSave();
      if (loaded) {
        setSave(loaded);
        setScreen(
          loaded.phase === "service"
            ? "day"
            : loaded.phase === "market"
              ? "weekend"
              : loaded.phase,
        );
      } else {
        const fresh = beginWeek(1, null);
        setSave(fresh);
        await storeSave(fresh);
        setScreen("weekend");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: SaveState, to: Screen) => {
    setSave(next);
    void storeSave(next);
    setScreen(to);
  };

  if (!save || screen === "loading") {
    return (
      <SafeAreaView style={styles.loading}>
        <StatusBar style="light" />
        <Text style={styles.loadingText}>Three Regions…</Text>
      </SafeAreaView>
    );
  }

  const dayIndex = save.results.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      {screen === "weekend" && (
        <HomeScreen
          week={save.week}
          notes={save.notes}
          savings={save.savings}
          totalStamps={save.totalStamps}
          onStart={() => apply({ ...save, phase: "market" }, "market")}
        />
      )}
      {screen === "market" && (
        <MarketScreen
          dish={dish}
          onBack={() => apply({ ...save, phase: "weekend" }, "weekend")}
          onDone={(basket) =>
            apply({ ...save, basket, phase: "prep" }, "prep")
          }
        />
      )}
      {screen === "prep" && (
        <PrepScreen
          basket={save.basket ?? []}
          onStart={() => apply({ ...save, phase: "service" }, "day")}
        />
      )}
      {screen === "day" && (
        <DayScreen
          week={save.week}
          day={DAYS[dayIndex]}
          results={save.results}
          onCook={() => setScreen("cook")}
        />
      )}
      {screen === "cook" && (
        <CookScreen
          dish={dish}
          onBack={() => setScreen("day")}
          onServe={(ex) => {
            setExecution(ex);
            setScreen("result");
          }}
        />
      )}
      {screen === "result" && (
        <ResultScreen
          dish={dish}
          basket={save.basket ?? []}
          execution={execution}
          retryLabel={
            dayIndex >= 4 ? "Friday close →" : "Next day →"
          }
          onRetry={() => {
            const r = scoreDish(dish, save.basket ?? [], execution);
            const result: DayResult = {
              day: DAYS[dayIndex],
              percent: r.percent,
              medal: r.medal,
              earned: EARNINGS[r.medal],
            };
            const results = [...save.results, result];
            if (results.length >= 5) {
              apply(
                {
                  ...save,
                  results,
                  phase: "close",
                  savings:
                    save.savings +
                    results.reduce((a, x) => a + x.earned, 0),
                  totalStamps:
                    save.totalStamps +
                    results.filter((x) => x.medal !== "fail").length,
                },
                "close",
              );
            } else {
              apply({ ...save, results }, "day");
            }
          }}
          onHome={() => setScreen("day")}
        />
      )}
      {screen === "close" && (
        <CloseScreen
          week={save.week}
          results={save.results}
          savings={save.savings}
          onNext={() => {
            const next = beginWeek(save.week + 1, save);
            apply(next, "weekend");
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: colors.text, fontSize: 18 },
});
