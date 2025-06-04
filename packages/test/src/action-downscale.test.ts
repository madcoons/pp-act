import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action Downscale", { concurrency: true }, () => {
  it("should downscale by width only", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 50,
          maxHeight: null,
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

  it("should downscale by height only", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: null,
          maxHeight: 50,
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

  it("should downscale by width:30 and height:50", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 30,
          maxHeight: 50,
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

  it("should downscale by width:50 and height:30", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 50,
          maxHeight: 30,
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

  it("should downscale by width:130 and height:50", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 130,
          maxHeight: 50,
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

  it("should downscale by width:50 and height:130", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 50,
          maxHeight: 130,
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

  it("should downscale by width:130 and height:130", async (t) => {
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
          type: "Downscale",
          targetId: "psd",
          maxWidth: 130,
          maxHeight: 130,
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


  it("should downscale to 40x40 with placing smart object", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-80x80.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
        },
        {
          type: "Downscale",
          targetId: "psd",
          maxWidth: 40,
          maxHeight: 40,
        },
        {
          type: "LoadFromBuffer",
          targetId: "file",
          buffer: file,
        },
        {
          type: "DuplicateIntoSmartObjectLayer",
          sourceId: "file",
          targetId: "psd",
          layerId: "WzBd",
          fit: "scale-down",
          position: "center",
          clearSmartObject: false,
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
