import { MARKET_SECTIONS, type MarketSection } from "../data/markets";

export const MARKET_CONTENT_TOP = 10;
export const MARKET_ROW_HEIGHT = 76;
type MarketListContent =
  | { kind: "heading"; key: string; title: string; level: 1 | 2; height: number }
  | { kind: "ingredients"; key: string; ids: string[]; height: number }
  | { kind: "space"; key: string; height: number };

export type MarketListItem = MarketListContent & { offset: number };

export function marketColumns(width: number, height: number): number {
  return Math.max(2, Math.floor((width - (width > height ? 128 : 32)) / 160));
}

export function buildMarketList(market: MarketSection | undefined, columns: number): MarketListItem[] {
  const items: MarketListItem[] = [];
  let offset = MARKET_CONTENT_TOP;
  const append = (item: MarketListContent) => {
    items.push({ ...item, offset });
    offset += item.height;
  };
  for (const section of market ? [market] : MARKET_SECTIONS) {
    if (!market) append({ kind: "heading", key: section.title, title: section.title, level: 1, height: 30 });
    for (const sub of section.subsections) {
      const key = `${section.title}:${sub.title ?? "all"}`;
      if (sub.title) append({ kind: "heading", key: `${key}:heading`, title: sub.title, level: 2, height: 24 });
      for (let start = 0; start < sub.ids.length; start += columns) {
        append({ kind: "ingredients", key: `${key}:${start}`, ids: sub.ids.slice(start, start + columns), height: MARKET_ROW_HEIGHT });
      }
      append({ kind: "space", key: `${key}:end`, height: 14 });
    }
  }
  return items;
}

export function initialMarketItems(items: MarketListItem[], windowHeight: number): number {
  // Cover the catalog below its header and basket, plus one item as a scroll buffer.
  const viewport = Math.max(MARKET_ROW_HEIGHT, windowHeight - 112);
  let covered = 0;
  let count = 0;
  while (count < items.length && covered < viewport) covered += items[count++].height;
  return Math.min(items.length, count + 1);
}
