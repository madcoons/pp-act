export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  if (hex.length !== 7) {
    return null;
  }

  if (hex[0] !== "#") {
    return null;
  }

  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null;
  }

  return { r, g, b };
};
