// Three Regions: the weekly pool. The pool is the week's served menu:
// at most 5 approved dishes, in FIFO rotation order. A dish joins the
// queue by passing the owner's trial. When the queue holds 5 or more,
// a new approval pushes the oldest dish to the back, so dropped dishes
// cycle back instead of leaving for good. A week with no new approval
// repeats its pool.

/** The week's pool: the first 5 dishes in rotation order. */
export function poolIds(queue: string[]): string[] {
  return queue.slice(0, 5);
}

/** The queue after a dish passes its trial. Duplicates never join. */
export function queueOnApproval(queue: string[], dishId: string): string[] {
  if (queue.includes(dishId)) return queue;
  if (queue.length < 5) return [...queue, dishId];
  const next = [...queue, dishId];
  const oldest = next.shift() as string;
  next.push(oldest);
  return next;
}

/** Dishes cooked on one service day: 4 when the pool holds 5 or more,
 * otherwise the whole pool. */
export function dishesPerDay(poolLength: number): number {
  return poolLength >= 5 ? 4 : Math.max(1, poolLength);
}

/** One service day's dishes, in pool order, minus the dish that sits
 * out: the omitted dish rotates daily in pool order, so each pool dish
 * cooks 4 days a week and sits out once. Pools under 5 serve whole. */
export function dayPool<T>(pool: T[], dayIndex: number): T[] {
  if (pool.length < 5) return pool;
  const omitted = ((dayIndex % pool.length) + pool.length) % pool.length;
  return pool.filter((_, i) => i !== omitted);
}
