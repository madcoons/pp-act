
export interface PPActionLoadFromBuffer {
  type: "LoadFromBuffer";
  targetId?: string;
  buffer: ArrayBuffer;
}
