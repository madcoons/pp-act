export interface MessageResultExport {
  type: "MessageResultExport";
  targetId: string;
  data: ArrayBuffer;
}

export type MessageResult = MessageResultExport;
