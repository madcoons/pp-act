import type { PPAction } from "../actions/pp-action.js";
import PPActionProcessorDuplicateIntoSmartObjectLayer from "./impl/duplicate-into-smart-object-layer.js";
import PPActionProcessorExportBlob from "./impl/export-blob.js";
import PPActionProcessorExportDataURL from "./impl/export-dataurl.js";
import PPActionProcessorGetInfo from "./impl/get-info.js";
import PPActionProcessorLoadFromBuffer from "./impl/load-from-buffer.js";
import PPActionProcessorLoadFromUrl from "./impl/load-from-url.js";
import PPActionProcessorSetColor from "./impl/set-color.js";
import PPActionProcessorSetText from "./impl/set-text.js";
import PPActionProcessorSetVisibility from "./impl/set-visibility.js";
import { PPActionProcessorState } from "./pp-action-processor-state.js";

export const processActions = async (
  iframe: HTMLIFrameElement,
  actions: PPAction[]
) => {
  const state = new PPActionProcessorState(iframe);

  for (const action of actions) {
    if (action.type === "DuplicateIntoSmartObjectLayer") {
      await new PPActionProcessorDuplicateIntoSmartObjectLayer(action).process(
        state
      );
    } else if (action.type === "ExportBlob") {
      await new PPActionProcessorExportBlob(action).process(state);
    } else if (action.type === "ExportDataURL") {
      await new PPActionProcessorExportDataURL(action).process(state);
    } else if (action.type === "GetInfo") {
      await new PPActionProcessorGetInfo(action).process(state);
    } else if (action.type === "LoadFromBuffer") {
      await new PPActionProcessorLoadFromBuffer(action).process(state);
    } else if (action.type === "LoadFromUrl") {
      await new PPActionProcessorLoadFromUrl(action).process(state);
    } else if (action.type === "SetColor") {
      await new PPActionProcessorSetColor(action).process(state);
    } else if (action.type === "SetText") {
      await new PPActionProcessorSetText(action).process(state);
    } else if (action.type === "SetVisibility") {
      await new PPActionProcessorSetVisibility(action).process(state);
    } else {
      const neverAction: never = action;
      throw new Error(
        `Action '${JSON.stringify(neverAction)}' is not supported.`
      );
    }
  }

  return state.result;
};
