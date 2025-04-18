export interface TextItemInfo {
  content: boolean;
  fauxBold: boolean;
  fauxItalic: boolean;
  font: string;
  height?: number;
  horizontalScale: number;
  justification: string;
  kind: string;
  leading: number;
  ligatures: boolean;
  position: number[];
  size: number;
  useAutoLeading: boolean;
  verticalScale: number;
}

export interface LayerInfoBase {
  typename: string;
}

export interface ArtLayerInfo {
  typename: "ArtLayer";
  allLocked: boolean;
  blendMode: string;
  bounds: number[];
  fillOpacity: number;
  grouped: boolean;
  isBackgroundLayer: boolean;
  kind: string;
  name: string;
  opacity: number;
  pixelsLocked: boolean;
  positionLocked: boolean;
  textItem?: TextItemInfo;
  transparentPixelsLocked: boolean;
  visible: boolean;
}

export interface LayerSetInfo {
  typename: "LayerSet";
  allLocked: boolean;
  bounds: number[];
  layers: LayerInfo[];
  name: string;
  opacity: number;
  visible: boolean;
}

export type LayerInfo = ArtLayerInfo | LayerSetInfo;
