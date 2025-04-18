import type { MessageActionProcessorState } from "./message-action-processor-state.js";

export interface MessageActionProcessor {
    process(state: MessageActionProcessorState): Promise<void>;
}