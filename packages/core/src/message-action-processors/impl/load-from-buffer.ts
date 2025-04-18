import { loadBuffer } from "../../iframe-brigde/load-buffer.js";
import type { MessageActionLoadFromBuffer } from "../../message-action.js";
import type { MessageActionProcessorState } from "../message-action-processor-state.js";
import type { MessageActionProcessor } from "../message-action-processor.js";

class MessageActionProcessorLoadFromBuffer implements MessageActionProcessor {
  constructor(private action: MessageActionLoadFromBuffer) {}

  async process(state: MessageActionProcessorState): Promise<void> {
    await loadBuffer(state.iframe, this.action.buffer);
  }
}

export default MessageActionProcessorLoadFromBuffer;
