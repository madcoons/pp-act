import MessageActionProcessorDuplicateIntoSmartObjectLayer from "./message-action-processors/impl/duplicate-into-smart-object-layer.js";
import MessageActionProcessorExport from "./message-action-processors/impl/export.js";
import MessageActionProcessorGetInfo from "./message-action-processors/impl/get-info.js";
import MessageActionProcessorLoadFromBuffer from "./message-action-processors/impl/load-from-buffer.js";
import MessageActionProcessorLoadFromUrl from "./message-action-processors/impl/load-from-url.js";
import { MessageActionProcessorState } from "./message-action-processors/message-action-processor-state.js";
import type { Message } from "./message.js";

export const processMessage = async (
  iframe: HTMLIFrameElement,
  message: Message
) => {
  const state = new MessageActionProcessorState(iframe);

  for (const action of message.actions) {
    if (action.type === "MessageActionDuplicateIntoSmartObjectLayer") {
      await new MessageActionProcessorDuplicateIntoSmartObjectLayer(
        action
      ).process(state);
    } else if (action.type === "MessageActionExport") {
      await new MessageActionProcessorExport(action).process(state);
    } else if (action.type === "MessageActionGetInfo") {
      await new MessageActionProcessorGetInfo(action).process(state);
    } else if (action.type === "MessageActionLoadFromBuffer") {
      await new MessageActionProcessorLoadFromBuffer(action).process(state);
    } else if (action.type === "MessageActionLoadFromUrl") {
      await new MessageActionProcessorLoadFromUrl(action).process(state);
    } else {
      throw new Error(`Action '${JSON.stringify(action)}' is not supported.`);
    }
  }

  return state.result;
};
