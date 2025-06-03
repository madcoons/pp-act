import type { PPActionDownscale } from "./pp-action-downscale.js";
import type { PPActionDuplicateIntoSmartObjectLayer } from "./pp-action-duplicate-into-smart-object-layer.js";
import type { PPActionExportBlob } from "./pp-action-export-blob.js";
import type { PPActionExportDataURL } from "./pp-action-export-dataurl.js";
import type { PPActionGetInfo } from "./pp-action-get-info.js";
import type { PPActionLoadFromBuffer } from "./pp-action-load-from-buffer.js";
import type { PPActionLoadFromUrl } from "./pp-action-load-from-url.js";
import type { PPActionSetColor } from "./pp-action-set-color.js";
import type { PPActionSetText } from "./pp-action-set-text.js";
import type { PPActionSetVisibility } from "./pp-action-set-visibility.js";

export type PPAction =
  | PPActionDownscale
  | PPActionDuplicateIntoSmartObjectLayer
  | PPActionExportBlob
  | PPActionExportDataURL
  | PPActionGetInfo
  | PPActionLoadFromBuffer
  | PPActionLoadFromUrl
  | PPActionSetColor
  | PPActionSetText
  | PPActionSetVisibility;
