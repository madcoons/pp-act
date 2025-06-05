import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action ExportBlob", { concurrency: true }, () => {
  it("should export png", async (t) => {
    const images = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "ExportBlob",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/png",
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: await blobToDataURL(image.blob), width: image.width, height: image.height };
      `);

    t.assert.snapshot(images);
  });

  it("should export jpeg", async (t) => {
    const image = await runInBrowser(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "ExportBlob",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/jpeg",
          quality: 0.8,
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: await blobToDataURL(image.blob), width: image.width, height: image.height };
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
          type: "ExportBlob",
          sourceId: "some-id",
          resultId: "exported",
          mimeType: "image/webp",
          quality: 0.8,
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image = procRes.find(x => x.id === "exported");
      return { url: await blobToDataURL(image.blob), width: image.width, height: image.height };
      `);

    // Webp output is not the same for the same input
    t.assert.snapshot(image.url.length);
    t.assert.snapshot({ width: image.width, height: image.height });
  });

  it("should export 2 png images", async (t) => {
    const images = await runInBrowser(`
      const res1 = await fetch("/data/simple.psd").then(x => x.arrayBuffer());
      const res2 = await fetch("/data/simple-red.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id1",
          buffer: res1,
        },
        {
          type: "LoadFromBuffer",
          targetId: "some-id2",
          buffer: res2,
        },
        {
          type: "ExportBlob",
          sourceId: "some-id1",
          resultId: "exported1",
          mimeType: "image/png",
        },
        {
          type: "ExportBlob",
          sourceId: "some-id2",
          resultId: "exported2",
          mimeType: "image/png",
        },
      ];

      const procRes = await processActions(iframe, actions);
      const image1 = procRes.find(x => x.id === "exported1");
      const image2 = procRes.find(x => x.id === "exported2");

      return [
        { url: await blobToDataURL(image1.blob), width: image1.width, height: image1.height },
        { url: await blobToDataURL(image2.blob), width: image2.width, height: image2.height },
      ];
      `);

    t.assert.snapshot(images);
  });
});
