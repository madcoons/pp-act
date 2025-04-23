export const blobToDataURL = async (blob: Blob) => {
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const res = reader.result;
      if (!res) {
        reject(new Error("Something went wrong. Reader result is null."));
        return;
      }

      if (res instanceof ArrayBuffer) {
        reject(new Error("Something went wrong. Reader result ArrayBuffer."));
        return;
      }

      resolve(res);
    };
    reader.readAsDataURL(blob);
  });

  return url;
};
