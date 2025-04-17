import assert from "node:assert";
import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Message Processor", () => {
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
    const pngBase64 = await runInBrowser<string>(`
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
            targetId: "exported-png",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);
      const png = procRes.find(x => x.targetId === "exported-png").data;
      return bufferToBase64(png);
      `);

    t.assert.snapshot(pngBase64);
  });
});
