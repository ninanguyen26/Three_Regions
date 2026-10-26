import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View, type ImageSourcePropType, type LayoutChangeEvent } from "react-native";
import Text from "../components/AppText";
import HomeIcon from "../components/HomeIcon";
import SceneReveal from "../components/SceneReveal";
import { INGREDIENT_BY_ID } from "../data/ingredients";
import { INGREDIENT_ART } from "../data/ingredientArt";
import { MARKET_ART, MARKET_BACKGROUND, MARKET_STALL_ART, MARKET_RECEIPT_ART } from "../data/marketArt";
import type { MarketSection } from "../data/markets";
import { colors, fonts } from "../theme";
import { buildMarketTabList, initialMarketItems, marketColumns, marketSceneLayout, MARKET_ROW_HEIGHT, type MarketListItem } from "../rendering/marketLayout";
import { imageKey } from "../rendering/prepareImages";
import { marketSceneAssets } from "../rendering/sceneAssets";
import { changeQuantity, type Quantities } from "../game/inventory";

const uiFont = Platform.select({ ios: "System", android: "sans-serif", default: "system-ui" });
const ignoreImage = (_source: ImageSourcePropType) => {};
const itemKey = (item: MarketListItem) => item.key;
const ingredientKey = (id: string) => id;

type MarketProps = {
  onDone: () => void;
  onBack: () => void;
  onHome?: () => void;
  inventory: Quantities;
  cart: Quantities;
  onCartChange: (cart: Quantities) => void;
  market?: MarketSection;
  ctaLabel?: string;
  backLabel?: string;
};

type IngredientProps = {
  id: string;
  selected: boolean;
  stock: number;
  quantity: number;
  onQuantityChange: (id: string, delta: number) => void;
  onImageReady: (source: ImageSourcePropType) => void;
};

export function IngredientCardView({ id, selected, stock, quantity, onQuantityChange, onImageReady }: IngredientProps) {
  const ingredient = INGREDIENT_BY_ID[id];
  if (!ingredient) return null;
  const art = INGREDIENT_ART[id];
  const imageReady = () => { if (art) onImageReady(art); };
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Text style={styles.stockBadge}>{stock} in stock</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={ingredient.name}
        accessibilityHint="Add one portion to receipt" accessibilityValue={{ text: `${stock} in stock, ${quantity} on receipt` }}
        onPress={() => onQuantityChange(id, 1)} style={({ pressed }) => [styles.counterAdd, pressed && styles.pressed]}>
        <View style={styles.ingredientArt}>
          {art ? <Image source={art} resizeMode="contain" style={styles.ingredientImage} onLoad={imageReady} onError={imageReady} accessible={false} /> : <Text style={styles.initial}>{ingredient.name[0]}</Text>}
        </View>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
      </Pressable>
      <View style={styles.counterQuantityControls}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${ingredient.name} on counter`}
          accessibilityState={{ disabled: quantity === 0 }} disabled={quantity === 0}
          onPress={() => onQuantityChange(id, -1)} style={[styles.quantityButton, quantity === 0 && styles.quantityDisabled]}>
          <Text style={styles.quantitySign}>−</Text>
        </Pressable>
        <Text style={styles.quantityNumber} accessibilityLabel={`${quantity} portions on receipt`}>{quantity}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${ingredient.name} on counter`}
          onPress={() => onQuantityChange(id, 1)} style={styles.quantityButton}>
          <Text style={styles.quantitySign}>+</Text>
        </Pressable>
      </View>
      {selected && <View style={styles.check} pointerEvents="none"><Text style={styles.checkText}>✓</Text></View>}
    </View>
  );
}
const IngredientCard = memo(IngredientCardView);

