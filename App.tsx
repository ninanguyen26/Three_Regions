import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, useWindowDimensions, View, type ImageSourcePropType } from "react-native";
import Text from "./src/components/AppText";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Caprasimo_400Regular } from "@expo-google-fonts/caprasimo";
import {
  Cause_400Regular,
  Cause_600SemiBold,
  Cause_700Bold,
} from "@expo-google-fonts/cause";
import { DISH_BY_ID, DISHES } from "./src/data/dishes";
import { INGREDIENT_BY_ID } from "./src/data/ingredients";
import type { MarketSection } from "./src/data/markets";
import {
  CATEGORY_LABEL,
  groupFixFor,
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
  dayPool,
  dishesPerDay,
  poolIds,
  queueOnApproval,
} from "./src/game/pool";
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
import TitleScreen from "./src/screens/TitleScreen";
import HomeButton from "./src/components/HomeButton";
import SceneLoading from "./src/components/SceneLoading";
import { prepareImages } from "./src/rendering/prepareImages";
import { HOME_ASSETS, marketSceneAssets } from "./src/rendering/sceneAssets";
import MarketScreen from "./src/screens/MarketScreen";
import CookScreen from "./src/screens/CookScreen";
import WrapCook from "./src/screens/WrapCook";
import ResultScreen from "./src/screens/ResultScreen";
import PrepScreen from "./src/screens/PrepScreen";
import DayScreen from "./src/screens/DayScreen";
import CloseScreen from "./src/screens/CloseScreen";
import RecipeBookScreen from "./src/screens/RecipeBookScreen";
import GuestsScreen from "./src/screens/GuestsScreen";
import PickScreen from "./src/screens/PickScreen";

type Screen =
  | "loading"
  | "weekend"
  | "market"
  | "prep"
  | "day"
  | "pick"
  | "cook"
  | "result"
  | "close";

