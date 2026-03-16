import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
  } catch {
    // ignore
  }
  return NextResponse.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
}
