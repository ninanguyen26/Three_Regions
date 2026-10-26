import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Platform, Pressable, SafeAreaView, StyleSheet, useWindowDimensions, View, type ImageSourcePropType } from "react-native";
import Text from "../components/AppText";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { INGREDIENT_ART } from "../data/ingredientArt";
import { MARKET_ART } from "../data/marketArt";
import type { MarketSection } from "../data/markets";
import { colors, fonts } from "../theme";
import { buildMarketList, initialMarketItems, marketColumns, type MarketListItem } from "../rendering/marketLayout";
import { imageKey } from "../rendering/prepareImages";
import { marketSceneAssets } from "../rendering/sceneAssets";

const uiFont = Platform.select({ ios: "System", android: "sans-serif", default: "system-ui" });
const ignoreImage = (_source: ImageSourcePropType) => {};
const itemKey = (item: MarketListItem) => item.key;
const ingredientKey = (id: string) => id;
const basketLayout = (_data: unknown, index: number) => ({ length: 52, offset: 4 + index * 52, index });

type MarketProps = {
  onDone: (basket: string[]) => void;
  onBack: () => void;
  onHome?: () => void;
  basket: string[];
  onBasketChange: (basket: string[]) => void;
  market?: MarketSection;
  ctaLabel?: string;
  backLabel?: string;
};

type IngredientProps = {
  id: string;
  selected: boolean;
  onToggle: (id: string) => void;
  onImageReady: (source: ImageSourcePropType) => void;
};

export function IngredientCardView({ id, selected, onToggle, onImageReady }: IngredientProps) {
  const ingredient = INGREDIENT_BY_ID[id];
  if (!ingredient) return null;
  const art = INGREDIENT_ART[id];
  const imageReady = () => { if (art) onImageReady(art); };
  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={ingredient.name} accessibilityState={{ checked: selected }} onPress={() => onToggle(id)}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}>
      <View style={styles.ingredientArt}>
        {art ? <Image source={art} resizeMode="contain" style={styles.ingredientImage} onLoad={imageReady} onError={imageReady} accessible={false} /> : <Text style={styles.initial}>{ingredient.name[0]}</Text>}
      </View>
      <Text style={styles.ingredientName} numberOfLines={3}>{ingredient.name}</Text>
      {selected && <View style={styles.check} pointerEvents="none"><Text style={styles.checkText}>✓</Text></View>}
    </Pressable>
  );
}
const IngredientCard = memo(IngredientCardView);

