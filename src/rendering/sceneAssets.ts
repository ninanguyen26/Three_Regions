import type { ImageSourcePropType } from "react-native";
import type { MarketSection } from "../data/markets";
import { MARKET_ART } from "../data/marketArt";
import { INGREDIENT_ART } from "../data/ingredientArt";
import { buildMarketList, initialMarketItems, marketColumns } from "./marketLayout";

export const HOME_ASSETS: ImageSourcePropType[] = [
  require("../../assets/runtime/tampa-bay-flat-map-inland-v4.png"),
  require("../../assets/runtime/restaurant-building.png"),
  require("../../assets/runtime/ui/recipes.png"),
  require("../../assets/runtime/ui/guests.png"),
  require("../../assets/runtime/ui/menu.png"),
  ...Object.values(MARKET_ART).flatMap((art) => [art.building, art.icon]),
];

export function marketSceneAssets(market: MarketSection | undefined, basket: string[], width: number, height: number): ImageSourcePropType[] {
  const items = buildMarketList(market, marketColumns(width, height));
  const ids = items.slice(0, initialMarketItems(items, height)).flatMap((item) => item.kind === "ingredients" ? item.ids : []);
  const marketIds = market ? new Set(market.subsections.flatMap((sub) => sub.ids)) : null;
  const basketIds = (marketIds ? basket.filter((id) => marketIds.has(id)) : basket).slice(0, Math.ceil(width / 52));
  return [
    MARKET_ART[market?.title ?? "Grocery"].icon,
    MARKET_ART.Grocery.icon,
    ...[...ids, ...basketIds].flatMap((id) => INGREDIENT_ART[id] ? [INGREDIENT_ART[id]!] : []),
  ];
}
