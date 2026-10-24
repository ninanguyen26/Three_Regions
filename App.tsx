import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { DISH_BY_ID, DISHES } from "./src/data/dishes";
import { INGREDIENT_BY_ID } from "./src/data/ingredients";
import {
  CATEGORY_LABEL,
  trialStepsFor,
  worstCategory,
} from "./src/game/trial";
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
  clearSave,
  freshSave,
  loadSave,
  storeSave,
  type DayResult,
  type SaveState,
} from "./src/game/save";
import HomeScreen from "./src/screens/HomeScreen";
import MarketScreen from "./src/screens/MarketScreen";
import CookScreen from "./src/screens/CookScreen";
import WrapCook from "./src/screens/WrapCook";
import ResultScreen from "./src/screens/ResultScreen";
import PrepScreen from "./src/screens/PrepScreen";
import DayScreen from "./src/screens/DayScreen";
import CloseScreen from "./src/screens/CloseScreen";
import RecipeBookScreen from "./src/screens/RecipeBookScreen";

type Screen =
  | "loading"
  | "weekend"
  | "market"
  | "prep"
  | "day"
  | "cook"
  | "result"
  | "close"
  | "recipeBook";

// Three Regions, the week loop:
// weekend (forecast) -> Saturday market -> Sunday prep -> Sunday trial
// (one locked dish, first free plus one re-trial; Week 1 cannot fail)
// -> Mon-Fri service (approved menu only, cooked from Saturday's basket)
// -> Friday close -> next week. The whole loop state persists in
// AsyncStorage.
export default function App() {
  const [save, setSave] = useState<SaveState | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");

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
      // The menu is approval-only: it carries forward, never resets to
      // the starters. A week grows by one approved trial dish at a time.
      menuIds: (base.menuIds ?? []).filter(
        (id) => (base.bestByDish?.[id] ?? 0) >= 80,
      ),
      basket: null,
      results: [],
      trialAttempts: 0,
      trialStep: null,
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
              : loaded.phase === "trial"
                ? loaded.trialStep === "market"
                  ? "market"
                  : loaded.trialStep === "result"
                    ? "result"
                    : "cook"
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

  const reset = async () => {
    await clearSave();
    const fresh = beginWeek(1, null);
    apply(fresh, "weekend");
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
  const menu = save.menuIds.flatMap((id) =>
    DISH_BY_ID[id] ? [DISH_BY_ID[id]] : [],
  );
  // The trial dish is the first dish in book order the player has not
  // approved yet: starters in service order, then chapters in book order.
  // One dish unlocks at a time, so the menu grows one approval at a time.
  const trialDish =
    DISHES.find((d) => (save.bestByDish?.[d.id] ?? 0) < 80) ?? null;
  const shoppingDishes = trialDish ? [...menu, trialDish] : menu;
  const trialActive = save.phase === "trial" && trialDish != null;
  const dish = trialActive
    ? (trialDish as (typeof DISHES)[number])
    : (menu[dayIndex % menu.length] ?? DISH_BY_ID["pho-bo"]);

  // Trial verdict and next step, decided from the trial's own score.
  // The trial is judged from Saturday's basket against the menu plus the
  // trial dish, so menu ingredients in the basket are not mistakes.
  const trialScore =
    trialActive && trialDish
      ? scoreDish(
          trialDish,
          save.basket ?? [],
          save.execution ?? 1,
          shoppingDishes,
        )
      : null;
  const trialAttempts = save.trialAttempts ?? 0;
  const trialVerdict = (() => {
    if (!trialActive || !trialDish || !trialScore) return undefined;
    const r = trialScore;
    if (r.percent >= 80)
      return `Approved. ${trialDish.name} joins the menu and serves this week.`;
    const miss = r.biggestMiss;
    const correct = miss
      ? INGREDIENT_BY_ID[miss.ingredientId]?.name
      : null;
    const picked =
      miss?.pickedId != null
        ? INGREDIENT_BY_ID[miss.pickedId]?.name
        : null;
    const fix = correct
      ? picked
        ? `use ${correct} instead of ${picked}`
        : `${correct} is missing`
      : "fix the basket";
    if (save.week === 1)
      return `The owner rescues it for the staff meal and points at the fix: ${fix}.`;
    if (r.percent >= 60) return `One fix: ${fix}.`;
    const worst = worstCategory(trialDish, save.basket ?? [], shoppingDishes);
    if (worst) return `Focus on the ${CATEGORY_LABEL[worst].toLowerCase()}.`;
    if (r.wrongPicks.length > 0)
      return "Cut the extra picks. Only buy what the dish needs.";
    return "Start over with the basket.";
  })();
  const trialCanRetry = save.week === 1 || trialAttempts < 2;
  const trialCtaLabel =
    !trialActive || !trialScore
      ? undefined
      : trialScore.percent >= 80
        ? "Continue to service →"
        : trialCanRetry
          ? "Fix the basket →"
          : "Continue to service →";
  const handleTrialCta = () => {
    if (!trialActive || !trialDish || !trialScore) return;
    const bestByDish = {
      ...save.bestByDish,
      [trialDish.id]: Math.max(
        save.bestByDish?.[trialDish.id] ?? 0,
        trialScore.percent,
      ),
    };
    if (trialScore.percent >= 80) {
      const menuIds = save.menuIds.includes(trialDish.id)
        ? save.menuIds
        : [...save.menuIds, trialDish.id];
      apply(
        {
          ...save,
          bestByDish,
          menuIds,
          trialAttempts: 0,
          trialStep: null,
          phase: "service",
        },
        "day",
      );
    } else if (trialCanRetry) {
      apply(
        { ...save, bestByDish, trialStep: "market", phase: "trial" },
        "market",
      );
    } else {
      apply(
        {
          ...save,
          bestByDish,
          trialAttempts: 0,
          trialStep: null,
          phase: "service",
        },
        "day",
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      {screen === "weekend" && (
        <HomeScreen
          week={save.week}
          notes={save.notes}
          bestByDish={save.bestByDish ?? {}}
          savings={save.savings}
          totalStamps={save.totalStamps}
          onStart={() => apply({ ...save, phase: "market" }, "market")}
          onRecipeBook={() => setScreen("recipeBook")}
          onReset={reset}
        />
      )}
      {screen === "recipeBook" && (
        <RecipeBookScreen
          bestByDish={save.bestByDish ?? {}}
          menuIds={save.menuIds}
          onBack={() => setScreen("weekend")}
        />
      )}
      {screen === "market" && (
        <MarketScreen
          dishes={shoppingDishes}
          initialBasket={trialActive ? (save.basket ?? []) : undefined}
          onBack={
            trialActive
              ? () =>
                  apply(
                    { ...save, trialStep: "result", phase: "trial" },
                    "result",
                  )
              : () => apply({ ...save, phase: "weekend" }, "weekend")
          }
          onDone={(basket) =>
            trialActive
              ? apply(
                  { ...save, basket, trialStep: "cook", phase: "trial" },
                  "cook",
                )
              : apply({ ...save, basket, phase: "prep" }, "prep")
          }
        />
      )}
      {screen === "prep" && (
        <PrepScreen
          dishes={menu}
          basket={save.basket ?? []}
          trialDish={trialDish}
          onStart={() =>
            trialDish
              ? apply(
                  { ...save, trialStep: "cook", phase: "trial" },
                  "cook",
                )
              : apply({ ...save, phase: "service" }, "day")
          }
        />
      )}
      {screen === "day" && (
        <DayScreen
          week={save.week}
          day={DAYS[dayIndex]}
          dish={dish}
          results={save.results}
          onCook={() => setScreen("cook")}
        />
      )}
      {screen === "cook" &&
        (dish.verb === "wrap" ? (
          <WrapCook
            dish={dish}
            trial={trialActive}
            trialSteps={trialStepsFor(save.basket ?? [])}
            onBack={
              trialActive
                ? () =>
                    apply({ ...save, phase: "prep", trialStep: null }, "prep")
                : () => setScreen("day")
            }
            onServe={(ex) => {
              if (trialActive) {
                apply(
                  {
                    ...save,
                    execution: ex,
                    trialAttempts: (save.trialAttempts ?? 0) + 1,
                    trialStep: "result",
                    phase: "trial",
                  },
                  "result",
                );
              } else {
                apply({ ...save, execution: ex }, "result");
              }
            }}
          />
        ) : (
          <CookScreen
            dish={dish}
            trial={trialActive}
            trialSteps={trialStepsFor(save.basket ?? [])}
            onBack={
              trialActive
                ? () =>
                    apply({ ...save, phase: "prep", trialStep: null }, "prep")
                : () => setScreen("day")
            }
            onServe={(ex) => {
              if (trialActive) {
                apply(
                  {
                    ...save,
                    execution: ex,
                    trialAttempts: (save.trialAttempts ?? 0) + 1,
                    trialStep: "result",
                    phase: "trial",
                  },
                  "result",
                );
              } else {
                apply({ ...save, execution: ex }, "result");
              }
            }}
          />
        ))}
      {screen === "result" && (
        <ResultScreen
          dish={dish}
          menu={trialActive ? shoppingDishes : menu}
          basket={save.basket ?? []}
          execution={save.execution ?? 1}
          prevBest={save.bestByDish?.[dish.id]}
          retryLabel={
            dayIndex >= 4 ? "Friday close →" : "Next day →"
          }
          trial={trialActive}
          trialVerdict={trialVerdict}
          trialCtaLabel={trialCtaLabel}
          onTrialCta={handleTrialCta}
          onRetry={() => {
            const r = scoreDish(dish, save.basket ?? [], save.execution ?? 1, menu);
            const bestByDish = {
              ...save.bestByDish,
              [dish.id]: Math.max(save.bestByDish?.[dish.id] ?? 0, r.percent),
            };
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
                  bestByDish,
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
              apply({ ...save, results, bestByDish }, "day");
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
