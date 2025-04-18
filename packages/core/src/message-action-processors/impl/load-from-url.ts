import { executeScript } from "../../iframe-brigde/execute-script.js";
import { loadBuffer } from "../../iframe-brigde/load-buffer.js";
import type { MessageActionLoadFromUrl } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";

class MessageActionProcessorLoadFromUrl implements MessageActionProcessor {
  constructor(private action: MessageActionLoadFromUrl) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    const script =
      `app.echoToOE("expect-additional-done");\n` +
      `app.open(${JSON.stringify(this.action.url)});\n`;

    await executeScript(state.iframe, script);
  }
}

export default MessageActionProcessorLoadFromUrl;
