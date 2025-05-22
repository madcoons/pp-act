import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action SetVisibility", { concurrency: true }, () => {
  it("should set visibility", async (t) => {
    const resJson = await runInBrowser<string>(
      `
      const psd = await fetch("/data/simple-100x100-solid-fill.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
        },
        {
          type: "SetVisibility",
          targetId: "psd",
          layerId: "WzBd",
          visible: false,
        },
        {
          type: "ExportDataURL",
          sourceId: "psd",
          resultId: "invisiblePng",
          mimeType: "image/png",
        },
        {
          type: "SetVisibility",
          targetId: "psd",
          layerId: "WzBd",
          visible: true,
        },
        {
          type: "ExportDataURL",
          sourceId: "psd",
          resultId: "visiblePng",
          mimeType: "image/png",
        },
      ];

      const procRes = await processActions(iframe, actions);
      return JSON.stringify(procRes);
      `
    );

    t.assert.snapshot(JSON.parse(resJson));
  });
});
