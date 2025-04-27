import type { PPActionDuplicateIntoSmartObjectLayer } from "../../actions/pp-action-duplicate-import-into-smart-object-layer.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import { exposeDuplicateDocumentFunction } from "../../known-scripts/expose-duplicate-document-function.js";
import { exposeEvaluatePositionExpression } from "../../known-scripts/expose-evaluate-position-expression.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import { ValidationError } from "../../errors/validation-error.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";
import { parseObjectPosition } from "../utils/object-position-parser.js";

class PPActionProcessorDuplicateIntoSmartObjectLayer
  implements PPActionProcessor
{
  constructor(private action: PPActionDuplicateIntoSmartObjectLayer) {}

  async process(state: PPActionProcessorState): Promise<void> {
    const sourceIndex = state.documentKeyToIndexMap.get(this.action.sourceId);
    if (sourceIndex === undefined) {
      throw new ValidationError(
        `Source id '${this.action.sourceId}' is not found.`
      );
    }

    const targetIndex = state.documentKeyToIndexMap.get(this.action.targetId);
    if (targetIndex === undefined) {
      throw new ValidationError(
        `Target id '${this.action.sourceId}' is not found.`
      );
    }

    if (sourceIndex === targetIndex) {
      throw new ValidationError(`Source and Target can not be the same.`);
    }

    const parsedLayerId = tryParseLayerId(this.action.layerId);
    if (!parsedLayerId) {
      throw new ValidationError(`Layer '${this.action.layerId}' not found.`);
    }

    const openSmartObjectScript = `
    ${exposeFindLayerFunction}
    
    app.activeDocument = app.documents[${JSON.stringify(targetIndex)}];
    const indexPath = ${parsedLayerId.indexPathJson};
    const layer = findLayer(app.activeDocument.layers, indexPath);
    if (!layer) {
      app.echoToOE("ValidationError:Layer '${this.action.layerId}' not found.");
    }
    
    if (layer.kind !== LayerKind.SMARTOBJECT) {
      app.echoToOE("ValidationError:Layer '${
        this.action.layerId
      }' must be Smart Object.");
    }

    app.activeDocument.activeLayer = layer;

    app.echoToOE('expect-additional-done');
    executeAction(stringIDToTypeID("placedLayerEditContents"));
    `;

    await executeScript(state.iframe, openSmartObjectScript);

    const duplicateSource = `
    ${exposeDuplicateDocumentFunction}
    app.activeDocument = app.documents[${JSON.stringify(sourceIndex)}];
    app.echoToOE("expect-additional-done");
    duplicateDocument();
    `;

    await executeScript(state.iframe, duplicateSource);

    const mergeSourceLayers = `
    app.activeDocument = app.documents[app.documents.length - 1];
    while (app.activeDocument.layers.length > 1) {
      app.activeDocument.layers[0].merge();
    }
    `;

    await executeScript(state.iframe, mergeSourceLayers);

    // TODO: resize duplicated source
    const resizeSourceScript = `
    const sourceWidth = app.documents[app.documents.length - 1].width;
    const sourceHeight = app.documents[app.documents.length -1].height;

    const destinationWidth = app.documents[app.documents.length - 2].width;
    const destinationHeight = app.documents[app.documents.length - 2].height;

    const wScaleDiff = destinationWidth / sourceWidth;
    const hScaleDiff = destinationHeight / sourceHeight;

    const fit = ${JSON.stringify(this.action.fit)};

    
    let scaleX;
    let scaleY;
    
    if (fit === "contain") {
      scaleX = Math.min(wScaleDiff, hScaleDiff);
      scaleY = scaleX;
    } else if (fit === "cover") {
      scaleX = Math.max(wScaleDiff, hScaleDiff);
      scaleY = scaleX;
    } else if (fit === "fill") {
      scaleX = wScaleDiff;
      scaleY = hScaleDiff;
    } else if (fit === "none") {
      scaleX = 1;
      scaleY = 1;
    } else if (fit === "scale-down") {
      scaleX = Math.min(wScaleDiff, hScaleDiff, 1);
      scaleY = scaleX;
    } else if (fit === "width") {
      scaleX = wScaleDiff;
      scaleY = scaleX;
    } else if (fit === "height") {
      scaleX = hScaleDiff;
      scaleY = scaleX;
    } else {
      scaleX = 1;
      scaleY = 1;
    }

    app.activeDocument = app.documents[app.documents.length - 1];
    app.activeDocument.resizeImage(sourceWidth * scaleX, sourceHeight * scaleY);
    `;

    await executeScript(state.iframe, resizeSourceScript);

    const duplicateToSmartLayer =
      `
    app.activeDocument = app.documents[app.documents.length - 1];
    app.activeDocument.layers[0].duplicate(app.documents[app.documents.length - 2]);
    app.activeDocument = app.documents[app.documents.length - 2];
    ` +
      (this.action.clearSmartObject
        ? `
        app.activeDocument = app.documents[app.documents.length - 2];
        for (let i = 1; i < app.activeDocument.layers.length; i++) {
          app.activeDocument.layers[i].remove();
        }
        `
        : "");

    await executeScript(state.iframe, duplicateToSmartLayer);

    const position = parseObjectPosition(this.action.position);
    const positionScript = `
    ${exposeEvaluatePositionExpression}
    
    const sourceWidth = app.documents[app.documents.length - 1].width;
    const sourceHeight = app.documents[app.documents.length -1].height;

    const destinationWidth = app.documents[app.documents.length - 2].width;
    const destinationHeight = app.documents[app.documents.length - 2].height;

    const diffX = destinationWidth - sourceWidth;
    const diffY = destinationHeight - sourceHeight;

    const position = ${JSON.stringify(position)};
    
    const dx = evaluatePositionValue(position.h, diffX * 0.01);
    if (dx) {
      const dy = evaluatePositionValue(position.v, diffY * 0.01);
      if (dy) {
        const oldRulerUnits = app.preferences.rulerUnits;
        app.preferences.rulerUnits = Units.PIXELS;

        app.activeDocument = app.documents[app.documents.length - 2];
        console.log({dx, dy});
        app.activeDocument.layers[0].translate(dx.value, dy.value);

        app.preferences.rulerUnits = oldRulerUnits;
      }
    }
    `;

    await executeScript(state.iframe, positionScript);

    const saveAndClose = `
  app.activeDocument = app.documents[app.documents.length - 2];
  app.activeDocument.save();
  app.activeDocument.close();

  app.activeDocument = app.documents[app.documents.length - 1];
  app.activeDocument.close();
  `;

    await executeScript(state.iframe, saveAndClose);
  }
}

export default PPActionProcessorDuplicateIntoSmartObjectLayer;
