import type { MessageResult } from "../message-result.js";

export class MessageActionProcessorState {
  readonly iframe: HTMLIFrameElement;
  documentCount: number;
  readonly documentKeyToIdMap: Map<string, string>;
  readonly result: MessageResult[];

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.documentCount = 0;
    this.documentKeyToIdMap = new Map<string, string>();
    this.result = [];
  }
}
