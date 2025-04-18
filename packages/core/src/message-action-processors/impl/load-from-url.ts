import { executeScript } from "../../execute-script.js";
import type { MessageActionLoadFromUrl } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";
import { updateKeyToIdMap } from "../utils/update-key-to-id-map.js";

class MessageActionProcessorLoadFromUrl implements MessageActionProcessor {
  constructor(private action: MessageActionLoadFromUrl) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    const script =
      `app.echoToOE("expect-additional-done");\n` +
      `app.open(${JSON.stringify(this.action.url)});\n`;

    await executeScript(state.iframe, script);
    await updateKeyToIdMap(this.action.targetId, state);
  }
}

export default MessageActionProcessorLoadFromUrl;
