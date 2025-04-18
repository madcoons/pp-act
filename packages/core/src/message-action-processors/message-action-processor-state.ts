import type { MessageResult } from "../message-result.js";

export class MessageActionProcessorState {
  readonly iframe: HTMLIFrameElement;
  documentCount: number;
  readonly documentKeyToIndexMap: Map<string, number>;
  readonly result: MessageResult[];

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.documentCount = 0;
    this.documentKeyToIndexMap = new Map<string, number>();
    this.result = [];
  }
}
