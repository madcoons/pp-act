import type { PPActionSetColor } from "../../actions/pp-action-set-color.js";
import { ValidationError } from "../../errors/validation-error.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { hexToRgb } from "../utils/hex-to-rgb.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";

class PPActionProcessorSetColor implements PPActionProcessor {
  constructor(private action: PPActionSetColor) {}

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

    const setColorScript = `
        ${exposeFindLayerFunction}
        
        app.activeDocument = app.documents[${JSON.stringify(targetIndex)}];
        const indexPath = ${parsedLayerId.indexPathJson};
        const layer = findLayer(app.activeDocument.layers, indexPath);
        if (!layer) {
          app.echoToOE("ValidationError:Layer '${
            this.action.layerId
          }' not found.");
        }
        
        if (layer.kind !== LayerKind.SOLIDFILL) {
          app.echoToOE("ValidationError:Layer '${
            this.action.layerId
          }' must be Solid Fill.");
        }

        app.activeDocument.activeLayer = layer;

        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putEnumerated(stringIDToTypeID('contentLayer'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        desc.putReference(charIDToTypeID('null'), ref);
        const fillDesc = new ActionDescriptor();
        const colorDesc = new ActionDescriptor();
        colorDesc.putDouble(charIDToTypeID('Rd  '), ${JSON.stringify(color.r)});
        colorDesc.putDouble(charIDToTypeID('Grn '), ${JSON.stringify(color.g)});
        colorDesc.putDouble(charIDToTypeID('Bl  '), ${JSON.stringify(color.b)});
        fillDesc.putObject(charIDToTypeID('Clr '), charIDToTypeID('RGBC'), colorDesc);
        desc.putObject(charIDToTypeID('T   '), stringIDToTypeID('solidColorLayer'), fillDesc);
        executeAction(charIDToTypeID('setd'), desc, DialogModes.NO);
        `;

    await executeScript(state.iframe, setColorScript);

    await new Promise((r) => setTimeout(r, 1000_000));
  }
}

export default PPActionProcessorSetColor;
