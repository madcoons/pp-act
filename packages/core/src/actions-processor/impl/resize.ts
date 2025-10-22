import type { PPActionResize } from "../../actions/pp-action-resize.js";
import { ValidationError } from "../../errors/validation-error.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";

class PPActionProcessorResize implements PPActionProcessor {
  constructor(private action: PPActionResize) {}

  async process(state: PPActionProcessorState): Promise<void> {
    const targetIndex = state.documentKeyToIndexMap.get(this.action.targetId);
    if (targetIndex === undefined) {
      throw new ValidationError(
        `Target id '${this.action.targetId}' is not found.`
      );
    }

    const resizeScript = `
        app.activeDocument = app.documents[${JSON.stringify(targetIndex)}];

        const width = ${JSON.stringify(this.action.width)};
        const height = ${JSON.stringify(this.action.height)};

        app.activeDocument.resizeImage(width, height);
        `;

    await executeScript(state.iframe, resizeScript);
  }
}

export default PPActionProcessorResize;
