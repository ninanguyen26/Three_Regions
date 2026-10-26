import { Image } from "react-native";
import { prepareImages } from "./prepareImages";

jest.mock("react-native", () => ({ Image: {
  resolveAssetSource: (source: { uri: string }) => source,
  prefetch: jest.fn(async () => true),
} }));

beforeEach(() => jest.clearAllMocks());

test("only requests each image once per scene preparation", async () => {
  await prepareImages([{ uri: "asset://onion" }, { uri: "asset://onion" }, { uri: "asset://rice" }]);
  expect(Image.prefetch).toHaveBeenCalledTimes(2);
});

test("concurrent scene preparation shares pending requests", async () => {
  let finish!: (value: boolean) => void;
  jest.mocked(Image.prefetch).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  const first = prepareImages([{ uri: "asset://shared" }]);
  const second = prepareImages([{ uri: "asset://shared" }]);
  try { expect(Image.prefetch).toHaveBeenCalledTimes(1); } finally { finish(true); }
  await Promise.all([first, second]);
});

test("image failures allow navigation and are retried on a later visit", async () => {
  jest.mocked(Image.prefetch).mockRejectedValueOnce(new Error("Image unavailable"));
  await expect(prepareImages([{ uri: "asset://missing" }])).resolves.toBeUndefined();
  await prepareImages([{ uri: "asset://missing" }]);
  expect(Image.prefetch).toHaveBeenCalledTimes(2);
});

test("a stalled image cannot block navigation indefinitely", async () => {
  jest.useFakeTimers();
  let finish!: (value: boolean) => void;
  jest.mocked(Image.prefetch).mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
  const prepared = prepareImages([{ uri: "asset://slow" }], 1200);
  await jest.advanceTimersByTimeAsync(1200);
  await expect(prepared).resolves.toBeUndefined();
  finish(true);
  await Promise.resolve();
  jest.useRealTimers();
});
