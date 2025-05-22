import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action SetColor", { concurrency: true }, () => {
  it("should set color", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-solid-fill.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
        },
        {
          type: "SetColor",
          targetId: "psd",
          layerId: "WzBd",
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
      `, true
    );

    t.assert.snapshot(resImageDataURL);
  });
});
