import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { auth0Id, name, email, picture } = await req.json();

    if (!auth0Id) return NextResponse.json({ message: "auth0Id is required" }, { status: 400 });

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",")
      : ["mehraj@gmail.com", "imastercharlie786@gmail.com"];

    const role =
      adminEmails.includes(email) || email === "imastercharlie786@gmail.com" ? "admin" : "user";

    const user = await User.findOneAndUpdate(
      { auth0Id },
      { $set: { name, email: email || "no-email@example.com", picture } },
      { returnDocument: "after", upsert: true }
    );

    if (role === "admin" && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    return NextResponse.json(user);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error syncing user", error: msg }, { status: 500 });
  }
}
