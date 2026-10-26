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
jest.mock("../../data/marketArt", () => ({
  MARKET_ART: new Proxy({}, { get: () => ({ building: 1, icon: 2 }) }),
  MARKET_BACKGROUND: 3,
  MARKET_RECEIPT_ART: 5,
  MARKET_STALL_ART: new Proxy({}, { get: () => 4 }),
}));
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
  return MarketScreen({ inventory: {}, cart: {}, onCartChange: jest.fn(), onDone: jest.fn(), onBack: jest.fn(), ...overrides });
}

describe("individual market visits", () => {
  test("subsection tabs switch stock without changing the shared basket", () => {
    const market = MARKET_SECTIONS.find((section) => section.title === "Vietnamese specialty")!;
    const onSubsectionChange = jest.fn();
    const view = renderMarket({ market, onSubsectionChange, cart: { "flat-rice-noodle": 2 } });
    findIngredientButton(view, "Bread & flour")!();
    expect(onSubsectionChange).toHaveBeenCalledWith(1);

    const breadView = renderMarket({ market, activeSubsection: 1, cart: { "flat-rice-noodle": 2 } });
    expect(findIngredientButton(breadView, "Vietnamese baguette")).toBeDefined();
    expect(findIngredientButton(breadView, "Fresh flat rice noodles")).toBeUndefined();
    expect(findIngredientButton(breadView, "Decrease Fresh flat rice noodles")).toBeDefined();
  });

  test.each(MARKET_SECTIONS)("$title shows only its own market", (market) => {
    const text = textOf(renderMarket({ market }));
    expect(text).toContain(market.title);
    for (const other of MARKET_SECTIONS.filter((section) => section !== market)) {
      expect(text).not.toContain(other.title);
    }
  });

  test("other markets' purchases are hidden but preserved when adding an item", () => {
    const onCartChange = jest.fn();
    const view = renderMarket({ market: meatMarket, cart: { shrimp: 2 }, onCartChange });
    expect(textOf(view)).not.toContain("Shrimp");
    const addBeef = findIngredientButton(view, "Beef brisket");
    expect(addBeef).toBeDefined();
    addBeef!();
    expect(onCartChange).toHaveBeenCalledWith({ shrimp: 2, "beef-brisket": 1 });
  });

  test("tapping an ingredient again adds a portion and retains other pending purchases", () => {
    const onCartChange = jest.fn();
    const view = renderMarket({ market: meatMarket, cart: { shrimp: 2, "beef-brisket": 1 }, onCartChange });
    findIngredientButton(view, "Beef brisket")!();
    expect(onCartChange).toHaveBeenCalledWith({ shrimp: 2, "beef-brisket": 2 });
  });

  test("removing an item from the receipt retains other markets' purchases", () => {
    const onCartChange = jest.fn();
    const view = renderMarket({ market: meatMarket, cart: { shrimp: 2, "beef-brisket": 1 }, onCartChange });
    findIngredientButton(view, "Decrease Beef brisket")!();
    expect(onCartChange).toHaveBeenCalledWith({ shrimp: 2 });
  });

  test("stock badges count owned portions, while receipt plus and minus edit pending portions", () => {
    const onCartChange = jest.fn();
    const view = renderMarket({ market: meatMarket, inventory: { "beef-brisket": 7 }, cart: { "beef-brisket": 3 }, onCartChange });
    expect(textOf(view)).toContain("7 in stock");
    expect(textOf(view)).not.toContain("Total ·");
    findIngredientButton(view, "Increase Beef brisket")!();
    expect(onCartChange).toHaveBeenLastCalledWith({ "beef-brisket": 4 });
    findIngredientButton(view, "Decrease Beef brisket")!();
    expect(onCartChange).toHaveBeenLastCalledWith({ "beef-brisket": 2 });
  });

  test("counter quantity controls edit the same pending quantities as the receipt", () => {
    const onCartChange = jest.fn();
    const inventory = { "beef-brisket": 7 };
    const view = renderMarket({ market: meatMarket, inventory, cart: { "beef-brisket": 3, shrimp: 2 }, onCartChange });
    findIngredientButton(view, "Increase Beef brisket on counter")!();
    expect(onCartChange).toHaveBeenLastCalledWith({ "beef-brisket": 4, shrimp: 2 });
    findIngredientButton(view, "Decrease Beef brisket on counter")!();
    expect(onCartChange).toHaveBeenLastCalledWith({ "beef-brisket": 2, shrimp: 2 });
    expect(inventory).toEqual({ "beef-brisket": 7 });
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

  test("Done checks out through the controller without changing receipt quantities", () => {
    const onDone = jest.fn();
    const cart = { shrimp: 2, "beef-brisket": 3 };
    const view = renderMarket({ market: meatMarket, cart, onDone, ctaLabel: "Done →" });
    findIngredientButton(view, "Done →")!();
    expect(onDone).toHaveBeenCalledWith();
  });

  test("the full-market entry still includes every section", () => {
    const text = textOf(renderMarket());
    for (const market of MARKET_SECTIONS) expect(text).toContain(market.title);
  });
});
