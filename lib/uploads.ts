import path from "path";

export function getUploadDir(): string {
  // On Render, set UPLOAD_DIR to a persistent disk mount path.
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
}

export function getSafeUploadName(originalName: string): string {
  const ext = path.extname(originalName) || ".png";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext.toLowerCase()}`;
}

export function getUploadPublicPath(fileName: string): string {
  return `/api/uploads/${fileName}`;
}
