export interface MessageActionExport {
  type: "MessageActionExport";
  sourceId: string;
  resultId: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}

export interface MessageActionGetInfo {
  type: "MessageActionGetInfo";
  sourceId: string;
  resultId: string;
}

export interface MessageActionLoadFromBuffer {
  type: "MessageActionLoadFromBuffer";
  targetId?: string;
  buffer: ArrayBuffer;
}

export interface MessageActionLoadFromUrl {
  type: "MessageActionLoadFromUrl";
  targetId?: string;
  url: string;
}

export type MessageAction =
  | MessageActionExport
  | MessageActionGetInfo
  | MessageActionLoadFromBuffer
  | MessageActionLoadFromUrl;
