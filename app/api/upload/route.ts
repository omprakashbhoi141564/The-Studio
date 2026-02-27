import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const mime = file.type?.toLowerCase() || "";
  if (!mime.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  if (mime.includes("heic") || mime.includes("heif")) {
    return NextResponse.json(
      { error: "HEIC/HEIF is not supported. Please upload JPG, PNG, WebP, or SVG." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || ".png";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const fullPath = path.join(uploadDir, safeName);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return NextResponse.json({ path: `/uploads/${safeName}` });
}
