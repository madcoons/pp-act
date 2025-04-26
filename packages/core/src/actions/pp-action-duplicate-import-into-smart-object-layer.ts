export interface PPActionDuplicateIntoSmartObjectLayer {
  type: "DuplicateIntoSmartObjectLayer";
  sourceId: string;
  targetId: string;
  layerId: string;
  /**
   * Could be `fill`, `contain`, `cover`, `none`, `scale-down`, `width` or `height`.
   * Refer to CSS `object-fit` for more details.
   */
  fit: string;
  /**
   * Refer to CSS `object-position` for more details.
   */
  position: string;
  clearSmartObject: boolean;
}
