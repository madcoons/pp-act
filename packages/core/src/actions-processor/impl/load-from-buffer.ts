import type { PPActionLoadFromBuffer } from "../../actions/pp-action-load-from-buffer.js";
import { loadBuffer } from "../../pp-interop/load-buffer.js";
import type { PPActionProcessorState } from "../pp-action-processor-state.js";
import type { PPActionProcessor } from "../pp-action-processor.js";
import { updateKeyToIdMap } from "../utils/update-key-to-id-map.js";

class PPActionProcessorLoadFromBuffer implements PPActionProcessor {
  constructor(private action: PPActionLoadFromBuffer) {}

  async process(state: PPActionProcessorState): Promise<void> {
    await loadBuffer(state.iframe, this.action.buffer);
    await updateKeyToIdMap(this.action.targetId, state);
  }
}

export default PPActionProcessorLoadFromBuffer;
