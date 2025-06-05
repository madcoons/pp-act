import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action ExportDataURL", { concurrency: true }, () => {
  it("should export png", async (t) => {
    const image = await runInBrowser(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "ExportDataURL",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/png",
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: image.url, width: image.width, height: image.height };
      `);

    t.assert.snapshot(image);
  });

  it("should export jpeg", async (t) => {
    const image = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "ExportDataURL",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/jpeg",
          quality: 0.8,
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: image.url, width: image.width, height: image.height };
      `);

    t.assert.snapshot(image);
  });

  it("should export webp", async (t) => {
    const image = await runInBrowser<any>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "ExportDataURL",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/webp",
          quality: 0.8,
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: image.url, width: image.width, height: image.height };
      `);

    // Webp output is not the same for the same input
    t.assert.snapshot(image.url.length);
    t.assert.snapshot({ width: image.width, height: image.height });
  });
});
