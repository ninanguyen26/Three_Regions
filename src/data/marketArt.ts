import type { ImageSourcePropType } from "react-native";

export const MARKET_BACKGROUND: ImageSourcePropType = require("../../assets/runtime/tampa-bay-flat-map-inland-v4.png");
export const MARKET_RECEIPT_ART: ImageSourcePropType = require("../../assets/runtime/blank-receipt-paper.png");

export const MARKET_STALL_ART: Record<string, ImageSourcePropType> = {
  "Grocery": require("../../assets/runtime/grocery-store-buildings/corner-grocery-stall.png"),
  "Produce market": require("../../assets/runtime/grocery-store-buildings/fresh-produce-stall.png"),
  "Meat market": require("../../assets/runtime/grocery-store-buildings/meat-market-stall.png"),
  "Seafood market": require("../../assets/runtime/grocery-store-buildings/seafood-market-stall.png"),
  "Vietnamese specialty": require("../../assets/runtime/grocery-store-buildings/sai-gon-market-stall.png"),
};

export const MARKET_ART: Record<string, { building: ImageSourcePropType; icon: ImageSourcePropType }> = {
  "Meat market": {
    building: require("../../assets/runtime/grocery-store-buildings/grocery-01-cream-coral.png"),
    icon: require("../../assets/runtime/store-icons/meat-tbone-steak.png"),
  },
  "Seafood market": {
    building: require("../../assets/runtime/grocery-store-buildings/grocery-03-blue-gold.png"),
    icon: require("../../assets/runtime/store-icons/seafood-raw-shrimp.png"),
  },
  "Produce market": {
    building: require("../../assets/runtime/grocery-store-buildings/grocery-04-mint-rust.png"),
    icon: require("../../assets/runtime/store-icons/produce-carrot.png"),
  },
  "Grocery": {
    building: require("../../assets/runtime/grocery-store-buildings/grocery-02-peach-teal.png"),
    icon: require("../../assets/runtime/store-icons/grocery-shopping-cart.png"),
  },
  "Vietnamese specialty": {
    building: require("../../assets/runtime/grocery-store-buildings/grocery-05-apricot-blue.png"),
    icon: require("../../assets/runtime/store-icons/vietnamese-fish-sauce.png"),
  },
};
