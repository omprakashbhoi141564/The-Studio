import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getUploadDir } from "@/lib/uploads";

function getContentType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".avif") return "image/avif";
  return "application/octet-stream";
}

export async function GET(_: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename: fileName } = await context.params;

  if (!fileName || fileName.includes("..") || fileName.includes("/")) {
    return new NextResponse("Invalid file name", { status: 400 });
  }

  const filePath = path.join(getUploadDir(), fileName);

  try {
    const file = await fs.readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": getContentType(fileName),
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