export function BasketItemView({ id, quantity, onQuantityChange, onImageReady }: {
  id: string;
  quantity: number;
  onQuantityChange: (id: string, delta: number) => void;
  onImageReady: (source: ImageSourcePropType) => void;
}) {
  const ingredient = INGREDIENT_BY_ID[id];
  if (!ingredient) return null;
  const art = INGREDIENT_ART[id];
  const imageReady = () => { if (art) onImageReady(art); };
  return (
    <View style={styles.basketItem}>
      <View style={styles.basketArt}>
        {art ? <Image source={art} resizeMode="contain" style={styles.basketImage} onLoad={imageReady} onError={imageReady} accessible={false} /> : <Text style={styles.basketInitial}>{ingredient.name[0]}</Text>}
      </View>
      <View style={styles.receiptItemDetails}>
        <Text style={styles.receiptItemName} numberOfLines={1} ellipsizeMode="tail">{ingredient.name}</Text>
        <View style={styles.receiptQuantityRow}>
          <View style={styles.quantityControls}>
            <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${ingredient.name}`} hitSlop={4} onPress={() => onQuantityChange(id, -1)} style={styles.quantityButton}><Text style={styles.quantitySign}>−</Text></Pressable>
            <Text style={styles.quantityNumber} accessibilityLabel={`${quantity} portions of ${ingredient.name}`}>{quantity}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${ingredient.name}`} hitSlop={4} onPress={() => onQuantityChange(id, 1)} style={styles.quantityButton}><Text style={styles.quantitySign}>+</Text></Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
const BasketItem = memo(BasketItemView);

// The controller owns selection updates; unchanged cards receive stable props.
export default function MarketScreen(props: MarketProps) {
  const { width, height } = useWindowDimensions();
  const [sceneSize, setSceneSize] = useState({ width: width - 24, height: height - 60 });
  const [tabSelection, setTabSelection] = useState({ market: props.market, index: 0 });
  const activeSubsection = tabSelection.market === props.market ? tabSelection.index : 0;
  const onSubsectionChange = useCallback((index: number) => setTabSelection({ market: props.market, index }), [props.market]);
  const hasTabs = props.market?.subsections.some((section) => section.title) ?? false;
  const stallLayout = marketSceneLayout(sceneSize.width, sceneSize.height - (hasTabs ? 32 : 0));
  const columns = marketColumns(stallLayout.counterWidth, stallLayout.counterHeight);
  const onSceneLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setSceneSize((current) => current.width === layout.width && current.height === layout.height
      ? current : { width: layout.width, height: layout.height });
  }, []);
  const [cart, setCart] = useState(props.cart);
  const cartRef = useRef(props.cart);
  const receiptListRef = useRef<FlatList<string>>(null);
  const receiptScrollPending = useRef(false);
  const onReceiptContentSizeChange = useCallback(() => {
    if (!receiptScrollPending.current) return;
    receiptScrollPending.current = false;
    receiptListRef.current?.scrollToEnd({ animated: true });
  }, []);
  const initialCart = useRef(Object.keys(props.cart));
  const [ready, setReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const loaded = useRef(new Set<string>());
  const mounted = useRef(true);
  const items = useMemo(() => buildMarketTabList(props.market, columns, activeSubsection), [props.market, columns, activeSubsection]);
  const sources = useMemo(() => marketSceneAssets(props.market, initialCart.current, width, height, columns, stallLayout.counterHeight, activeSubsection), [props.market, width, height, columns, stallLayout.counterHeight, activeSubsection]);
  const required = useMemo(() => new Set(sources.map(imageKey)), [sources]);

  useEffect(() => {
    cartRef.current = props.cart;
    setCart(props.cart);
  }, [props.cart]);

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

  useEffect(() => { if (ready) setSceneReady(true); }, [ready]);

  const onQuantityChange = useCallback((id: string, delta: number) => {
    const next = changeQuantity(cartRef.current, id, delta);
    if (!(cartRef.current[id] > 0) && next[id] > 0) receiptScrollPending.current = true;
    cartRef.current = next;
    setCart(next);
    props.onCartChange(next);
  }, [props.onCartChange]);

  return <SceneReveal ready={sceneReady}><MarketScreenView {...props} cart={cart} columns={columns} items={items} viewportHeight={height} viewportWidth={width} onQuantityChange={onQuantityChange} onImageReady={onImageReady} ready={ready} activeSubsection={activeSubsection} onSubsectionChange={onSubsectionChange} stallLayout={stallLayout} onSceneLayout={onSceneLayout} receiptListRef={receiptListRef} onReceiptContentSizeChange={onReceiptContentSizeChange} /></SceneReveal>;
}

