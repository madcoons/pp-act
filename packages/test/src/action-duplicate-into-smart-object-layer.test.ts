import { describe, it } from "node:test";
import { runInBrowser } from "./run-in-browser.js";
import "./update-snapshot-path.js";

describe("Action DuplicateIntoSmartObjectLayer", { concurrency: true }, () => {
  it("should fit: 'none' with same dimensions", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-50x50.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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
          fit: "none",
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

  it("should fit: 'none' and position: 'center' using larger input", async (t) => {
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
          type: "LoadFromBuffer",
          targetId: "file",
          buffer: file,
        },
        {
          type: "DuplicateIntoSmartObjectLayer",
          sourceId: "file",
          targetId: "psd",
          layerId: "WzBd",
          fit: "none",
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

  it("should fit: 'scale-down' and position: 'center' using larger input", async (t) => {
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

  it("should fit: 'scale-down' and position: 'center' using smaller input", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-40x40.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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

  it("should fit: 'fill' and position: 'center' using smaller different aspect input", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-40x20.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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
          fit: "fill",
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

  it("should fit: 'fill' and position: 'center' using larger different aspect input", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-140x70.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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
          fit: "fill",
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

  it("should clear smart object", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-50x50.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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
          fit: "none",
          position: "center",
          clearSmartObject: true,
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

  it("should clear smart object with multiple layers", async (t) => {
    const resImageDataURL = await runInBrowser(
      `
      const psd = await fetch("/data/simple-100x100-smart-object-50x50-with-multiple-layers.psd").then(x => x.arrayBuffer());
      const file = await fetch("/data/simple-50x50.png").then(x => x.arrayBuffer());

      const actions = [
        {
          type: "LoadFromBuffer",
          targetId: "psd",
          buffer: psd,
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
          fit: "none",
          position: "center",
          clearSmartObject: true,
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
