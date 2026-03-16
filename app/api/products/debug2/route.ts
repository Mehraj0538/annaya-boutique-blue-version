import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  return NextResponse.json({ 
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    models: Object.keys(mongoose.models)
  });
}
