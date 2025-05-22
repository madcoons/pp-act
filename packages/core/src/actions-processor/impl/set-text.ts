import type { PPActionSetText } from "../../actions/pp-action-set-text.js";
import { ValidationError } from "../../errors/validation-error.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { hexToRgb } from "../utils/hex-to-rgb.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";

class PPActionProcessorSetText implements PPActionProcessor {
  constructor(private action: PPActionSetText) {}

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

    const color = hexToRgb(this.action.colorHex);
    if (!color) {
      throw new ValidationError(
        `Color '${this.action.colorHex}' is not rbg hex, like #121212.`
      );
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
        
        if (layer.kind !== LayerKind.TEXT) {
          app.echoToOE("ValidationError:Layer '${
            this.action.layerId
          }' must be Text.");
        }

        layer.textItem.contents = ${JSON.stringify(this.action.text)};

        const newColor = new RGBColor();
        newColor.red = ${JSON.stringify(color.r)};
        newColor.green = ${JSON.stringify(color.g)};
        newColor.blue = ${JSON.stringify(color.b)};
        layer.textItem.color = newColor;
        `;

    await executeScript(state.iframe, setTextAndColorScript);
  }
}

export default PPActionProcessorSetText;
