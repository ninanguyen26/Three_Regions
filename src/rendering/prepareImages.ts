import { Image, type ImageSourcePropType } from "react-native";

const inFlight = new Map<string, Promise<void>>();

export function imageKey(source: ImageSourcePropType): string {
  return Image.resolveAssetSource(source).uri;
}

// Warm the native cache, without assuming a previous visit is still cached.
// Mounted images report onLoad separately before the catalog is revealed.
export async function prepareImages(sources: ImageSourcePropType[], timeout = 1200): Promise<void> {
  const uris = [...new Set(sources.map(imageKey))];
  const jobs = uris.map((uri) => {
    let job = inFlight.get(uri);
    if (!job) {
      job = Image.prefetch(uri).then(() => undefined, () => undefined).finally(() => inFlight.delete(uri));
      inFlight.set(uri, job);
    }
    return job;
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.all(jobs),
      new Promise<void>((resolve) => { timer = setTimeout(resolve, timeout); }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
