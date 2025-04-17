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

  it("should export png", async (t) => {
    const imageBase64 = await runInBrowser<string>(`
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
            type: "MessageActionExport",
            sourceId: "some-id",
            targetId: "exported",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const image = procRes.find(x => x.targetId === "exported").data;
      return bufferToBase64(image);
      `);

    t.assert.snapshot(imageBase64);
  });

  it("should export jpeg", async (t) => {
    const imageBase64 = await runInBrowser<string>(`
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
            type: "MessageActionExport",
            sourceId: "some-id",
            targetId: "exported",
            mimeType: "image/jpeg",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const image = procRes.find(x => x.targetId === "exported").data;
      return bufferToBase64(image);
      `);

    t.assert.snapshot(imageBase64);
  });

  it("should export webp", async (t) => {
    const imageBase64 = await runInBrowser<string>(`
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
            type: "MessageActionExport",
            sourceId: "some-id",
            targetId: "exported",
            mimeType: "image/webp",
            quality: 0.8,
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const image = procRes.find(x => x.targetId === "exported").data;
      return bufferToBase64(image);
      `);

    // Webp output is not the same for the same input
    t.assert.snapshot(imageBase64.length);
  });
});
