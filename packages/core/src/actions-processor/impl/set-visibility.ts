import type { PPActionSetText } from "../../actions/pp-action-set-text.js";
import type { PPActionSetVisibility } from "../../actions/pp-action-set-visibility.js";
import { ValidationError } from "../../errors/validation-error.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { hexToRgb } from "../utils/hex-to-rgb.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";

class PPActionProcessorSetVisibility implements PPActionProcessor {
  constructor(private action: PPActionSetVisibility) {}

  async process(state: PPActionProcessorState): Promise<void> {
    const targetIndex = state.documentKeyToIndexMap.get(this.action.targetId);
    if (targetIndex === undefined) {
      throw new ValidationError(
        `Target id '${this.action.targetId}' is not found.`
      );
    }

    const parsedLayerId = tryParseLayerId(this.action.layerId);
    if (!parsedLayerId) {
      throw new ValidationError(`Layer '${this.action.layerId}' not found.`);
    }

    const setTextAndColorScript = `
        ${exposeFindLayerFunction}
        
        app.activeDocument = app.documents[${JSON.stringify(targetIndex)}];
        const indexPath = ${parsedLayerId.indexPathJson};
        const layer = findLayer(app.activeDocument.layers, indexPath);
        if (!layer) {
          app.echoToOE("ValidationError:Layer '${
            this.action.layerId
          }' not found.");
        }

        layer.visible = ${JSON.stringify(this.action.visible)};
        `;

    await executeScript(state.iframe, setTextAndColorScript);
  }
}

export default PPActionProcessorSetVisibility;
