import type { DocumentInfo } from "./document-info.js";

export interface PPActionResultGetInfo {
  type: "GetInfo";
  id: string;
  info: DocumentInfo;
}
