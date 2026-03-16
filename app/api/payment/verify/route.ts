import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = await req.json();

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder")
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    await connectDB();

    let finalUserId = undefined;
    let finalShippingAddress = undefined;

    if (orderDetails.userId) {
      const user = await User.findOne({ auth0Id: orderDetails.userId });
      if (user) {
        finalUserId = user._id;
        if (orderDetails.selectedAddressId && user.addresses) {
          finalShippingAddress = user.addresses.find(
            (a: { _id: { toString: () => string } }) =>
              a._id.toString() === orderDetails.selectedAddressId
          );
        }
        if (!finalShippingAddress && user.addresses.length > 0) {
          finalShippingAddress = user.addresses[0];
        }
      }
    }

    const newOrder = new Order({
      ...orderDetails,
      userId: finalUserId,
      shippingAddress: finalShippingAddress,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "Processing",
    });
    await newOrder.save();

    return NextResponse.json({ message: "Payment verified successfully", orderId: newOrder._id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Error verifying payment", error: msg }, { status: 500 });
  }
}
