export interface PPActionSetColor {
  type: "SetColor";
  targetId: string;
  layerId: string;
  colorHex: string;
}
