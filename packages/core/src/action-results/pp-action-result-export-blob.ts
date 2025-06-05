export interface PPActionResultExportBlob {
  type: "ExportBlob";
  id: string;
  blob: Blob;
  width: number;
  height: number;
}
