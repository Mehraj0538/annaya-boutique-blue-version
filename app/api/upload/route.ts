import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import cloudinary from "@/lib/cloudinary";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req);
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No image file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const b64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "annaya-boutique/products",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Upload failed", error: msg }, { status: 500 });
  }
}
