export interface MessageActionExport {
  type: "MessageActionExport";
  sourceId: string;
  targetId: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
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
  | MessageActionLoadFromBuffer
  | MessageActionLoadFromUrl;
