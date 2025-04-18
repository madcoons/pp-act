import { executeScript } from "../../execute-script.js";
import type { MessageActionExport } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";

class MessageActionProcessorExport implements MessageActionProcessor {
  constructor(private action: MessageActionExport) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    const sourceIndex = state.documentKeyToIndexMap.get(this.action.sourceId);
    if (sourceIndex === undefined) {
      throw new Error(`Source id '${this.action.sourceId}' is not found.`);
    }

    let format: string;
    if (this.action.mimeType === "image/png") {
      format = "png";
    } else if (this.action.mimeType === "image/jpeg") {
      format = `jpg:${this.action.quality}`;
    } else if (this.action.mimeType === "image/webp") {
      format = `webp:${this.action.quality}`;
    } else {
      throw new Error(
        `Action mimeType '${this.action.mimeType}' is not supported.`
      );
    }

    const script =
      `app.echoToOE("expect-additional-done");\n` +
      `app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];\n` +
      `app.activeDocument.saveToOE(${JSON.stringify(format)});\n`;

    const data = await executeScript(state.iframe, script);
    if (data instanceof ArrayBuffer) {
      state.result.push({
        type: "MessageResultExport",
        id: this.action.resultId,
        data: data,
      });
    } else {
      throw new Error("Something went wrong. Result data is not ArrayBuffer.");
    }
  }
}

export default MessageActionProcessorExport;
