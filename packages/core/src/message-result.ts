import type { DocumentInfo } from "./document-info.js";

export interface MessageResultExportBlob {
  type: "MessageResultExportBlob";
  id: string;
  blob: Blob;
}

export interface MessageResultExportDataURL {
  type: "MessageResultExportDataURL";
  id: string;
  url: string;
}

export interface MessageResultGetInfo {
  type: "MessageResultGetInfo";
  id: string;
  info: DocumentInfo;
}

export type MessageResult =
  | MessageResultExportBlob
  | MessageResultExportDataURL
  | MessageResultGetInfo;
