export interface MessageActionDuplicateIntoSmartObjectLayer {
  type: "MessageActionDuplicateIntoSmartObjectLayer";
  sourceId: string;
  targetId: string;
  layerId: string;
  /**
   * Could be `fill`, `contain`, `cover`, `none`, `scale-down`, `width` or `height`.
   * Refer to CSS `object-fit` for more details.
   */
  fit: string;
  /**
   * Refer to CSS `object-position` for more details.
   */
  position: string;
  clearSmartObject: boolean;
}

export interface MessageActionExportBlob {
  type: "MessageActionExportBlob";
  sourceId: string;
  resultId: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}

export interface MessageActionExportDataURL {
  type: "MessageActionExportDataURL";
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
  | MessageActionDuplicateIntoSmartObjectLayer
  | MessageActionExportBlob
  | MessageActionExportDataURL
  | MessageActionGetInfo
  | MessageActionLoadFromBuffer
  | MessageActionLoadFromUrl;
