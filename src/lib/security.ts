import { createHash, randomBytes } from "crypto";
import path from "path";
import { promises as fs } from "fs";

const MAX_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export function hashIp(ip?: string | null) {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export function isLockedOut(recentFailures: number) {
  return recentFailures >= MAX_LOGIN_ATTEMPTS;
}

export function loginWindowStart() {
  return new Date(Date.now() - MAX_LOGIN_WINDOW_MS);
}

export function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

export async function saveSafeImage(file: File, folder: "projects" | "team" | "sliders") {
  if (!file || file.size === 0) {
    throw new Error("No file uploaded");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image exceeds 8MB limit");
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Unsupported image type");
  }

  const ext = path.extname(file.name || "").toLowerCase() || mimeToExt(file.type);
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Unsupported image extension");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Basic magic-byte check
  if (!looksLikeImage(buffer, file.type)) {
    throw new Error("File content does not match image type");
  }

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const relative = `/uploads/${folder}/${filename}`;
  const absolute = path.join(process.cwd(), "public", "uploads", folder, filename);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, buffer);
  return relative;
}

function mimeToExt(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

function looksLikeImage(buf: Buffer, mime: string) {
  if (buf.length < 12) return false;
  if (mime === "image/jpeg") return buf[0] === 0xff && buf[1] === 0xd8;
  if (mime === "image/png") return buf[0] === 0x89 && buf[1] === 0x50;
  if (mime === "image/gif") return buf.slice(0, 3).toString() === "GIF";
  if (mime === "image/webp") return buf.slice(0, 4).toString() === "RIFF";
  return false;
}

export const SECURITY = {
  MAX_LOGIN_ATTEMPTS,
  MAX_LOGIN_WINDOW_MS,
  MAX_UPLOAD_BYTES,
};
