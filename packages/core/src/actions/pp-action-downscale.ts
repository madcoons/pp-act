export interface PPActionDownscale {
  type: "Downscale";
  targetId: string;
  maxWidth: number | null;
  maxHeight: number | null;
}
