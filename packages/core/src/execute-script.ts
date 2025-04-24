import ValidationError from "./validation-error.js";

const errorPrefix = "Error:";
const validationErrorPrefix = "ValidationError:";

export const executeScript = async (
  iframe: HTMLIFrameElement,
  script: string
) => {
  const contentWindow = iframe.contentWindow;
  if (!contentWindow) {
    throw new Error("iframe contentWindow is null.");
  }

  return await new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    let remainingDoneMsgs = 1;
    let result: string | ArrayBuffer | null = null;

    function onMessage(this: Window, ev: MessageEvent<any>) {
      if (ev.source !== contentWindow) {
        return;
      }

      if (ev.data === "done") {
        remainingDoneMsgs--;
      } else if (
        typeof ev.data === "string" &&
        ev.data.startsWith(errorPrefix)
      ) {
        window.removeEventListener("message", onMessage);
        reject(new Error(ev.data.slice(errorPrefix.length)));
      } else if (
        typeof ev.data === "string" &&
        ev.data.startsWith(validationErrorPrefix)
      ) {
        window.removeEventListener("message", onMessage);
        reject(
          new ValidationError(ev.data.slice(validationErrorPrefix.length))
        );
      } else if (ev.data instanceof ArrayBuffer) {
        result = ev.data;
        remainingDoneMsgs--;
      } else if (ev.data === "expect-additional-done") {
        remainingDoneMsgs++;
      } else if (typeof ev.data === "string") {
        result = ev.data;
      } else {
        throw new Error(`Type of data '${typeof ev.data}' is not supported.`);
      }

      if (remainingDoneMsgs === 0) {
        window.removeEventListener("message", onMessage);
        resolve(result);
      }
    }

    window.addEventListener("message", onMessage);
    contentWindow.postMessage(script, "*");
  });
};
