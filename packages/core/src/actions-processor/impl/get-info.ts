import type { DocumentInfo } from "../../action-results/document-info.js";
import type { LayerInfo } from "../../action-results/layer-info.js";
import type { PPActionGetInfo } from "../../actions/pp-action-get-info.js";
import { ValidationError } from "../../errors/validation-error.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";

const populateJsonScript = `
function mapArray(array, cb) {
    if (!array) {
        return array;
    }
    const res = [];
    for (let i = 0; i < array.length; i++) {
        res.push(cb(array[i]));
    }
    return res;
}

function mapUnitValue(value) {
    if (!value && value !== 0) {
        return undefined;
    }

    return value.value;
}

function mapBlendMode(value) {
    if (value === BlendMode.COLORBLEND) {
        return "COLORBLEND";
    } else if (value === BlendMode.COLORBURN) {
        return "COLORBURN";
    } else if (value === BlendMode.COLORDODGE) {
        return "COLORDODGE";
    } else if (value === BlendMode.DARKEN) {
        return "DARKEN";
    } else if (value === BlendMode.DIFFERENCE) {
        return "DIFFERENCE";
    } else if (value === BlendMode.DISSOLVE) {
        return "DISSOLVE";
    } else if (value === BlendMode.DIVIDE) {
        return "DIVIDE";
    } else if (value === BlendMode.EXCLUSION) {
        return "EXCLUSION";
    } else if (value === BlendMode.HARDLIGHT) {
        return "HARDLIGHT";
    } else if (value === BlendMode.HARDMIX) {
        return "HARDMIX";
    } else if (value === BlendMode.HUE) {
        return "HUE";
    } else if (value === BlendMode.LIGHTEN) {
        return "LIGHTEN";
    } else if (value === BlendMode.LINEARBURN) {
        return "LINEARBURN";
    } else if (value === BlendMode.LINEARDODGE) {
        return "LINEARDODGE";
    } else if (value === BlendMode.LINEARLIGHT) {
        return "LINEARLIGHT";
    } else if (value === BlendMode.LUMINOSITY) {
        return "LUMINOSITY";
    } else if (value === BlendMode.MULTIPLY) {
        return "MULTIPLY";
    } else if (value === BlendMode.NORMAL) {
        return "NORMAL";
    } else if (value === BlendMode.OVERLAY) {
        return "OVERLAY";
    } else if (value === BlendMode.PASSTHROUGH) {
        return "PASSTHROUGH";
    } else if (value === BlendMode.PINLIGHT) {
        return "PINLIGHT";
    } else if (value === BlendMode.SATURATION) {
        return "SATURATION";
    } else if (value === BlendMode.SCREEN) {
        return "SCREEN";
    } else if (value === BlendMode.SOFTLIGHT) {
        return "SOFTLIGHT";
    } else if (value === BlendMode.SUBTRACT) {
        return "SUBTRACT";
    } else if (value === BlendMode.VIVIDLIGHT) {
        return "VIVIDLIGHT";
    }
}

function mapJustification(value) {
    if (value === Justification.CENTER) {
        return "CENTER";
    } else if (value === Justification.CENTERJUSTIFIED) {
        return "CENTERJUSTIFIED";
    } else if (value === Justification.FULLYJUSTIFIED) {
        return "FULLYJUSTIFIED";
    } else if (value === Justification.LEFT) {
        return "LEFT";
    } else if (value === Justification.LEFTJUSTIFIED) {
        return "LEFTJUSTIFIED";
    } else if (value === Justification.RIGHT) {
        return "RIGHT";
    } else if (value === Justification.RIGHTJUSTIFIED) {
        return "RIGHTJUSTIFIED";
    }
}

function mapTextType(value) {
    if (value === TextType.PARAGRAPHTEXT) {
        return "PARAGRAPHTEXT";
    } else if (value === TextType.POINTTEXT) {
        return "POINTTEXT";
    }
}

function mapLanguage(value) {
    if (value === "BRAZILLIANPORTUGUESE") {
        return "BRAZILLIANPORTUGUESE";
    } else if (value === "CANADIANFRENCH") {
        return "CANADIANFRENCH";
    } else if (value === "DANISH") {
        return "DANISH";
    } else if (value === "DUTCH") {
        return "DUTCH";
    } else if (value === "ENGLISHUK") {
        return "ENGLISHUK";
    } else if (value === "ENGLISHUSA") {
        return "ENGLISHUSA";
    } else if (value === "FINNISH") {
        return "FINNISH";
    } else if (value === "FRENCH") {
        return "FRENCH";
    } else if (value === "GERMAN") {
        return "GERMAN";
    } else if (value === "ITALIAN") {
        return "ITALIAN";
    } else if (value === "NORWEGIAN") {
        return "NORWEGIAN";
    } else if (value === "NYNORSKNORWEGIAN") {
        return "NYNORSKNORWEGIAN";
    } else if (value === "OLDGERMAN") {
        return "OLDGERMAN";
    } else if (value === "PORTUGUESE") {
        return "PORTUGUESE";
    } else if (value === "SPANISH") {
        return "SPANISH";
    } else if (value === "SWEDISH") {
        return "SWEDISH";
    } else if (value === "SWISSGERMAN") {
        return "SWISSGERMAN";
    }
}

function mapLayer(input, res, indexPath) {
    res.typename = input.typename;
    res.id = btoa(JSON.stringify(indexPath));
    if (input.typename === "ArtLayer") {
        res.allLocked = input.allLocked;
        res.blendMode = mapBlendMode(input.blendMode);
        res.bounds = mapArray(input.bounds, mapUnitValue);
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

        // Map textItem
        if (input.kind === LayerKind.TEXT) {
            res.textItem = {};
            res.textItem.alternateLigatures = input.textItem.alternateLigatures;
            // res.textItem.antiAliasMethod = input.textItem.antiAliasMethod;
            // res.textItem.autoKerning = input.textItem.autoKerning;
            res.textItem.autoLeadingAmount = input.textItem.autoLeadingAmount;
            // res.textItem.baselineShift = input.textItem.baselineShift;
            res.textItem.capitalization = input.textItem.capitalization;
            // res.textItem.color = input.textItem.color;
            res.textItem.contents = input.textItem.contents;
            res.textItem.desiredGlyphScaling = input.textItem.desiredGlyphScaling;
            res.textItem.desiredLetterScaling = input.textItem.desiredLetterScaling;
            res.textItem.desiredWordScaling = input.textItem.desiredWordScaling;
            res.textItem.direction = input.textItem.direction;
            res.textItem.fauxBold = input.textItem.fauxBold;
            res.textItem.fauxItalic = input.textItem.fauxItalic;
            res.textItem.firstLineIndent = input.textItem.firstLineIndent;
            res.textItem.font = input.textItem.font;
            res.textItem.hangingPunctation = input.textItem.hangingPunctation;
            if (res.textItem.kind === TextType.PARAGRAPHTEXT) {
                res.textItem.height = mapUnitValue(input.textItem.height);
            }
            res.textItem.horizontalScale = input.textItem.horizontalScale;
            res.textItem.hyphenateAfterFirst = input.textItem.hyphenateAfterFirst;
            res.textItem.hyphenateBeforeLast = input.textItem.hyphenateBeforeLast;
            res.textItem.hyphenateCapitalWords = input.textItem.hyphenateCapitalWords;
            res.textItem.hyphenateWordsLongerThen = input.textItem.hyphenateWordsLongerThen;
            res.textItem.hyphenation = input.textItem.hyphenation;
            res.textItem.hyphenationZone = input.textItem.hyphenationZone;
            res.textItem.hyphenLimit = input.textItem.hyphenLimit;
            res.textItem.justification = input.textItem.justification;
            res.textItem.justification = mapJustification(input.textItem.justification);
            res.textItem.kind = mapTextType(input.textItem.kind);
            res.textItem.language = mapLanguage(input.textItem.language);
            res.textItem.language = mapLanguage(input.textItem.language);
            res.textItem.leading = mapUnitValue(input.textItem.leading);
            res.textItem.leftIndent = mapUnitValue(input.textItem.leftIndent);
            res.textItem.ligatures = input.textItem.ligatures;
            res.textItem.maximumGlyphScaling = input.textItem.maximumGlyphScaling;
            res.textItem.maximumLetterScaling = input.textItem.maximumLetterScaling;
            res.textItem.maximumWordScaling = input.textItem.maximumWordScaling;
            res.textItem.minimumGlyphScaling = input.textItem.minimumGlyphScaling;
            res.textItem.minimumLetterScaling = input.textItem.minimumLetterScaling;
            res.textItem.minimumWordScaling = input.textItem.minimumWordScaling;
            res.textItem.noBreak = input.textItem.noBreak;
            res.textItem.oldStyle = input.textItem.oldStyle;
            res.textItem.position = mapArray(input.textItem.position, mapUnitValue);
            res.textItem.rightIndent = mapUnitValue(input.textItem.rightIndent);
            res.textItem.size = mapUnitValue(input.textItem.size);
            res.textItem.spaceAfter = mapUnitValue(input.textItem.spaceAfter);
            res.textItem.spaceBefore = mapUnitValue(input.textItem.spaceBefore);
            res.textItem.useAutoLeading = input.textItem.useAutoLeading;
            res.textItem.verticalScale = input.textItem.verticalScale;
            // res.textItem.width = mapUnitValue(input.textItem.width);
        }

        res.transparentPixelsLocked = input.transparentPixelsLocked;
        // res.vectorMaskDensity = input.vectorMaskDensity;
        // res.vectorMaskFeather = input.vectorMaskFeather;
        res.visible = input.visible;
    } else if (input.typename === "LayerSet") {
        res.allLocked = input.allLocked;
        res.blendMode = mapBlendMode(input.blendMode);
        res.bounds = mapArray(input.bounds, mapUnitValue);
        // res.enabledChannels = input.enabledChannels;

        res.layers = [];
        for (let i = 0; i < input.layers.length; i++) {
            const deepRes = {};
            const subIndexPath = JSON.parse(JSON.stringify(indexPath));
            subIndexPath.push(i);
            mapLayer(input.layers[i], deepRes, subIndexPath);
            res.layers.push(deepRes);
        }

        // res.linkedLayers = input.linkedLayers;
        res.name = input.name;
        res.opacity = input.opacity;
        res.visible = input.visible;
    }
}
function mapDocumentMode(value) {
    if (value === DocumentMode.BITMAP) {
        return "BITMAP";
    } else if (value === DocumentMode.CMYK) {
        return "CMYK";
    } else if (value === DocumentMode.DUOTONE) {
        return "DUOTONE";
    } else if (value === DocumentMode.GRAYSCALE) {
        return "GRAYSCALE";
    } else if (value === DocumentMode.INDEXEDCOLOR) {
        return "INDEXEDCOLOR";
    } else if (value === DocumentMode.LAB) {
        return "LAB";
    } else if (value === DocumentMode.MULTICHANNEL) {
        return "MULTICHANNEL";
    } else if (value === DocumentMode.RGB) {
        return "RGB";
    }
}

let res = {};

res.name = app.activeDocument.name;
res.height = app.activeDocument.height;
res.mode = mapDocumentMode(app.activeDocument.mode);
res.resolution = app.activeDocument.resolution;
res.width = app.activeDocument.width;

res.layers = [];
for (let i = 0; i < app.activeDocument.layers.length; i++) {
    let resLayer = {};
    mapLayer(app.activeDocument.layers[i], resLayer, [i]);
    res.layers.push(resLayer);
}
`;

