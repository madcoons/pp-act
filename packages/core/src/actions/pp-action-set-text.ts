export interface PPActionSetText {
  type: "SetText";
  targetId: string;
  layerId: string;
  text: string;
  colorHex: string;
}
