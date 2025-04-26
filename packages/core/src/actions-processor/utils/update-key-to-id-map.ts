import { executeScript } from "../../pp-interop/execute-script.js";
import countDocsScript from "../../known-scripts/count-docs-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";

export const updateKeyToIdMap = async (
  key: string | undefined | null,
  state: PPActionProcessorState
) => {
  const docsCountRes = await executeScript(state.iframe, countDocsScript);
  if (typeof docsCountRes !== "string") {
    throw new Error("Something went wrong. Result should be string.");
  }

  const docsCount = parseInt(docsCountRes);
  if (docsCount === state.documentCount + 1) {
    if (!key) {
      throw new Error("Key is required on this type of input.");
    }

    state.documentKeyToIndexMap.set(key, state.documentCount);
    state.documentCount++;
  } else if (docsCount === state.documentCount) {
    if (key) {
      throw new Error("Key is not supported on this type of input.");
    }
  } else {
    throw new Error(
      `Something went wrong. Document count ${docsCount} is not expected for state count ${state.documentCount}.`
    );
  }
};
