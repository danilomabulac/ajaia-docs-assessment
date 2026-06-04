export const MAX_IMPORT_SIZE = 1024 * 1024;

export function validateImport(file: { name: string; type: string; size: number }) {
  const supported = ["text/plain", "text/markdown"].includes(file.type) || /\.(txt|md)$/i.test(file.name);
  if (!supported) return "Only .txt and .md files are supported.";
  if (file.size > MAX_IMPORT_SIZE) return "Files must be 1 MB or smaller.";
  return null;
}
