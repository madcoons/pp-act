import { executeScript } from "../../execute-script.js";
import type { MessageActionExportBlob } from "../../message-action.js";
import ValidationError from "../../validation-error.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";
import { mimeTypeToPPFormat } from "../utils/mime-type-to-pp-format.js";

class MessageActionProcessorExportBlob implements MessageActionProcessor {
  constructor(private action: MessageActionExportBlob) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    const sourceIndex = state.documentKeyToIndexMap.get(this.action.sourceId);
    if (sourceIndex === undefined) {
      throw new ValidationError(
        `Source id '${this.action.sourceId}' is not found.`
      );
    }

    const format = mimeTypeToPPFormat(
      this.action.mimeType,
      this.action.quality
    );

    const script =
      `app.echoToOE("expect-additional-done");\n` +
      `app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];\n` +
      `app.activeDocument.saveToOE(${JSON.stringify(format)});\n`;

    const data = await executeScript(state.iframe, script);
    if (data instanceof ArrayBuffer) {
      const blob = new Blob([data], { type: this.action.mimeType });
      state.result.push({
        type: "MessageResultExportBlob",
        id: this.action.resultId,
        blob: blob,
      });
    } else {
      throw new Error("Something went wrong. Result data is not ArrayBuffer.");
    }
  }
}

export default MessageActionProcessorExportBlob;
