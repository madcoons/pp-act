
export interface PPActionExportDataURL {
  type: "ExportDataURL";
  sourceId: string;
  resultId: string;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
  quality?: number;
}
