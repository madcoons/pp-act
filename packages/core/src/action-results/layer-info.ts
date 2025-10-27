import type { SmartObjectInfo } from "./smart-object-info.js";

export type TextType = "PARAGRAPHTEXT" | "POINTTEXT";

export interface TextItemInfo {
  content: boolean;
  fauxBold: boolean;
  fauxItalic: boolean;
  font: string;
  height?: number;
  horizontalScale: number;
  justification: string;
  kind: TextType;
  leading: number;
  ligatures: boolean;
  position: number[];
  size: number;
  useAutoLeading: boolean;
  verticalScale: number;
}

export interface LayerInfoBase {
  typename: string;
  id: string;
}

export type LayerKind =
  | "BLACKANDWHITE"
  | "BRIGHTNESSCONTRAST"
  | "CHANNELMIXER"
  | "COLORBALANCE"
  | "CURVES"
  | "EXPOSURE"
  | "GRADIENTFILL"
  | "GRADIENTMAP"
  | "HUESATURATION"
  | "INVERSION"
  | "LEVELS"
  | "NORMAL"
  | "PATTERNFILL"
  | "PHOTOFILTER"
  | "POSTERIZE"
  | "SELECTIVECOLOR"
  | "SMARTOBJECT"
  | "SOLIDFILL"
  | "TEXT"
  | "THRESHOLD"
  | "LAYER3D"
  | "VIBRANCE"
  | "VIDEO";

export interface ArtLayerInfo extends LayerInfoBase {
  typename: "ArtLayer";
  allLocked: boolean;
  blendMode: string;
  bounds: number[];
  fillOpacity: number;
  grouped: boolean;
  isBackgroundLayer: boolean;
  kind: LayerKind;
  name: string;
  opacity: number;
  pixelsLocked: boolean;
  positionLocked: boolean;
  textItem?: TextItemInfo;
  smartObjectInfo?: SmartObjectInfo;
  transparentPixelsLocked: boolean;
  visible: boolean;
}

export interface LayerSetInfo extends LayerInfoBase {
  typename: "LayerSet";
  allLocked: boolean;
  bounds: number[];
  layers: LayerInfo[];
  name: string;
  opacity: number;
  visible: boolean;
}

export type LayerInfo = ArtLayerInfo | LayerSetInfo;
