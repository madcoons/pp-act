import { executeScript } from "../../execute-script.js";
import type { MessageActionGetInfo } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";

const populateJsonScript = `
let res = {};
res.name = app.activeDocument.name;

function mapLayer(input, res) {
    res.typename = input.typename;
    if (input.typename === "ArtLayer") {
        res.allLocked = input.allLocked;
        // res.blendMode = input.blendMode;
        // res.bounds = input.bounds;
        res.boundsNoEffects = input.boundsNoEffects;
        res.fillOpacity = input.fillOpacity;
        res.grouped = input.grouped;
        res.isBackgroundLayer = input.isBackgroundLayer;

        // Map kind
        if (input.kind === LayerKind.BLACKANDWHITE) {
            res.kind = "BLACKANDWHITE";
        } else if (input.kind === LayerKind.BRIGHTNESSCONTRAST) {
            res.kind = "BRIGHTNESSCONTRAST";
        } else if (input.kind === LayerKind.CHANNELMIXER) {
            res.kind = "CHANNELMIXER";
        } else if (input.kind === LayerKind.COLORBALANCE) {
            res.kind = "COLORBALANCE";
        } else if (input.kind === LayerKind.CURVES) {
            res.kind = "CURVES";
        } else if (input.kind === LayerKind.EXPOSURE) {
            res.kind = "EXPOSURE";
        } else if (input.kind === LayerKind.GRADIENTFILL) {
            res.kind = "GRADIENTFILL";
        } else if (input.kind === LayerKind.GRADIENTMAP) {
            res.kind = "GRADIENTMAP";
        } else if (input.kind === LayerKind.HUESATURATION) {
            res.kind = "HUESATURATION";
        } else if (input.kind === LayerKind.INVERSION) {
            res.kind = "INVERSION";
        } else if (input.kind === LayerKind.LEVELS) {
            res.kind = "LEVELS";
        } else if (input.kind === LayerKind.NORMAL) {
            res.kind = "NORMAL";
        } else if (input.kind === LayerKind.PATTERNFILL) {
            res.kind = "PATTERNFILL";
        } else if (input.kind === LayerKind.PHOTOFILTER) {
            res.kind = "PHOTOFILTER";
        } else if (input.kind === LayerKind.POSTERIZE) {
            res.kind = "POSTERIZE";
        } else if (input.kind === LayerKind.SELECTIVECOLOR) {
            res.kind = "SELECTIVECOLOR";
        } else if (input.kind === LayerKind.SMARTOBJECT) {
            res.kind = "SMARTOBJECT";
        } else if (input.kind === LayerKind.SOLIDFILL) {
            res.kind = "SOLIDFILL";
        } else if (input.kind === LayerKind.TEXT) {
            res.kind = "TEXT";
        } else if (input.kind === LayerKind.THRESHOLD) {
            res.kind = "THRESHOLD";
        } else if (input.kind === LayerKind.LAYER3D) {
            res.kind = "LAYER3D";
        } else if (input.kind === LayerKind.VIBRANCE) {
            res.kind = "VIBRANCE";
        } else if (input.kind === LayerKind.VIDEO) {
            res.kind = "VIDEO";
        }

        // res.linkedLayers = input.linkedLayers;
        res.name = input.name;
        res.opacity = input.opacity;
        res.pixelsLocked = input.pixelsLocked;
        res.positionLocked = input.positionLocked;
        // res.textItem = input.textItem;
        res.transparentPixelsLocked = input.transparentPixelsLocked;
        // res.vectorMaskDensity = input.vectorMaskDensity;
        // res.vectorMaskFeather = input.vectorMaskFeather;
        res.visible = input.visible;
    } else if (input.typename === "ArtLayer") {
        res.layers = [];
        for (let i = 0; i < input.layers.length; i++) {
        }
     }
}

res.layers = [];
for (let i = 0; i < app.activeDocument.layers.length; i++) {
    let resLayer = {};
    mapLayer(app.activeDocument.layers[i], resLayer);
    res.layers.push(resLayer);
}
`;

class MessageActionProcessorGetInfo implements MessageActionProcessor {
  constructor(private action: MessageActionGetInfo) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    const sourceIndex = state.documentKeyToIndexMap.get(this.action.sourceId);
    if (sourceIndex === undefined) {
      throw new Error(`Source id '${this.action.sourceId}' is not found.`);
    }

    const script =
      `app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];\n` +
      populateJsonScript +
      `app.echoToOE(JSON.stringify(res));\n`;

    const infoRes = await executeScript(state.iframe, script);

    if (typeof infoRes !== "string") {
      throw new Error(`Info result is expected to be string.`);
    }

    state.result.push({
      type: "MessageResultGetInfo",
      id: this.action.resultId,
      info: JSON.parse(infoRes),
    });
  }
}

export default MessageActionProcessorGetInfo;
