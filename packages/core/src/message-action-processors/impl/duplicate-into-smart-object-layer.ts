import { executeScript } from "../../execute-script.js";
import { exposeDuplicateDocumentFunction } from "../../known-scripts/expose-duplicate-document-function.js";
import { exposeFindLayerFunction } from "../../known-scripts/expose-find-layer-funciton.js";
import type { MessageActionDuplicateIntoSmartObjectLayer } from "../../message-action.js";
import ValidationError from "../../validation-error.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";
import { tryParseLayerId } from "../utils/layer-id-parser.js";

class MessageActionProcessorDuplicateIntoSmartObjectLayer
  implements MessageActionProcessor
{
  constructor(private action: MessageActionDuplicateIntoSmartObjectLayer) {}

  async process(state: MessageActionProcessorState): Promise<void> {
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

    const flattenSource = `
    app.activeDocument = app.documents[app.documents.length - 1];
    app.activeDocument.flatten();
    `;

    // await executeScript(state.iframe, flattenSource);
    // await new Promise((r) => setTimeout(r, 1_000));

    // TODO: resize duplicated source

    // TODO: duplicate layer to smart object
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

    // TODO: position layer

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

export default MessageActionProcessorDuplicateIntoSmartObjectLayer;
