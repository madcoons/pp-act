import assert from "node:assert";
import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action GetInfo", { concurrency: true }, () => {
  it("should get info", async (t) => {
    const info = await runInBrowser<string>(`
      const res = await fetch("/data/complex-for-get-info.psd").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "some-id",
          buffer: res,
        },
        {
          type: "GetInfo",
          sourceId: "some-id",
          resultId: "info"
        },
      ];

      const procRes = await processActions(iframe, actions);
      const info = procRes.find(x => x.id === "info").info;
      
      return JSON.stringify(info);
      `);

    t.assert.snapshot(JSON.parse(info));
  });
});