// Three Regions, the week loop:
// weekend (forecast) -> Saturday market -> Sunday prep -> Sunday trial
// (one locked dish at a time; tutorial trials cannot fail: guided
// repair loop, owner names the worst group until it passes; after
// graduation, one free trial plus one paid re-trial)
// -> Mon-Fri service (approved menu only, picked from Saturday's basket)
// -> Friday close -> next week. The whole loop state persists in
// AsyncStorage.
export default function App() {
  const [storedSave, setSave] = useState<SaveState | null>(null);
  const basketRef = useRef<string[] | null>(null);
  const save = storedSave ? { ...storedSave, basket: basketRef.current } : null;
  const latestSave = useRef<SaveState | null>(null);
  latestSave.current = save;
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [preparing, setPreparing] = useState(false);
  const navigationLock = useRef(false);
  const prepareNavigation = useCallback(async (sources: ImageSourcePropType[], enter: () => void) => {
    if (navigationLock.current) return;
    navigationLock.current = true;
    setPreparing(true);
    try {
      await prepareImages(sources);
    } catch {
      // An image failure must not block navigation; the mounted scene has its own fallback.
    } finally {
      navigationLock.current = false;
      setPreparing(false);
      enter();
    }
  }, []);
  const updateBasket = useCallback((basket: string[]) => {
    const current = latestSave.current;
    if (!current) return;
    const next = { ...current, basket };
    basketRef.current = basket;
    latestSave.current = next;
    // Selection updates remain local to MarketScreen; persistence needs no root render.
    void storeSave(next);
  }, []);
  const [screen, setScreen] = useState<Screen>("loading");
  const [showTitle, setShowTitle] = useState(true);
  const [homeVisible, setHomeVisible] = useState(false);
  const [auxScreen, setAuxScreen] = useState<"recipeBook" | "guests" | "market" | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketSection | null>(null);
  // The pick screen's entry: which kind of pick, and what it starts from.
  // Service and first-trial picks start empty; repair and re-trial picks
  // start from the failed pick. Transient: a reload resumes from the save
  // (trial picks) or from the day screen (service picks).
  const [pickEntry, setPickEntry] = useState<{
    mode: "service" | "trial" | "repair" | "retrial";
    initial: string[];
  } | null>(null);
  // Midweek market detour: where the market returns to. Null means the
  // normal Saturday market.
  const [marketReturn, setMarketReturn] = useState<"day" | "pick" | null>(
    null,
  );
  const [fontsLoaded] = useFonts({
    Caprasimo_400Regular,
    Cause_400Regular,
    Cause_600SemiBold,
    Cause_700Bold,
  });

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
      pick: null,
      results: [],
      trialAttempts: 0,
      trialStep: null,
    };
  };

  useEffect(() => {
    (async () => {
      const loaded = await loadSave();
      if (loaded) {
        basketRef.current = loaded.basket;
        setSave(loaded);
        if (loaded.phase === "trial" && loaded.trialStep === "repair") {
          setPickEntry({ mode: "repair", initial: loaded.pick ?? [] });
          setScreen("pick");
        } else if (
          loaded.phase === "trial" &&
          (loaded.trialStep === "pick" || loaded.trialStep === "market")
        ) {
          // Trial picks resume here: first pick empty, re-trial from the
          // failed pick. A legacy "market" step resumes as a re-trial pick.
          const retrial = (loaded.trialAttempts ?? 0) > 0;
          setPickEntry({
            mode: retrial ? "retrial" : "trial",
            initial: retrial ? (loaded.pick ?? []) : [],
          });
          setScreen("pick");
        } else {
          setScreen(
            loaded.phase === "service"
              ? "day"
              : loaded.phase === "market"
                ? "weekend"
                : loaded.phase === "trial"
                  ? loaded.trialStep === "result"
                    ? "result"
                    : "cook"
                  : loaded.phase,
          );
        }
      } else {
        const fresh = beginWeek(1, null);
        basketRef.current = fresh.basket;
        setSave(fresh);
        await storeSave(fresh);
        setScreen("weekend");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = (next: SaveState, to: Screen) => {
    basketRef.current = next.basket;
    latestSave.current = next;
    setSave(next);
    void storeSave(next);
    setScreen(to);
  };

  const goHome = () => {
    void prepareNavigation(HOME_ASSETS, () => {
      setAuxScreen(null);
      setHomeVisible(true);
    });
  };

  const reset = async () => {
    await clearSave();
    const fresh = beginWeek(1, null);
    setHomeVisible(false);
    setAuxScreen(null);
    apply(fresh, "weekend");
  };

  if (!fontsLoaded || !save || screen === "loading") {
    return (
      <SafeAreaView style={styles.loading}>
        <StatusBar style="dark" />
        <Text style={styles.loadingText}>Three Regions…</Text>
      </SafeAreaView>
    );
  }

  if (showTitle) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <TitleScreen onPlay={() => {
          void prepareNavigation(screen === "weekend" ? HOME_ASSETS : [], () => setShowTitle(false));
        }} />
        <SceneLoading visible={preparing} />
      </View>
    );
  }

  const menu = save.menuIds.flatMap((id) =>
    DISH_BY_ID[id] ? [DISH_BY_ID[id]] : [],
  );
  // Graduated once 5 dishes are approved: the menu and restaurant open,
  // and service runs from the pool. Before that, trials only.
  const graduated = menu.length >= 5;
  // After this trial's approval, the count grows by one: the 5th approval
  // graduates the player in the same week.
  const graduatedAfter = menu.length >= 4;
  // The weekly pool: the first 5 dishes in FIFO rotation order. Old
  // saves without a queue fall back to the menu order.
  const pool = poolIds(save.poolQueue ?? save.menuIds).flatMap((id) =>
    DISH_BY_ID[id] ? [DISH_BY_ID[id]] : [],
  );
  // One service day cooks 4 of the 5 pool dishes, each once. The dish
  // that sits out rotates daily in pool order, so each pool dish cooks
  // 4 days a week and sits out once. Pools under 5 serve whole.
  const perDay = dishesPerDay(pool.length);
  const dayIndex = Math.floor(save.results.length / perDay);
  const cookInDay = save.results.length % perDay;
  const dayDishes = dayPool(pool, dayIndex);
  // The trial dish is the first dish in book order the player has not
  // approved yet: starters in service order, then chapters in book order.
  // One dish unlocks at a time, so the menu grows one approval at a time.
  const trialDish =
    DISHES.find((d) => (save.bestByDish?.[d.id] ?? 0) < 80) ?? null;
  // Saturday shopping: the pool plus the trial dish once graduated,
  // the trial dish only before graduation (no service yet).
  const shoppingDishes = graduated
    ? trialDish
      ? [...pool, trialDish]
      : pool
    : trialDish
      ? [trialDish]
      : [];
  const trialActive = save.phase === "trial" && trialDish != null;
  const dish = trialActive
    ? (trialDish as (typeof DISHES)[number])
    : (dayDishes[cookInDay] ?? DISH_BY_ID["pho-bo"]);
  // The pick screen's entry, set by every navigation into it (and by
  // resume). Falls back to a fresh service pick when absent.
  const pickMode = pickEntry?.mode ?? "service";
  const pickInitial = pickEntry?.initial ?? [];

  // Trial verdict and next step, decided from the trial's own score.
  // The trial is judged from its pick alone: unpicked basket items ding
  // nothing, and the menu parameter is gone with the basket.
  const trialScore =
    trialActive && trialDish
      ? scoreDish(trialDish, save.pick ?? [], save.execution ?? 1)
      : null;
  const trialAttempts = save.trialAttempts ?? 0;
  const trialVerdict = (() => {
    if (!trialActive || !trialDish || !trialScore) return undefined;
    const r = trialScore;
    if (r.percent >= 80)
      return `Approved. ${trialDish.name} joins the menu${graduatedAfter ? " and serves this week" : ""}.`;
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
      : "fix the pick";
    if (!graduated) {
      const groupFix = groupFixFor(trialDish, save.pick ?? []);
      if (groupFix)
        return `The owner rescues it for the staff meal and points at the ${groupFix.group}: ${groupFix.fixes.join("; ")}.`;
      return `The owner rescues it for the staff meal and points at the fix: ${fix}.`;
    }
    if (r.percent >= 60) return `One fix: ${fix}.`;
    const worst = worstCategory(trialDish, save.pick ?? []);
    if (worst) return `Focus on the ${CATEGORY_LABEL[worst].toLowerCase()}.`;
    if (r.wrongPicks.length > 0)
      return "Cut the extra picks. Only pick what the dish needs.";
    return "Start over with the pick.";
  })();
  const trialCanRetry = !graduated || trialAttempts < 2;
  const trialCtaLabel =
    !trialActive || !trialScore
      ? undefined
      : trialScore.percent >= 80
        ? graduatedAfter
          ? "Continue to service →"
          : "Friday close →"
        : trialCanRetry
          ? "Fix the pick →"
          : graduated
            ? "Continue to service →"
            : "Friday close →";
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
      const poolQueue = queueOnApproval(
        save.poolQueue ?? save.menuIds,
        trialDish.id,
      );
      const toService = graduatedAfter;
      apply(
        {
          ...save,
          bestByDish,
          menuIds,
          poolQueue,
          trialAttempts: 0,
          trialStep: null,
          phase: toService ? "service" : "close",
        },
        toService ? "day" : "close",
      );
    } else if (trialCanRetry) {
      // Tutorial repairs in place: picker, then a direct re-score, no
      // re-cook. Post-graduation re-trials re-pick and cook again.
      // Both start from the failed pick.
      const mode = !graduated ? "repair" : "retrial";
      setPickEntry({ mode, initial: save.pick ?? [] });
      apply(
        {
          ...save,
          bestByDish,
          trialStep: !graduated ? "repair" : "pick",
          phase: "trial",
        },
        "pick",
      );
    } else {
      apply(
        {
          ...save,
          bestByDish,
          trialAttempts: 0,
          trialStep: null,
          phase: graduated ? "service" : "close",
        },
        graduated ? "day" : "close",
      );
    }
  };

  const currentBasket = save.basket ?? [];
  const openPreparedMarket = (market: MarketSection | undefined, enter: () => void) => {
    void prepareNavigation(marketSceneAssets(market, basketRef.current ?? [], windowWidth, windowHeight), enter);
  };
  const hubVisible = (homeVisible || screen === "weekend") && auxScreen === null;
  const gameVisible = !homeVisible && screen !== "weekend" && auxScreen === null;
  // MarketScreen owns its safe areas so each surface can extend to the screen edges.
  const AuxiliaryContainer = auxScreen === "market" ? View : SafeAreaView;
  const GameContainer = screen === "market" ? View : SafeAreaView;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {hubVisible && (
        <HomeScreen
          week={save.week}
          notes={save.notes}
          pool={pool}
          shoppingDishes={shoppingDishes}
          savings={save.savings}
          startLabel={screen !== "weekend" ? "Continue →" : undefined}
          onStart={() => {
            if (screen === "weekend") {
              openPreparedMarket(undefined, () => {
                setHomeVisible(false);
                apply({ ...save, basket: basketRef.current, phase: "market" }, "market");
              });
            } else {
              setHomeVisible(false);
            }
          }}
          onMarket={(market) => {
            openPreparedMarket(market, () => {
              setSelectedMarket(market);
              setAuxScreen("market");
            });
          }}
          onRecipeBook={() => setAuxScreen("recipeBook")}
          onGuests={() => setAuxScreen("guests")}
          onReset={reset}
        />
      )}
      {auxScreen !== null && (
        <AuxiliaryContainer style={styles.gameArea}>
          {auxScreen !== "market" && <HomeButton onPress={goHome} />}
          {auxScreen === "recipeBook" && (
            <RecipeBookScreen
              bestByDish={save.bestByDish ?? {}}
              menuIds={save.menuIds}
              onBack={() => setAuxScreen(null)}
            />
          )}
          {auxScreen === "guests" && (
            <GuestsScreen
              servesByRegular={save.servesByRegular ?? {}}
              week={save.week}
              onBack={() => setAuxScreen(null)}
            />
          )}
          {auxScreen === "market" && selectedMarket && (
            <MarketScreen
              onHome={goHome}
              market={selectedMarket}
              basket={currentBasket}
              onBasketChange={updateBasket}
              ctaLabel="Done →"
              onBack={goHome}
              onDone={(basket) => {
                apply({ ...save, basket }, screen);
                goHome();
              }}
            />
          )}
        </AuxiliaryContainer>
      )}
      {/* Keep the active screen mounted so visiting Home preserves drafts. */}
      <GameContainer
        style={[styles.gameArea, !gameVisible && styles.hidden]}
        accessibilityElementsHidden={!gameVisible}
        importantForAccessibility={gameVisible ? "auto" : "no-hide-descendants"}
      >
        {gameVisible && screen !== "market" && <HomeButton onPress={goHome} />}
        {screen === "market" && (
          <MarketScreen
            onHome={goHome}
            basket={currentBasket}
            onBasketChange={updateBasket}
            ctaLabel={marketReturn != null ? "Done →" : undefined}
            backLabel={marketReturn != null ? "← Back" : undefined}
            onBack={() => {
              if (marketReturn != null) {
                const to = marketReturn === "pick" ? "pick" : "day";
                setMarketReturn(null);
                setScreen(to);
              } else {
                goHome();
              }
            }}
            onDone={(basket) => {
              if (marketReturn != null) {
                const to = marketReturn === "pick" ? "pick" : "day";
                setMarketReturn(null);
                apply({ ...save, basket }, to);
              } else {
                apply({ ...save, basket, phase: "prep" }, "prep");
              }
            }}
          />
        )}
        {screen === "prep" && (
          <PrepScreen
            dishes={pool}
            basket={save.basket ?? []}
            trialDish={trialDish}
            onStart={() => {
              if (trialDish) {
                setPickEntry({ mode: "trial", initial: [] });
                apply(
                  { ...save, trialStep: "pick", phase: "trial" },
                  "pick",
                );
              } else {
                apply({ ...save, phase: "service" }, "day");
              }
            }}
          />
        )}
        {screen === "day" && (
          <DayScreen
            day={DAYS[dayIndex]}
            dish={dish}
            dishes={dayDishes}
            results={save.results}
            todayResults={save.results.filter((r) => r.day === DAYS[dayIndex])}
            onCook={() => {
              setPickEntry({ mode: "service", initial: [] });
              setScreen("pick");
            }}
            onMarket={() => {
              openPreparedMarket(undefined, () => {
                setMarketReturn("day");
                setScreen("market");
              });
            }}
          />
        )}
        {screen === "pick" && (
          <PickScreen
            dish={dish}
            basket={save.basket ?? []}
            initialPick={pickInitial}
            guidance={
              pickMode === "repair" || pickMode === "retrial"
                ? trialVerdict
                : undefined
            }
            repair={pickMode === "repair"}
            onBack={() => {
              if (pickMode === "service") {
                setScreen("day");
              } else if (pickMode === "trial") {
                apply({ ...save, phase: "prep", trialStep: null }, "prep");
              } else {
                apply(
                  { ...save, trialStep: "result", phase: "trial" },
                  "result",
                );
              }
            }}
            onMarket={(pick) => {
              openPreparedMarket(undefined, () => {
                setPickEntry({ mode: pickMode, initial: pick });
                setMarketReturn("pick");
                setScreen("market");
              });
            }}
            onDone={(pick) => {
              if (pickMode === "service") {
                apply({ ...save, pick }, "cook");
              } else if (pickMode === "repair") {
                apply(
                  { ...save, pick, trialStep: "result", phase: "trial" },
                  "result",
                );
              } else {
                apply(
                  { ...save, pick, trialStep: "cook", phase: "trial" },
                  "cook",
                );
              }
            }}
          />
        )}
        {screen === "cook" &&
          (dish.verb === "wrap" ? (
            <WrapCook
              dish={dish}
              paused={!gameVisible}
              onBack={() => {
                if (trialActive) {
                  setPickEntry({
                    mode: (save.trialAttempts ?? 0) > 0 ? "retrial" : "trial",
                    initial: save.pick ?? [],
                  });
                  apply(
                    { ...save, trialStep: "pick", phase: "trial" },
                    "pick",
                  );
                } else {
                  setPickEntry({ mode: "service", initial: save.pick ?? [] });
                  setScreen("pick");
                }
              }}
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
              paused={!gameVisible}
              onBack={() => {
                if (trialActive) {
                  setPickEntry({
                    mode: (save.trialAttempts ?? 0) > 0 ? "retrial" : "trial",
                    initial: save.pick ?? [],
                  });
                  apply(
                    { ...save, trialStep: "pick", phase: "trial" },
                    "pick",
                  );
                } else {
                  setPickEntry({ mode: "service", initial: save.pick ?? [] });
                  setScreen("pick");
                }
              }}
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
            pick={save.pick ?? []}
            execution={save.execution ?? 1}
            prevBest={save.bestByDish?.[dish.id]}
            retryLabel={
              save.results.length + 1 >= 5 * perDay
                ? "Friday close →"
                : (save.results.length + 1) % perDay === 0
                  ? "Next day →"
                  : "Next dish →"
            }
            trial={trialActive}
            trialVerdict={trialVerdict}
            trialCtaLabel={trialCtaLabel}
            onTrialCta={handleTrialCta}
            onRetry={() => {
              const r = scoreDish(dish, save.pick ?? [], save.execution ?? 1);
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
              if (results.length >= 5 * perDay) {
                apply(
                  {
                    ...save,
                    results,
                    bestByDish,
                    phase: "close",
                    savings:
                      save.savings +
                      results.reduce((a, x) => a + x.earned, 0),
                  },
                  "close",
                );
              } else {
                apply({ ...save, results, bestByDish }, "day");
              }
            }}
            onHome={goHome}
          />
        )}
        {screen === "close" && (
          <CloseScreen
            results={save.results}
            savings={save.savings}
            nextTrialDish={trialDish}
            onNext={() => {
              const next = beginWeek(save.week + 1, save);
              apply(next, "weekend");
            }}
          />
        )}
      </GameContainer>
      <SceneLoading visible={preparing} />
    </View>
  );
}

const styles = StyleSheet.create({
  gameArea: { flex: 1 },
  hidden: { display: "none" },
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: colors.text, fontSize: 18 },
});
