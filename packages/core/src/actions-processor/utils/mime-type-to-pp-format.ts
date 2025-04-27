import { ValidationError } from "../../errors/validation-error.js";

export const mimeTypeToPPFormat = (
  mimeType: "image/png" | "image/jpeg" | "image/webp",
  quality?: number
) => {
  let format: string;
  if (mimeType === "image/png") {
    format = "png";
  } else if (mimeType === "image/jpeg") {
    format = `jpg:${quality}`;
  } else if (mimeType === "image/webp") {
    format = `webp:${quality}`;
  } else {
    const neverValue: never = mimeType;
    throw new ValidationError(`MimeType '${neverValue}' is not supported.`);
  }

  return format;
};