export function BasketItemView({ id, onToggle, onImageReady }: Omit<IngredientProps, "selected">) {
  const ingredient = INGREDIENT_BY_ID[id];
  if (!ingredient) return null;
  const art = INGREDIENT_ART[id];
  const imageReady = () => { if (art) onImageReady(art); };
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${ingredient.name} from basket`} onPress={() => onToggle(id)} style={({ pressed }) => [styles.basketItem, pressed && styles.pressed]}>
      {art ? <Image source={art} resizeMode="contain" style={styles.basketImage} onLoad={imageReady} onError={imageReady} accessible={false} /> : <Text style={styles.basketInitial}>{ingredient.name[0]}</Text>}
      <Text style={styles.remove} accessible={false}>×</Text>
    </Pressable>
  );
}
const BasketItem = memo(BasketItemView);

// The controller owns selection updates; unchanged cards receive stable props.
export default function MarketScreen(props: MarketProps) {
  const { width, height } = useWindowDimensions();
  const columns = marketColumns(width, height);
  const [basket, setBasket] = useState(props.basket);
  const basketRef = useRef(props.basket);
  const initialBasket = useRef(props.basket);
  const [ready, setReady] = useState(false);
  const loaded = useRef(new Set<string>());
  const mounted = useRef(true);
  const items = useMemo(() => buildMarketList(props.market, columns), [props.market, columns]);
  const sources = useMemo(() => marketSceneAssets(props.market, initialBasket.current, width, height), [props.market, width, height]);
  const required = useMemo(() => new Set(sources.map(imageKey)), [sources]);

  useEffect(() => {
    basketRef.current = props.basket;
    setBasket(props.basket);
  }, [props.basket]);

  useLayoutEffect(() => {
    mounted.current = true;
    const alreadyReady = Array.from(required).every((key) => loaded.current.has(key));
    setReady(alreadyReady);
    // A failing or delayed native image must never trap the player on loading.
    const timeout = setTimeout(() => { if (mounted.current) setReady(true); }, 1800);
    return () => { mounted.current = false; clearTimeout(timeout); };
  }, [required]);

  const onImageReady = useCallback((source: ImageSourcePropType) => {
    if (!mounted.current) return;
    loaded.current.add(imageKey(source));
    if (Array.from(required).every((key) => loaded.current.has(key))) setReady(true);
  }, [required]);

  const toggle = useCallback((id: string) => {
    const current = basketRef.current;
    const next = current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id];
    basketRef.current = next;
    setBasket(next);
    props.onBasketChange(next);
  }, [props.onBasketChange]);

  return <MarketScreenView {...props} basket={basket} columns={columns} items={items} viewportHeight={height} viewportWidth={width} onToggle={toggle} onImageReady={onImageReady} ready={ready} />;
}

type MarketViewProps = MarketProps & {
  columns?: number;
  items?: MarketListItem[];
  viewportHeight?: number;
  viewportWidth?: number;
  onToggle?: (id: string) => void;
  onImageReady?: (source: ImageSourcePropType) => void;
  ready?: boolean;
};

export function MarketScreenView({ onDone, onBack, onHome = onBack, basket, onBasketChange, market, ctaLabel, backLabel,
  columns = 4, items = buildMarketList(market, columns), viewportHeight = 390, viewportWidth = 844,
  onToggle, onImageReady = ignoreImage, ready = true }: MarketViewProps) {
  const marketIds = market ? new Set(market.subsections.flatMap((section) => section.ids)) : null;
  const visibleBasket = marketIds ? basket.filter((id) => marketIds.has(id)) : basket;
  const selected = new Set(basket);
  const shopArt = MARKET_ART[market?.title ?? "Grocery"];
  const toggle = onToggle ?? ((id: string) => onBasketChange(basket.includes(id) ? basket.filter((entry) => entry !== id) : [...basket, id]));
  const renderItem = ({ item }: { item: MarketListItem }) => {
    if (item.kind === "space") return <View style={{ height: item.height }} />;
    if (item.kind === "heading") return <View style={{ height: item.height, justifyContent: "center" }}><Text style={item.level === 1 ? styles.section : styles.subSection}>{item.title}</Text></View>;
    return (
      <View style={styles.row}>
        <View style={styles.grid}>
          {item.ids.map((id) => <IngredientCard key={id} id={id} selected={selected.has(id)} onToggle={toggle} onImageReady={onImageReady} />)}
          {Array.from({ length: columns - item.ids.length }, (_, index) => <View key={`space-${index}`} style={styles.spacer} />)}
        </View>
      </View>
    );
  };
  const loadedHeader = () => onImageReady(shopArt.icon);
  const loadedBasket = () => onImageReady(MARKET_ART.Grocery.icon);
  return (
    <View style={styles.root}>
      <View style={styles.shop}>
        <View style={styles.headerSurface}>
          <SafeAreaView>
            <View style={styles.header}>
              <Image source={shopArt.icon} resizeMode="contain" style={styles.marketIcon} onLoad={loadedHeader} onError={loadedHeader} accessible={false} />
              <Text accessibilityRole="header" style={styles.title}>{market?.title ?? "The Market"}</Text>
              {backLabel && <Pressable accessibilityRole="button" onPress={onBack} hitSlop={8} style={styles.backButton}><Text style={styles.back}>{backLabel}</Text></Pressable>}
              <Pressable accessibilityRole="button" accessibilityLabel="Go to home" onPress={onHome} hitSlop={8} style={styles.backButton}><Text style={styles.back}>← Home</Text></Pressable>
            </View>
          </SafeAreaView>
        </View>
        <SafeAreaView style={styles.catalogSafeArea}>
          <View style={[styles.catalog, { opacity: ready ? 1 : 0 }]} pointerEvents={ready ? "auto" : "none"}>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={itemKey}
              extraData={basket}
              initialNumToRender={initialMarketItems(items, viewportHeight)}
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={32}
              windowSize={3}
              removeClippedSubviews={false}
              getItemLayout={(_data, index) => ({ length: items[index].height, offset: items[index].offset, index })}
              contentContainerStyle={styles.content}
              style={styles.catalog}
            />
          </View>
          {!ready && <View style={styles.loading} accessibilityLabel="Loading market"><ActivityIndicator color={colors.secondary} /></View>}
        </SafeAreaView>
      </View>
      <View style={styles.traySurface}>
        <SafeAreaView>
          <View style={styles.tray}>
            <View style={styles.basketLabel}>
              <Image source={MARKET_ART.Grocery.icon} resizeMode="contain" style={styles.basketIcon} onLoad={loadedBasket} onError={loadedBasket} accessible={false} />
              <Text style={styles.basketTitle}>Total · {visibleBasket.length} items</Text>
            </View>
            <FlatList
              horizontal data={visibleBasket} keyExtractor={ingredientKey}
              renderItem={({ item }) => <BasketItem id={item} onToggle={toggle} onImageReady={onImageReady} />}
              initialNumToRender={Math.ceil(viewportWidth / 52)} maxToRenderPerBatch={8} windowSize={3}
              getItemLayout={basketLayout}
              ListEmptyComponent={<Text style={styles.basketEmpty}>Tap ingredients to add them.</Text>}
              style={styles.basketScroll} contentContainerStyle={styles.basketItems} showsHorizontalScrollIndicator={false}
            />
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.cta, pressed && styles.pressed]} onPress={() => onDone(basket)}><Text style={styles.ctaText}>{ctaLabel ?? "Start cooking →"}</Text></Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE3" },
  shop: { flex: 1, minHeight: 0 },
  headerSurface: { backgroundColor: "#FFFCF5", borderBottomWidth: 1, borderBottomColor: "#DDD5C3" },
  catalogSafeArea: { flex: 1, minHeight: 0 },
  traySurface: { backgroundColor: "#FFFCF5", borderTopWidth: 1, borderTopColor: "#DDD5C3" },
  header: { minHeight: 52, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 10, backgroundColor: "#FFFCF5" },
  marketIcon: { width: 28, height: 28 },
  title: { flex: 1, color: colors.text, fontFamily: uiFont, fontWeight: "700", fontSize: 19 },
  backButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  back: { color: colors.accent, fontFamily: uiFont, fontWeight: "600", fontSize: 14 },
  catalog: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  loading: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#F4EFE3" },
  section: { color: colors.text, fontFamily: uiFont, fontWeight: "700", fontSize: 17, marginBottom: 10 },
  sectionGroup: { marginBottom: 14 },
  subSection: { color: colors.muted, fontFamily: uiFont, fontWeight: "600", fontSize: 13, marginBottom: 8 },
  row: { height: 76 },
  grid: { flexDirection: "row", gap: 10 },
  spacer: { flex: 1 },
  card: { flex: 1, height: 68, padding: 8, gap: 8, flexDirection: "row", alignItems: "center", backgroundColor: "#FFFCF5", borderWidth: 1, borderColor: "#DDD5C3", borderRadius: 10 },
  cardSelected: { backgroundColor: "#EDF3E9", borderColor: colors.secondary },
  ingredientArt: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  ingredientImage: { width: "100%", height: "100%" },
  initial: { color: colors.muted, fontFamily: uiFont, fontWeight: "600", fontSize: 26 },
  ingredientName: { flex: 1, color: colors.text, fontFamily: uiFont, fontWeight: "500", fontSize: 13, lineHeight: 16 },
  check: { position: "absolute", left: 3, top: 3, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.onSecondary, fontFamily: uiFont, fontSize: 11, fontWeight: "700" },
  tray: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: "#FFFCF5" },
  basketLabel: { flexDirection: "row", alignItems: "center", gap: 4 },
  basketIcon: { width: 24, height: 24 },
  basketTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontWeight: "600", fontSize: 13 },
  basketScroll: { flex: 1, height: 48 },
  basketItems: { alignItems: "center", gap: 8, paddingHorizontal: 4 },
  basketEmpty: { color: colors.muted, fontFamily: uiFont, fontSize: 13, maxWidth: 220 },
  basketItem: { width: 44, height: 44, padding: 3, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#DDD5C3", borderRadius: 8, backgroundColor: "#F4EFE3" },
  basketImage: { width: 36, height: 36 },
  basketInitial: { color: colors.muted, fontFamily: uiFont, fontSize: 24 },
  remove: { position: "absolute", top: -3, right: -1, color: colors.bad, fontFamily: uiFont, fontSize: 16, fontWeight: "700" },
  cta: { maxWidth: 150, minHeight: 32, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  ctaText: { color: colors.onPrimary, fontFamily: uiFont, fontWeight: "600", fontSize: 15, textAlign: "center" },
  pressed: { opacity: 0.65 },
});
