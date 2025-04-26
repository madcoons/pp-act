
export interface PPActionExportBlob {
  type: "ExportBlob";
  sourceId: string;
  resultId: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}
