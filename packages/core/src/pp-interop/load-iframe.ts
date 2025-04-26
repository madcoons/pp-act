export const loadIFrame = async (
  config: (iframe: HTMLIFrameElement) => void
) => {
  const iframe = document.createElement("iframe");

  await new Promise<void>((resolve) => {
    function readyHandler(this: Window, ev: MessageEvent<any>) {
      if (ev.source !== iframe.contentWindow) {
        return;
      }

      if (ev.data === "done") {
        window.removeEventListener("message", readyHandler);
        resolve();
      }
    }

    window.addEventListener("message", readyHandler);

    config(iframe);
  });

  return iframe;
};
