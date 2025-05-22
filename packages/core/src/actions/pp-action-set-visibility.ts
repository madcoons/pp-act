export interface PPActionSetVisibility {
  type: "SetVisibility";
  targetId: string;
  layerId: string;
  visible: boolean;
}
