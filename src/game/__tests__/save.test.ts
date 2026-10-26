import AsyncStorage from "@react-native-async-storage/async-storage";
import { startCook, finishCook } from "../cooking";
import { clearSave, freshSave, loadSave, storeSave } from "../save";

jest.mock("@react-native-async-storage/async-storage", () => {
  const storage = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => storage.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => { storage.set(key, value); }),
      removeItem: jest.fn(async (key: string) => { storage.delete(key); }),
    },
  };
});

beforeEach(async () => {
  await clearSave();
  jest.clearAllMocks();
});

describe("persistent stock and pending receipts", () => {
  test("stores pending purchases separately from owned portions across visits", async () => {
    const save = { ...freshSave(), phase: "market" as const, inventory: { chicken: 2 }, cart: { shrimp: 3 } };
    await storeSave(save);
    const restored = await loadSave();
    expect(restored?.inventory).toEqual({ chicken: 2 });
    expect(restored?.cart).toEqual({ shrimp: 3 });
    await storeSave({ ...save, cart: {} });
    expect((await loadSave())?.cart).toEqual({});
    expect((await loadSave())?.inventory).toEqual({ chicken: 2 });
  });

  test("serializes rapid cart writes so an older update cannot replace a newer quantity", async () => {
    let releaseFirst!: () => void;
    const gate = new Promise<void>((resolve) => { releaseFirst = resolve; });
    const firstWrite = jest.mocked(AsyncStorage.setItem).getMockImplementation()!;
    jest.mocked(AsyncStorage.setItem).mockImplementationOnce(async (key, value) => {
      await gate;
      await firstWrite(key, value);
    });
    const first = storeSave({ ...freshSave(), cart: { chicken: 1 } });
    const second = storeSave({ ...freshSave(), cart: { chicken: 3 } });
    await Promise.resolve();
    try { expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1); }
    finally { releaseFirst(); }
    await Promise.all([first, second]);
    expect((await loadSave())?.cart).toEqual({ chicken: 3 });
  });

  test("reset clears stock, pending purchases, and queued writes", async () => {
    const pending = storeSave({ ...freshSave(), inventory: { chicken: 3 }, cart: { shrimp: 2 } });
    const cleared = clearSave();
    const reset = storeSave(freshSave());
    await Promise.all([pending, cleared, reset]);
    expect(await loadSave()).toEqual(freshSave());
  });

  test("a failed write does not block subsequent saves", async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error("Storage unavailable"));
    await storeSave({ ...freshSave(), cart: { shrimp: 2 } });
    await storeSave({ ...freshSave(), cart: { chicken: 3 } });
    expect((await loadSave())?.cart).toEqual({ chicken: 3 });
  });

  test("old basket saves migrate to one stored portion per ingredient", async () => {
    const { inventory, cart, activeCook, ...old } = freshSave();
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify({ ...old, basket: ["chicken", "shrimp", "unknown"] }));
    const migrated = await loadSave();
    expect(migrated?.inventory).toEqual({ chicken: 1, shrimp: 1 });
    expect(migrated?.cart).toEqual({});
    expect(migrated).not.toHaveProperty("basket");
  });

  test("new inventory is authoritative over any leftover legacy basket field", async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify({ ...freshSave(), inventory: {}, basket: ["chicken"] }));
    expect((await loadSave())?.inventory).toEqual({});
  });

  test.each(["trial", "service"] as const)("paid %s attempts resume with depleted stock and saved cooking progress", async (kind) => {
    const started = startCook({ ...freshSave(), inventory: { chicken: 3 } }, "pho-bo", ["chicken"], kind);
    if (!started.ok) throw new Error("Expected stock");
    const paid = { ...started.save, activeCook: { ...started.save.activeCook!, progress: { fill: 52, finished: null } } };
    await storeSave(paid);
    const restored = (await loadSave())!;
    expect(restored.inventory).toEqual({ chicken: 2 });
    expect(restored.activeCook?.progress).toEqual({ fill: 52, finished: null });
    expect(startCook(restored, "pho-bo", ["chicken"], kind)).toEqual({ ok: true, save: restored });
    const result = finishCook(restored, 0.9);
    await storeSave(result);
    const reloaded = (await loadSave())!;
    expect(reloaded.inventory).toEqual({ chicken: 2 });
    expect(reloaded.activeCook?.status).toBe("result");
    expect(finishCook(reloaded, 1)).toBe(reloaded);
  });

  test("legacy trials on the cook screen become paid resumable attempts only once", async () => {
    const { inventory, cart, activeCook, ...old } = freshSave();
    jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify({ ...old, phase: "trial", trialStep: "cook", basket: ["chicken"], pick: ["chicken"] }));
    const migrated = (await loadSave())!;
    expect(migrated.inventory).toEqual({});
    expect(migrated.activeCook?.status).toBe("cooking");
    await storeSave(migrated);
    expect((await loadSave())?.inventory).toEqual({});
  });

  test("invalid saved quantities are discarded", async () => {
    await storeSave({ ...freshSave(), inventory: { chicken: 2, shrimp: -2, tofu: 1.5 }, cart: { eggs: 4, unknown: 3 } });
    const loaded = await loadSave();
    expect(loaded?.inventory).toEqual({ chicken: 2 });
    expect(loaded?.cart).toEqual({ eggs: 4 });
  });
});
