export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  const binaryString = String.fromCharCode(...uint8Array);
  return btoa(binaryString);
};
