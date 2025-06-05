import type { PPActionExportBlob } from "../../actions/pp-action-export-blob.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import { ValidationError } from "../../errors/validation-error.js";
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

    const getSizeScript = `
      app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];
      res = {
          width: app.activeDocument.width,
          height: app.activeDocument.height,
      };
      app.echoToOE(JSON.stringify(res));
      `;

    const resSizeJson = await executeScript(state.iframe, getSizeScript);
    if (typeof resSizeJson !== "string") {
      throw new Error("Something went wrong. resJson should be string.");
    }

    const resSize: { width: number; height: number } = JSON.parse(resSizeJson);
    if (!Number.isInteger(resSize.width) || !Number.isInteger(resSize.height)) {
      throw new Error(`Width and height are not integers. Got: ${resSizeJson}`);
    }

    const saveToOEScript = `
      app.echoToOE("expect-additional-done");
      app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];
      app.activeDocument.saveToOE(${JSON.stringify(format)});
      `;

    const data = await executeScript(state.iframe, saveToOEScript);
    if (data instanceof ArrayBuffer) {
      const blob = new Blob([data], { type: this.action.mimeType });
      state.result.push({
        type: "ExportBlob",
        id: this.action.resultId,
        blob: blob,
        width: resSize.width,
        height: resSize.height,
      });
    } else {
      throw new Error("Something went wrong. Result data is not ArrayBuffer.");
    }
  }
}

export default PPActionProcessorExportBlob;
