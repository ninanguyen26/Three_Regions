import type { ImageSourcePropType } from "react-native";
import type { MarketSection } from "../data/markets";
import { MARKET_ART, MARKET_BACKGROUND, MARKET_STALL_ART, MARKET_RECEIPT_ART } from "../data/marketArt";
import { INGREDIENT_ART } from "../data/ingredientArt";
import { buildMarketTabList, initialMarketItems, marketColumns, marketSceneLayout } from "./marketLayout";

export const HOME_ASSETS: ImageSourcePropType[] = [
  require("../../assets/runtime/tampa-bay-flat-map-inland-v4.png"),
  require("../../assets/runtime/restaurant-building.png"),
  require("../../assets/runtime/ui/recipes.png"),
  require("../../assets/runtime/ui/guests.png"),
  require("../../assets/runtime/ui/menu.png"),
  ...Object.values(MARKET_ART).flatMap((art) => [art.building, art.icon]),
];

export function marketSceneAssets(market: MarketSection | undefined, receiptIds: string[], width: number, height: number, columns = marketColumns(marketSceneLayout(width - 24, height - 60).counterWidth, height), counterHeight = marketSceneLayout(width - 24, height - 60).counterHeight, subsectionIndex = 0): ImageSourcePropType[] {
  const items = buildMarketTabList(market, columns, subsectionIndex);
  const ids = items.slice(0, initialMarketItems(items, counterHeight + 112)).flatMap((item) => item.kind === "ingredients" ? item.ids : []);
  const marketIds = market ? new Set(market.subsections.flatMap((sub) => sub.ids)) : null;
  const pendingIds = (marketIds ? receiptIds.filter((id) => marketIds.has(id)) : receiptIds).slice(0, Math.ceil(height / 44));
  return [
    MARKET_BACKGROUND,
    MARKET_RECEIPT_ART,
    MARKET_STALL_ART[market?.title ?? "Grocery"],
    MARKET_ART[market?.title ?? "Grocery"].icon,
    ...[...ids, ...pendingIds].flatMap((id) => INGREDIENT_ART[id] ? [INGREDIENT_ART[id]!] : []),
  ];
}
