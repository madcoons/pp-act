import type { PPActionResultExportBlob } from "./pp-action-result-export-blob.js";
import type { PPActionResultExportDataURL } from "./pp-action-result-export-dataurl.js";
import type { PPActionResultGetInfo } from "./pp-action-result-get-info.js";

export type PPActionResult =
  | PPActionResultExportBlob
  | PPActionResultExportDataURL
  | PPActionResultGetInfo;
