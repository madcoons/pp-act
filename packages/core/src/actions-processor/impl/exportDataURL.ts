import type { PPActionExportDataURL } from "../../actions/pp-action-export-dataurl.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import ValidationError from "../../errors/validation-error.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { blobToDataURL } from "../utils/blob-to-data-url.js";
import { mimeTypeToPPFormat } from "../utils/mime-type-to-pp-format.js";

class PPActionProcessorExportDataURL implements PPActionProcessor {
  constructor(private action: PPActionExportDataURL) {}

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
      const url = await blobToDataURL(blob);

      state.result.push({
        type: "ExportDataURL",
        id: this.action.resultId,
        url: url,
      });
    } else {
      throw new Error("Something went wrong. Result data is not ArrayBuffer.");
    }
  }
}

export default PPActionProcessorExportDataURL;
