export const tryParseLayerId = (id: string) => {
  let indexPathJson: string;
  let indexPath: number[];
  try {
    indexPathJson = atob(id);
    indexPath = JSON.parse(indexPathJson);
  } catch (_) {
    return null;
  }

  if (
    !Array.isArray(indexPath) ||
    indexPath.length < 1 ||
    indexPath.some((x) => typeof x !== "number")
  ) {
    return null;
  }

  return { indexPathJson, indexPath };
};
