import assert from "node:assert";
import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Message Processor", { concurrency: true }, () => {
  it("should load from buffer", async () => {
    const docsCount = await runInBrowser(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
        ],
      };

      await processMessage(iframe, message);

      const docsCount = await executeScript(iframe, "app.echoToOE('' + app.documents.length)");
      
      return parseInt(docsCount);
      `);

    assert.equal(docsCount, 1);
  });
  it("should load from url", async () => {
    const docsCount = await runInBrowser(`
      const resBlob = await fetch("/data/simple.psd").then(x => x.blob());
      const dataUrl = await blobToDataURL(resBlob);

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromUrl",
            targetId: "some-id",
            url: dataUrl,
          },
        ],
      };

      await processMessage(iframe, message);

      const docsCount = await executeScript(iframe, "app.echoToOE('' + app.documents.length)");
      
      return parseInt(docsCount);
      `);

    assert.equal(docsCount, 1);
  });

  it("should export png blob", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportBlob",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const blob = procRes.find(x => x.id === "exported").blob;
      return await blobToDataURL(blob);
      `);

    t.assert.snapshot(url);
  });

  it("should export png dataURL", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportDataURL",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const url = procRes.find(x => x.id === "exported").url;
      return url;
      `);

    t.assert.snapshot(url);
  });

  it("should export jpeg blob", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportBlob",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/jpeg",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const blob = procRes.find(x => x.id === "exported").blob;
      return await blobToDataURL(blob);
      `);

    t.assert.snapshot(url);
  });

  it("should export jpeg dataURL", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportDataURL",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/jpeg",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const url = procRes.find(x => x.id === "exported").url;
      return url;
      `);

    t.assert.snapshot(url);
  });

  it("should export webp blob", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportBlob",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/webp",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const blob = procRes.find(x => x.id === "exported").blob;
      return await blobToDataURL(blob);
      `);

    // Webp output is not the same for the same input
    t.assert.snapshot(url.length);
  });

  it("should export webp dataURL", async (t) => {
    const url = await runInBrowser<string>(`
      const res = await fetch("/data/simple.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionExportDataURL",
            sourceId: "some-id",
            resultId: "exported",
            mimeType: "image/webp",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const url = procRes.find(x => x.id === "exported").url;
      return url;
      `);

    // Webp output is not the same for the same input
    t.assert.snapshot(url.length);
  });

  it("should export 2 png blobs", async (t) => {
    const urls = await runInBrowser<string>(`
      const res1 = await fetch("/data/simple.psd").then(x => x.arrayBuffer());
      const res2 = await fetch("/data/simple-red.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id1",
            buffer: res1,
          },
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id2",
            buffer: res2,
          },
          {
            type: "MessageActionExportBlob",
            sourceId: "some-id1",
            resultId: "exported1",
            mimeType: "image/png",
          },
          {
            type: "MessageActionExportBlob",
            sourceId: "some-id2",
            resultId: "exported2",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const blob1 = procRes.find(x => x.id === "exported1").blob;
      const blob2 = procRes.find(x => x.id === "exported2").blob;
      
      return [await blobToDataURL(blob1), await blobToDataURL(blob2)];
      `);

    t.assert.snapshot(urls);
  });

  it("should get info", async (t) => {
    const info = await runInBrowser<string>(`
      const res = await fetch("/data/complex-for-get-info.psd").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "some-id",
            buffer: res,
          },
          {
            type: "MessageActionGetInfo",
            sourceId: "some-id",
            resultId: "info"
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const info = procRes.find(x => x.id === "info").info;
      
      return JSON.stringify(info);
      `);

    t.assert.snapshot(JSON.parse(info));
  });
});
