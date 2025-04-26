import type { PPActionLoadFromUrl } from "../../actions/pp-action-load-from-url.js";
import { executeScript } from "../../pp-interop/execute-script.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { updateKeyToIdMap } from "../utils/update-key-to-id-map.js";

class PPActionProcessorLoadFromUrl implements PPActionProcessor {
  constructor(private action: PPActionLoadFromUrl) {}

  async process(state: PPActionProcessorState): Promise<void> {
    const script =
      `app.echoToOE("expect-additional-done");\n` +
      `app.open(${JSON.stringify(this.action.url)});\n`;

    await executeScript(state.iframe, script);
    await updateKeyToIdMap(this.action.targetId, state);
  }
}

export default PPActionProcessorLoadFromUrl;
