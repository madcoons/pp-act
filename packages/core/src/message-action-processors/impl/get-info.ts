import { executeScript } from "../../execute-script.js";
import type { MessageActionGetInfo } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";

const populateJsonScript = `
let res = {};
res.name = app.activeDocument.name;

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

function mapLayer(input, res) {
    res.typename = input.typename;
    if (input.typename === "ArtLayer") {
        res.allLocked = input.allLocked;
        // res.blendMode = input.blendMode;
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
            mapLayer(input.layers[i], deepRes);
            res.layers.push(deepRes);
        }

        // res.linkedLayers = input.linkedLayers;
        res.name = input.name;
        res.opacity = input.opacity;
        res.visible = input.visible;
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
