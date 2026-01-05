// Splits array into chunks: [1,2,3,4,5,6,7], 3 → [[1,2,3], [4,5,6], [7]]
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
