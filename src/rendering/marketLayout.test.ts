import { MARKET_SECTIONS } from "../data/markets";
import { buildMarketList, initialMarketItems, marketColumns, marketStallLayout, marketSceneLayout, MARKET_CONTENT_TOP } from "./marketLayout";

describe("virtualized market layout", () => {
  test.each([[643, 315], [820, 330], [1000, 656]])("stall and receipt share a height and fit the %dx%d space", (width, height) => {
    const layout = marketSceneLayout(width, height);
    expect(layout.width + layout.receiptWidth + 8).toBeLessThanOrEqual(width + 0.001);
    expect(layout.height).toBeLessThanOrEqual(height);
    expect(layout.width / (1280 / 720)).toBeCloseTo(layout.receiptWidth / (1024 / 1280));
  });

  test.each([[667, 230], [844, 278], [956, 328], [1024, 656]])("stall and counter fit a %dx%d scene without distorting the art", (width, height) => {
    const layout = marketStallLayout(width, height);
    expect(layout.width).toBeLessThanOrEqual(width);
    expect(layout.height).toBeLessThanOrEqual(height);
    expect(layout.width / layout.height).toBeCloseTo(1280 / 720);
    const columns = marketColumns(layout.counterWidth, layout.counterHeight);
    expect(columns).toBe(3);
  });

  test.each(MARKET_SECTIONS)("$title retains every ingredient exactly once and in shelf order", (market) => {
    const items = buildMarketList(market, 4);
    expect(items.flatMap((item) => item.kind === "ingredients" ? item.ids : [])).toEqual(market.subsections.flatMap((sub) => sub.ids));
  });

  test("the full market preserves all sections and subsection labels", () => {
    const items = buildMarketList(undefined, 4);
    const headings = items.flatMap((item) => item.kind === "heading" ? [item.title] : []);
    for (const market of MARKET_SECTIONS) {
      expect(headings).toContain(market.title);
      for (const sub of market.subsections) if (sub.title) expect(headings).toContain(sub.title);
    }
  });

  test("known row offsets include heading, spacing, and top padding", () => {
    const items = buildMarketList(undefined, 4);
    expect(items[0].offset).toBe(MARKET_CONTENT_TOP);
    for (let i = 1; i < items.length; i++) expect(items[i].offset).toBe(items[i - 1].offset + items[i - 1].height);
  });

  test.each([[667, 375], [956, 440], [1024, 768]])("%dx%d prepares a viewport, not the entire catalog", (width, height) => {
    const columns = marketColumns(width, height);
    const items = buildMarketList(undefined, columns);
    const count = initialMarketItems(items, height);
    expect(count).toBeLessThan(items.length);
    expect(items.slice(0, count).reduce((total, item) => total + item.height, 0)).toBeGreaterThanOrEqual(height - 112);
    for (const item of items) if (item.kind === "ingredients") expect(item.ids.length).toBeLessThanOrEqual(columns);
  });
});
