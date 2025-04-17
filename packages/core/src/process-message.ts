import { executeScript } from "./execute-script.js";
import { loadBuffer } from "./load-buffer.js";
import type { MessageResult } from "./message-result.js";
import type { Message } from "./message.js";

export const processMessage = async (
  iframe: HTMLIFrameElement,
  message: Message
) => {
  const res: MessageResult[] = [];

  for (const action of message.actions) {
    if (action.type === "MessageActionLoadFromBuffer") {
      // const script =
      //   `app.echoToOE("expect-additional-done");\n` +
      //   `app.open(${JSON.stringify(action.url)});\n`;

      await loadBuffer(iframe, action.buffer);
    } else if (action.type === "MessageActionLoadFromUrl") {
      const script =
        `app.echoToOE("expect-additional-done");\n` +
        `app.open(${JSON.stringify(action.url)});\n`;

      await executeScript(iframe, script);
    } else if (action.type === "MessageActionExport") {
      let format: string;
      if (action.mimeType === "image/png") {
        format = "png";
      } else if (action.mimeType === "image/jpeg") {
        format = `jpg:${action.quality}`;
      } else if (action.mimeType === "image/webp") {
        format = `webp:${action.quality}`;
      } else {
        throw new Error(
          `Action mimeType '${action.mimeType}' is not supported.`
        );
      }

      const script =
        `app.echoToOE("expect-additional-done");\n` +
        `app.documents[0].saveToOE(${JSON.stringify(format)});\n`;

      const data = await executeScript(iframe, script);
      if (data instanceof ArrayBuffer) {
        res.push({
          type: "MessageResultExport",
          targetId: action.targetId,
          data: data,
        });
      } else {
        throw new Error(
          "Something went wrong. Result data is not ArrayBuffer."
        );
      }
    } else {
      throw new Error(`Action '${JSON.stringify(action)}' is not supported.`);
    }
  }

  return res;
};
