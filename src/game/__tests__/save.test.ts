import AsyncStorage from "@react-native-async-storage/async-storage";
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

describe("persistent shared basket", () => {
  test("restores additions and removals across market visits without completing shopping", async () => {
    const save = { ...freshSave(), phase: "market" as const };
    await storeSave({ ...save, basket: ["beef-brisket"] });
    expect((await loadSave())?.basket).toEqual(["beef-brisket"]);
    await storeSave({ ...save, basket: ["beef-brisket", "shrimp"] });
    expect((await loadSave())?.basket).toEqual(["beef-brisket", "shrimp"]);
    await storeSave({ ...save, basket: ["shrimp"] });
    const restored = await loadSave();
    expect(restored?.basket).toEqual(["shrimp"]);
    expect(restored?.phase).toBe("market");
  });

  test("persists removal of the last ingredient", async () => {
    await storeSave({ ...freshSave(), basket: ["shrimp"] });
    await storeSave({ ...freshSave(), basket: [] });
    expect((await loadSave())?.basket).toEqual([]);
  });

  test("serializes rapid changes so an older write cannot replace a newer basket", async () => {
    let releaseFirst!: () => void;
    const gate = new Promise<void>((resolve) => { releaseFirst = resolve; });
    const firstWrite = jest.mocked(AsyncStorage.setItem).getMockImplementation()!;
    jest.mocked(AsyncStorage.setItem).mockImplementationOnce(async (key, value) => {
      await gate;
      await firstWrite(key, value);
    });
    const first = storeSave({ ...freshSave(), basket: ["shrimp"] });
    const second = storeSave({ ...freshSave(), basket: ["shrimp", "beef-brisket"] });
    await Promise.resolve();
    try {
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    } finally {
      releaseFirst();
    }
    await Promise.all([first, second]);
    expect((await loadSave())?.basket).toEqual(["shrimp", "beef-brisket"]);
  });

  test("a new week and reset clear the previous basket", async () => {
    await storeSave({ ...freshSave(), basket: ["shrimp"] });
    await storeSave({ ...freshSave(), week: 2, basket: null });
    const nextWeek = await loadSave();
    expect(nextWeek?.week).toBe(2);
    expect(nextWeek?.basket).toBeNull();
    const pending = storeSave({ ...freshSave(), basket: ["beef-brisket"] });
    const cleared = clearSave();
    const reset = storeSave(freshSave());
    await Promise.all([pending, cleared, reset]);
    expect(await loadSave()).toEqual(freshSave());
  });

  test("a failed write does not block subsequent saves", async () => {
    jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error("Storage unavailable"));
    await storeSave({ ...freshSave(), basket: ["shrimp"] });
    await storeSave({ ...freshSave(), basket: ["beef-brisket"] });
    expect((await loadSave())?.basket).toEqual(["beef-brisket"]);
  });
});