type MarketViewProps = MarketProps & {
  receiptListRef?: React.RefObject<FlatList<string> | null>;
  onReceiptContentSizeChange?: () => void;
  activeSubsection?: number;
  onSubsectionChange?: (index: number) => void;
  columns?: number;
  items?: MarketListItem[];
  viewportHeight?: number;
  viewportWidth?: number;
  onQuantityChange?: (id: string, delta: number) => void;
  onImageReady?: (source: ImageSourcePropType) => void;
  ready?: boolean;
  stallLayout?: ReturnType<typeof marketSceneLayout>;
  onSceneLayout?: (event: LayoutChangeEvent) => void;
};

export function MarketScreenView({ onDone, onBack, onHome = onBack, inventory, cart, onCartChange, market, ctaLabel, backLabel,
  receiptListRef, onReceiptContentSizeChange,
  viewportHeight = 390, viewportWidth = 844, activeSubsection = 0, onSubsectionChange,
  stallLayout = marketSceneLayout(viewportWidth - 24, viewportHeight - 60 - (market?.subsections.some((section) => section.title) ? 32 : 0)),
  columns = marketColumns(stallLayout.counterWidth, stallLayout.counterHeight), items = buildMarketTabList(market, columns, activeSubsection), onSceneLayout,
  onQuantityChange, onImageReady = ignoreImage, ready = true }: MarketViewProps) {
  const hasTabs = market?.subsections.some((section) => section.title) ?? false;
  const marketIds = market ? new Set(market.subsections.flatMap((section) => section.ids)) : null;
  const receiptIds = Object.keys(cart).filter((id) => !marketIds || marketIds.has(id));
  const selected = new Set(Object.keys(cart));
  const shopArt = MARKET_ART[market?.title ?? "Grocery"];
  const stallArt = MARKET_STALL_ART[market?.title ?? "Grocery"];
  const change = onQuantityChange ?? ((id: string, delta: number) => onCartChange(changeQuantity(cart, id, delta)));
  const renderItem = ({ item }: { item: MarketListItem }) => {
    if (item.kind === "space") return <View style={{ height: item.height }} />;
    if (item.kind === "heading") return <View style={{ height: item.height, justifyContent: "center" }}><Text style={item.level === 1 ? styles.section : styles.subSection}>{item.title}</Text></View>;
    return (
      <View style={styles.row}>
        <View style={styles.grid}>
          {item.ids.map((id) => <IngredientCard key={id} id={id} selected={selected.has(id)} stock={inventory[id] ?? 0} quantity={cart[id] ?? 0} onQuantityChange={change} onImageReady={onImageReady} />)}
          {Array.from({ length: columns - item.ids.length }, (_, index) => <View key={`space-${index}`} style={styles.spacer} />)}
        </View>
      </View>
    );
  };
  const loadedHeader = () => onImageReady(shopArt.icon);
  return (
    <ImageBackground source={MARKET_BACKGROUND} resizeMode="stretch" style={styles.root} imageStyle={styles.mapBackdrop}
      onLoad={() => onImageReady(MARKET_BACKGROUND)} onError={() => onImageReady(MARKET_BACKGROUND)}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image source={shopArt.icon} resizeMode="contain" style={styles.marketIcon} onLoad={loadedHeader} onError={loadedHeader} accessible={false} />
          <Text accessibilityRole="header" style={styles.title}>{market?.title ?? "The Market"}</Text>
          {backLabel && <Pressable accessibilityRole="button" onPress={onBack} hitSlop={8} style={styles.backButton}><Text style={styles.back}>{backLabel}</Text></Pressable>}
          <Pressable accessibilityRole="button" accessibilityLabel="Go to home" onPress={onHome} hitSlop={8} style={styles.backButton}><HomeIcon /></Pressable>
        </View>
        <View style={[styles.marketLayout, hasTabs && styles.marketLayoutTabs]} onLayout={onSceneLayout}>
          <View style={[styles.shop, { width: stallLayout.width, height: stallLayout.height }]}>
            <View style={styles.scene}>
              <ImageBackground source={stallArt} resizeMode="contain" style={[styles.stall, { width: stallLayout.width, height: stallLayout.height }]}
                onLoad={() => onImageReady(stallArt)} onError={() => onImageReady(stallArt)}>
                <View style={styles.counter}>
                  <SceneReveal ready={ready}>
                    <FlatList
                      key={`${market?.title ?? "all"}:${activeSubsection}`}
                      data={items}
                      renderItem={renderItem}
                      keyExtractor={itemKey}
                      extraData={[cart, inventory]}
                      initialNumToRender={initialMarketItems(items, stallLayout.counterHeight + 112)}
                      maxToRenderPerBatch={3}
                      updateCellsBatchingPeriod={32}
                      windowSize={3}
                      removeClippedSubviews={false}
                      getItemLayout={(_data, index) => ({ length: items[index].height, offset: items[index].offset, index })}
                      contentContainerStyle={styles.content}
                      style={styles.catalog}
                    />
                  </SceneReveal>
                </View>
                {hasTabs && <ScrollView horizontal accessibilityRole="tablist" accessibilityLabel="Shop sections"
                  style={styles.tabs} contentContainerStyle={styles.tabItems} showsHorizontalScrollIndicator={false}>
                  {market!.subsections.map((section, index) => <Pressable key={section.title ?? index}
                    accessibilityRole="tab" accessibilityLabel={section.title ?? "All items"}
                    accessibilityState={{ selected: activeSubsection === index }}
                    onPress={() => onSubsectionChange?.(index)}
                    style={({ pressed }) => [styles.tab, activeSubsection === index && styles.tabSelected, pressed && styles.pressed]}>
                    <Text style={[styles.tabText, activeSubsection === index && styles.tabTextSelected]}>{section.title ?? "All items"}</Text>
                  </Pressable>)}
                </ScrollView>}
              </ImageBackground>
            </View>
          </View>
          <ImageBackground source={MARKET_RECEIPT_ART} resizeMode="contain" style={[styles.receipt, { width: stallLayout.receiptWidth, height: stallLayout.height }]}
            onLoad={() => onImageReady(MARKET_RECEIPT_ART)} onError={() => onImageReady(MARKET_RECEIPT_ART)}>
            <View style={styles.receiptContent}>
              <Text accessibilityRole="header" style={styles.receiptTitle}>RECEIPT</Text>
              <FlatList
                ref={receiptListRef}
                onContentSizeChange={onReceiptContentSizeChange}
                data={receiptIds} keyExtractor={ingredientKey}
                renderItem={({ item }) => <BasketItem id={item} quantity={cart[item]} onQuantityChange={change} onImageReady={onImageReady} />}
                ItemSeparatorComponent={() => <View style={styles.basketDivider} />}
                initialNumToRender={Math.ceil(viewportHeight / 44)} maxToRenderPerBatch={8} windowSize={3}
                ListEmptyComponent={<Text style={styles.basketEmpty}>Tap ingredients on the counter to add them.</Text>}
                style={styles.basketScroll} contentContainerStyle={styles.basketItems} showsVerticalScrollIndicator={false}
              />
              <Pressable accessibilityRole="button" style={({ pressed }) => [styles.cta, pressed && styles.pressed]} onPress={onDone}><Text style={styles.ctaText}>{ctaLabel ?? "Start cooking →"}</Text></Pressable>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE3" },
  mapBackdrop: { opacity: 0.55 },
  marketLayout: { flex: 1, minHeight: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 12, marginBottom: 8 },
  marketLayoutTabs: { paddingBottom: 32 },
  tabs: { position: "absolute", left: "7%", right: "7%", top: "93.25%", height: 44 },
  tabItems: { alignItems: "flex-start", gap: 3, paddingHorizontal: 2 },
  tab: { minHeight: 24, maxWidth: 200, paddingHorizontal: 12, paddingVertical: 2, backgroundColor: "#D9C4A5", borderWidth: 2, borderTopWidth: 0, borderColor: "#604637", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent: "center" },
  tabSelected: { backgroundColor: "#F6EBD5" },
  tabText: { color: "#604637", fontFamily: fonts.bodySemi, fontSize: 12, lineHeight: 15, textAlign: "center" },
  tabTextSelected: { color: "#483125", fontFamily: fonts.bodyBold },
  shop: { minWidth: 0, minHeight: 0 },
  receipt: { minWidth: 0 },
  receiptContent: { flex: 1, minHeight: 0, marginHorizontal: "10%", marginTop: "14%", marginBottom: "14%", gap: 8 },
  receiptTitle: { color: colors.text, fontFamily: fonts.bodyBold, fontWeight: "700", fontSize: 16, letterSpacing: 2, textAlign: "center" },
  safeArea: { flex: 1 },
  scene: { flex: 1, minHeight: 0, alignItems: "center", justifyContent: "center" },
  stall: { position: "relative" },
  // All five stall assets share this counter opening, inside the wooden frame.
  counter: { position: "absolute", left: "6.5%", right: "6%", top: "42%", bottom: "14%", overflow: "hidden" },
  header: { minHeight: 44, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 10 },
  marketIcon: { width: 28, height: 28 },
  title: { flex: 1, color: colors.text, fontFamily: uiFont, fontWeight: "700", fontSize: 19 },
  backButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: 8 },
  back: { color: colors.accent, fontFamily: uiFont, fontWeight: "600", fontSize: 14 },
  catalog: { flex: 1 },
  content: { paddingHorizontal: 4, paddingTop: 2, paddingBottom: 8 },
  loading: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center", backgroundColor: "#F4E3CB" },
  section: { color: colors.text, fontFamily: uiFont, fontWeight: "700", fontSize: 17, marginBottom: 10 },
  sectionGroup: { marginBottom: 14 },
  subSection: { color: colors.muted, fontFamily: uiFont, fontWeight: "600", fontSize: 13, marginBottom: 8 },
  row: { height: MARKET_ROW_HEIGHT },
  grid: { flexDirection: "row", gap: 4 },
  spacer: { flex: 1 },
  card: { flex: 1, backgroundColor: colors.onSecondary, height: 140, paddingTop: 16, paddingHorizontal: 5, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 2, borderColor: "transparent" },
  counterAdd: { alignItems: "center", alignSelf: "stretch" },
  counterQuantityControls: { flexDirection: "row", alignItems: "center", marginTop: 1 },
  quantityDisabled: { opacity: 0.35 },
  cardSelected: { borderColor: colors.accent },
  ingredientArt: { width: 64, height: 64, alignItems: "center", justifyContent: "center" },
  ingredientImage: { width: "100%", height: "100%" },
  initial: { color: colors.muted, fontFamily: uiFont, fontWeight: "600", fontSize: 26 },
  ingredientName: { color: colors.text, fontFamily: uiFont, fontWeight: "400", fontSize: 10, lineHeight: 12, textAlign: "center" },
  stockBadge: { position: "absolute", top: 2, left: 5, color: colors.text, fontFamily: fonts.body, fontSize: 10, lineHeight: 13, zIndex: 1 },
  check: { position: "absolute", right: 3, top: 3, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" },
  checkText: { color: colors.onSecondary, fontFamily: uiFont, fontSize: 11, fontWeight: "700" },
  basketScroll: { flex: 1, minHeight: 0 },
  basketItems: { paddingVertical: 2 },
  basketDivider: { height: 1, backgroundColor: "#C9B394", marginVertical: 4 },
  basketEmpty: { color: colors.muted, fontFamily: uiFont, fontSize: 12, lineHeight: 17, textAlign: "center", paddingTop: 12 },
  basketItem: { flexDirection: "row", alignItems: "stretch", paddingVertical: 5, gap: 6 },
  basketArt: { width: "25%", maxWidth: 48, minHeight: 48, alignItems: "center", justifyContent: "center" },
  receiptItemDetails: { flex: 1, minWidth: 0, gap: 2, justifyContent: "center" },
  receiptItemName: { color: colors.text, fontFamily: uiFont, fontSize: 11, lineHeight: 12 },
  receiptQuantityRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end" },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  quantityButton: { width: 32, minHeight: 27, alignItems: "center", justifyContent: "center" },
  quantitySign: { color: colors.accent, fontFamily: uiFont, fontWeight: "700", fontSize: 16 },
  quantityNumber: { minWidth: 20, textAlign: "center", color: colors.text, fontFamily: uiFont, fontWeight: "700", fontSize: 12 },
  basketImage: { position: "absolute", width: "100%", height: "100%", top: 0, left: 0 },
  basketInitial: { color: colors.muted, fontFamily: uiFont, fontSize: 24 },
  remove: { color: colors.bad, fontFamily: uiFont, fontSize: 18, fontWeight: "700" },
  cta: { alignSelf: "stretch", minHeight: 32, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  ctaText: { color: colors.onPrimary, fontFamily: uiFont, fontWeight: "600", fontSize: 13, textAlign: "center" },
  pressed: { opacity: 0.65 },
});
