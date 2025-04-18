export const loadBuffer = async (
  iframe: HTMLIFrameElement,
  buffer: ArrayBuffer,
  transfer: boolean = true
) => {
  const contentWindow = iframe.contentWindow;
  if (!contentWindow) {
    throw new Error("iframe contentWindow is null.");
  }

  return await new Promise<void>((resolve) => {
    function onMessage(this: Window, ev: MessageEvent<any>) {
      if (ev.source !== contentWindow) {
        return;
      }

      if (ev.data === "done") {
        window.removeEventListener("message", onMessage);
        resolve();
      } else {
        throw new Error(`Type of data '${typeof ev.data}' is not supported.`);
      }
    }

    window.addEventListener("message", onMessage);
    contentWindow.postMessage(buffer, "*", transfer ? [buffer] : []);
  });
};
