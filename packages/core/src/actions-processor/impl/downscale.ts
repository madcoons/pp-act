import type { PPActionDownscale } from "../../actions/pp-action-downscale.js";
import { ValidationError } from "../../errors/validation-error.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";

class PPActionProcessorDownscale implements PPActionProcessor {
  constructor(private action: PPActionDownscale) {}

  async process(state: PPActionProcessorState): Promise<void> {
    const targetIndex = state.documentKeyToIndexMap.get(this.action.targetId);
    if (targetIndex === undefined) {
      throw new ValidationError(
        `Target id '${this.action.targetId}' is not found.`
      );
    }

    const setColorScript = `
        app.activeDocument = app.documents[${JSON.stringify(targetIndex)}];

        const maxWidth = ${JSON.stringify(
          this.action.maxWidth
        )} ? ${JSON.stringify(this.action.maxWidth)} : app.activeDocument.width;

        const maxHeight = ${JSON.stringify(
          this.action.maxHeight
        )} ? ${JSON.stringify(
      this.action.maxHeight
    )} : app.activeDocument.height;

        const scale = Math.min(maxWidth / app.activeDocument.width, maxHeight / app.activeDocument.height);

        if (scale < 1) {
            const width = Math.floor(app.activeDocument.width * scale);
            const height = Math.floor(app.activeDocument.height * scale);

            app.activeDocument.resizeImage(width, height);
        }
        `;

    await executeScript(state.iframe, setColorScript);
  }
}

export default PPActionProcessorDownscale;
