import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action SetText", { concurrency: true }, () => {
  it("should set text and color", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-text.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
        },
        {
          type: "SetText",
          targetId: "psd",
          layerId: "WzBd",
          text: "Hello World!",
          colorHex: "#bf6c13",
        },
        {
          type: "ExportDataURL",
          sourceId: "psd",
          resultId: "resPng",
          mimeType: "image/png",
        },
      ];

      const procRes = await processActions(iframe, actions);

      const url = procRes.find(x => x.id === "resPng").url;
      return url;
      `
    );

    t.assert.snapshot(resImageDataURL);
  });
});
