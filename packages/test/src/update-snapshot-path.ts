import path from "node:path";
import { snapshot } from "node:test";
import fs from "node:fs";

const cache = new Map<string, string>();

snapshot.setResolveSnapshotPath((p) => {
  if (!p) {
    throw new Error(`Path is undefined.`);
  }

  const fromCache = cache.get(p);
  if (fromCache) {
    return fromCache;
  }

  const mapFilePath = p + ".map";
  const mapFile = fs.readFileSync(mapFilePath, "utf-8");
  const mapJson = JSON.parse(mapFile);
  const relativeSource = mapJson.sources[0];
  const source = path.resolve(path.dirname(p), relativeSource);

  cache.set(p, source);

  return source + ".snapshot";
});
