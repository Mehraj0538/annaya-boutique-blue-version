import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ addressId: string }> }
) {
  const { addressId } = await params;
  const auth0Id = req.nextUrl.searchParams.get("auth0Id");
  if (!auth0Id) return NextResponse.json({ message: "auth0Id is required" }, { status: 400 });

  try {
    await connectDB();
    const user = await User.findOne({ auth0Id });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    user.addresses = user.addresses.filter(
      (a: { _id: { toString: () => string } }) => a._id.toString() !== addressId
    );
    await user.save();
    return NextResponse.json(user.addresses);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error deleting address", error: msg }, { status: 500 });
  }
}
