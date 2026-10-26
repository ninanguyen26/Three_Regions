import type { ImageSourcePropType } from "react-native";

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
