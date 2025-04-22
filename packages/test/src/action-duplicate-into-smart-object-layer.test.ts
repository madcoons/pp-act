import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe(
  "Action MessageActionDuplicateIntoSmartObjectLayer",
  { concurrency: true },
  () => {
    it("should fit: 'none' with same dimensions", async (t) => {
      const resImageBase64 = await runInBrowser(`
      const psd = await fetch("/data/smart-object-1000x1000.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-1000x1000.png").then(x => x.arrayBuffer());

      const message = {
        id: "1",
        actions: [
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "psd",
            buffer: psd,
          },
          {
            type: "MessageActionLoadFromBuffer",
            targetId: "file",
            buffer: file,
          },
          {
            type: "MessageActionDuplicateIntoSmartObjectLayer",
            sourceId: "file",
            targetId: "psd",
            layerId: "WzBd",
            fit: "none",
            position: "center",
            clearSmartObject: false,
          },
          {
            type: "MessageActionExport",
            sourceId: "psd",
            resultId: "resPng",
            mimeType: "image/png",
          },
        ],
      };

      const procRes = await processMessage(iframe, message);

      const image = procRes.find(x => x.id === "resPng").data;
      return await bufferToBase64(image);
      `, true);

      t.assert.snapshot(resImageBase64);
    });
  }
);
