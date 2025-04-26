import type { PPActionResult } from "../action-results/pp-action-result.js";

export class PPActionProcessorState {
  readonly iframe: HTMLIFrameElement;
  documentCount: number;
  readonly documentKeyToIndexMap: Map<string, number>;
  readonly result: PPActionResult[];

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.documentCount = 0;
    this.documentKeyToIndexMap = new Map<string, number>();
    this.result = [];
  }
}
