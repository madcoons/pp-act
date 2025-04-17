import express from "express";
import http from "node:http";
import path from "node:path";
import url from "node:url";
import puppeteer from "puppeteer";

const loadIndex = async (content: string) => {
  const app = express();

  app.get("/", (_, res) => {
    res.contentType("text/html; charset=utf-8").status(200).send(content);
  });

  const getCoreModulePath = (module: string) => {
    const moduleUrl = import.meta.resolve(`@pp-act/core/${module}`);
    return url.fileURLToPath(moduleUrl);
  };

  app.use(
    "/core",
    express.static(path.resolve(import.meta.dirname, "../../../core"))
  );

  app.use(
    "/data",
    express.static(path.resolve(import.meta.dirname, "../../data"))
  );

  const server = await new Promise<http.Server>((resolve, reject) => {
    const server = app.listen(0, (err) =>
      err ? reject(err) : resolve(server)
    );
  });

  const getBaseUrl = () => {
    const address = server.address();
    if (!address) {
      throw new Error("Address is null.");
    }

    if (typeof address === "string") {
      throw new Error(`Address '${address}' not supported.`);
    }

    return `http://localhost:${address.port}`;
  };

  const close = () =>
    new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );

  return {
    baseUrl: getBaseUrl(),
    close: close,
  };
};

export const runInBrowser = async (methodBody: string) => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
  });

  try {
    const page = await browser.newPage();

    const htmlInfo = await loadIndex(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Test</title>
            <style>
              body {
                margin: 0;
              }

              iframe {
                width: 100vw;
                height: 100vh;
                display: block;
                border: 0;
              }
            </style>
          </head>
          <body>
          </body>
            <script>
              const delay = (ms) => new Promise(r => setTimeout(r, ms));

              const getIFrame = async () => {
                const { loadIFrame } = await import("/core/dist/src/load-iframe.js");
                const iframe = await loadIFrame(iframe => {
                  iframe.src = "https://photopea.com#%7B%7D";
                  document.body.appendChild(iframe);
                });

                return iframe;
              };

              globalThis.run = async () => {
                const { processMessage } = await import("/core/dist/src/process-message.js");
                const { executeScript } = await import("/core/dist/src/execute-script.js");

                const iframe = await getIFrame();

                ${methodBody}
              }
            </script>
        </html>
      `);

    try {
      await page.goto(htmlInfo.baseUrl);
      // await new Promise((r) => setTimeout(r, 100_000));
      const res = await page.evaluate("run()");
      return res;
    } finally {
      await htmlInfo.close();
    }
  } finally {
    await browser.close();
  }
};
