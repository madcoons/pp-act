import type { PPActionExportBlob } from "../../actions/pp-action-export-blob.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import ValidationError from "../../errors/validation-error.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { mimeTypeToPPFormat } from "../utils/mime-type-to-pp-format.js";

class PPActionProcessorExportBlob implements PPActionProcessor {
  constructor(private action: PPActionExportBlob) {}

  async process(state: PPActionProcessorState): Promise<void> {
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
        type: "ExportBlob",
        id: this.action.resultId,
        blob: blob,
      });
    } else {
      throw new Error("Something went wrong. Result data is not ArrayBuffer.");
    }
  }
}

export default PPActionProcessorExportBlob;
