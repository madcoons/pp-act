import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action Resize", { concurrency: true }, () => {
  it("should resize document to 50x50", async (t) => {
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
          type: "Resize",
          targetId: "psd",
          width: 50,
          height: 50,
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

  it("should resize document to 200x100", async (t) => {
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
          type: "Resize",
          targetId: "psd",
          width: 200,
          height: 100,
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

  it("should resize document to 100x200", async (t) => {
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
          type: "Resize",
          targetId: "psd",
          width: 100,
          height: 200,
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

  it("should resize document to 30x80", async (t) => {
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
          type: "Resize",
          targetId: "psd",
          width: 30,
          height: 80,
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