class PPActionProcessorGetInfo implements PPActionProcessor {
  constructor(private action: PPActionGetInfo) {}

  async process(state: PPActionProcessorState): Promise<void> {
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
      throw new Error(`Info result is expected to be a string.`);
    }

    const info: DocumentInfo = JSON.parse(infoRes);

    const oldDocsLengthStr = await executeScript(
      state.iframe,
      "app.echoToOE(JSON.stringify(app.documents.length));"
    );

    if (typeof oldDocsLengthStr !== "string") {
      throw new Error(`Expected to be a string.`);
    }

    const oldDocsLength = JSON.parse(oldDocsLengthStr);

    await this.populateSmartObjectInfo(state, info.layers, sourceIndex);

    const newDocsLengthStr = await executeScript(
      state.iframe,
      "app.echoToOE(JSON.stringify(app.documents.length));"
    );

    if (typeof newDocsLengthStr !== "string") {
      throw new Error(`Expected to be a string.`);
    }

    const newDocsLength = JSON.parse(newDocsLengthStr);

    for (let i = newDocsLength - 1; i >= oldDocsLength; i--) {
      await executeScript(
        state.iframe,
        `app.documents[${JSON.stringify(i)}].close();`
      );
    }

    state.result.push({
      type: "GetInfo",
      id: this.action.resultId,
      info: info,
    });
  }

  async populateSmartObjectInfo(
    state: PPActionProcessorState,
    layers: LayerInfo[],
    sourceIndex: number
  ): Promise<void> {
    for (const layer of layers) {
      if (layer.typename === "LayerSet") {
        await this.populateSmartObjectInfo(state, layer.layers, sourceIndex);
      } else if (layer.kind === "SMARTOBJECT") {
        const parsedLayerId = tryParseLayerId(layer.id);
        if (!parsedLayerId) {
          throw new ValidationError(`Layer '${layer.id}' not found.`);
        }

        const openSmartObjectScript = `
${exposeFindLayerFunction}

app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];
const indexPath = ${parsedLayerId.indexPathJson};
const layer = findLayer(app.activeDocument.layers, indexPath);
if (!layer) {
    app.echoToOE("ValidationError:Layer '${layer.id}' not found.");
}

const oldLength = app.documents.length;

app.activeDocument.activeLayer = layer;
app.echoToOE('expect-additional-done');
executeAction(stringIDToTypeID("placedLayerEditContents"));

// If smart object is already loaded, just post expected 'done'
if (app.documents.length === oldLength) {
    app.echoToOE('done');
}

const res = {};
const prefix = "____id-";

app.activeDocument.activeLayer = app.activeDocument.layers[0];
if (app.activeDocument.activeLayer.name.startsWith(prefix)) {
    res.id = app.activeDocument.activeLayer.name.slice(prefix.length);
} else {
    const newLayer = app.activeDocument.layers.add();
    newLayer.visible = false;
    newLayer.name = prefix + ${JSON.stringify(layer.id)};

    res.id = ${JSON.stringify(layer.id)};
}

res.height = app.activeDocument.height;
res.width = app.activeDocument.width;

app.echoToOE(JSON.stringify(res));
`;

        const smartObjectInfoRes = await executeScript(
          state.iframe,
          openSmartObjectScript
        );

        if (typeof smartObjectInfoRes !== "string") {
          throw new Error(`smartObjectInfoRes is expected to be a string.`);
        }

        layer.smartObjectInfo = JSON.parse(smartObjectInfoRes);
      }
    }
  }
}

export default PPActionProcessorGetInfo;
