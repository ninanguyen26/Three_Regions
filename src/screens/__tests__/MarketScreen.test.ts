import React, { type ReactNode } from "react";
import { MarketScreenView as MarketScreen } from "../MarketScreen";
import { MARKET_SECTIONS } from "../../data/markets";

jest.mock("react-native", () => ({
  Platform: { select: (values: { ios: string }) => values.ios },
  Image: "Image",
  FlatList: "FlatList",
  ActivityIndicator: "ActivityIndicator",
  ImageBackground: "ImageBackground",
  Pressable: "Pressable",
  ScrollView: "ScrollView",
  SafeAreaView: "SafeAreaView",
  View: "View",
  StyleSheet: { create: (styles: unknown) => styles },
  useWindowDimensions: () => ({ width: 844, height: 390 }),
}));
jest.mock("../../components/AppText", () => "Text");
jest.mock("../../data/ingredientArt", () => ({ INGREDIENT_ART: new Proxy({}, { get: () => 1 }) }));
jest.mock("../../data/marketArt", () => ({ MARKET_ART: new Proxy({}, { get: () => ({ building: 1, icon: 2 }) }) }));
jest.mock("../../rendering/sceneAssets", () => ({ HOME_ASSETS: [], marketSceneAssets: () => [] }));

type Props = {
  children?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  data?: unknown[];
  renderItem?: (entry: { item: unknown; index: number }) => ReactNode;
  ListEmptyComponent?: ReactNode;
};

function contentOf(element: React.ReactElement<Props>): ReactNode {
  if (element.type === "FlatList") {
    return element.props.data?.length
      ? element.props.data.map((item, index) => element.props.renderItem!({ item, index }))
      : element.props.ListEmptyComponent;
  }
  const component = element.type as unknown as { type?: (props: unknown) => ReactNode };
  if (typeof component.type === "function") return component.type(element.props);
  return element.props.children;
}

function textOf(node: ReactNode): string {
  return React.Children.toArray(node).map((child): string => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    return React.isValidElement<Props>(child) ? textOf(contentOf(child)) : "";
  }).join("");
}

function findIngredientButton(node: ReactNode, name: string): (() => void) | undefined {
  for (const child of React.Children.toArray(node)) {
    if (!React.isValidElement<Props>(child)) continue;
    if (child.type === "Pressable" && (child.props.accessibilityLabel === name || textOf(contentOf(child)) === name)) return child.props.onPress;
    const found = findIngredientButton(contentOf(child), name);
    if (found) return found;
  }
}

const meatMarket = MARKET_SECTIONS.find((section) => section.title === "Meat market")!;

function renderMarket(overrides: Partial<Parameters<typeof MarketScreen>[0]> = {}) {
  return MarketScreen({ basket: [], onBasketChange: jest.fn(), onDone: jest.fn(), onBack: jest.fn(), ...overrides });
}

describe("individual market visits", () => {
  test.each(MARKET_SECTIONS)("$title shows only its own market", (market) => {
    const text = textOf(renderMarket({ market }));
    expect(text).toContain(market.title);
    for (const other of MARKET_SECTIONS.filter((section) => section !== market)) {
      expect(text).not.toContain(other.title);
    }
  });

  test("other markets' purchases are hidden but preserved when adding an item", () => {
    const onBasketChange = jest.fn();
    const view = renderMarket({ market: meatMarket, basket: ["shrimp"], onBasketChange });
    expect(textOf(view)).not.toContain("Shrimp");
    const addBeef = findIngredientButton(view, "Beef brisket");
    expect(addBeef).toBeDefined();
    addBeef!();
    expect(onBasketChange).toHaveBeenCalledWith(["shrimp", "beef-brisket"]);
  });

  test("removing a local purchase retains other markets' purchases", () => {
    const onBasketChange = jest.fn();
    const view = renderMarket({ market: meatMarket, basket: ["shrimp", "beef-brisket"], onBasketChange });
    findIngredientButton(view, "Beef brisket")!();
    expect(onBasketChange).toHaveBeenCalledWith(["shrimp"]);
  });

  test("the compact header keeps Home distinct from the midweek Back action", () => {
    const onHome = jest.fn();
    const onBack = jest.fn();
    const view = renderMarket({ market: meatMarket, onHome, onBack, backLabel: "← Back" });
    findIngredientButton(view, "Go to home")!();
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();
    findIngredientButton(view, "← Back")!();
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("Done keeps the full shared basket when viewing one market", () => {
    const onDone = jest.fn();
    const basket = ["shrimp", "beef-brisket"];
    const view = renderMarket({ market: meatMarket, basket, onDone, ctaLabel: "Done →" });
    findIngredientButton(view, "Done →")!();
    expect(onDone).toHaveBeenCalledWith(basket);
  });

  test("the full-market entry still includes every section", () => {
    const text = textOf(renderMarket());
    for (const market of MARKET_SECTIONS) expect(text).toContain(market.title);
  });
});
