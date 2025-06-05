import assert from "node:assert";
import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action LoadFromUrl", { concurrency: true }, () => {
  it("should load from url", async () => {
    const docsCount = await runInBrowser(`
      const resBlob = await fetch("/data/simple.psd").then(x => x.blob());
      const dataUrl = await blobToDataURL(resBlob);

      const actions = [
        {
          type: "LoadFromUrl",
          targetId: "some-id",
          url: dataUrl,
        },
      ];

      await processActions(iframe, actions);

      const docsCount = await executeScript(iframe, "app.echoToOE('' + app.documents.length)");
      
      return parseInt(docsCount);
      `);

    assert.equal(docsCount, 1);
  });
});
