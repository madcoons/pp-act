import type { LayerInfo } from "./layer-info.js";

export interface DocumentInfo {
  name: string;
  height: number;
  mode: string;
  resolution: number;
  width: number;
  layers: LayerInfo[];
}
