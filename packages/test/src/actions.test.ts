import assert from "node:assert";
import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import type { Message } from "@pp-act/core/message.js";

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
});
