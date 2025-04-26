import type { PPActionProcessorState } from "./pp-action-processor-state.js";

export interface PPActionProcessor {
  process(state: PPActionProcessorState): Promise<void>;
}
