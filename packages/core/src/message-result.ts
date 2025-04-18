import type { DocumentInfo } from "./document-info.js";

export interface MessageResultExport {
  type: "MessageResultExport";
  id: string;
  data: ArrayBuffer;
}

export interface MessageResultGetInfo {
  type: "MessageResultGetInfo";
  id: string;
  info: DocumentInfo;
}

export type MessageResult = MessageResultExport | MessageResultGetInfo;
