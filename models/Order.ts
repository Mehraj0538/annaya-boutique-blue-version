import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    image: string;
    size: string;
    color: string;
    qty: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    deliveryNotes?: string;
  };
  paymentMethod: "razorpay" | "whatsapp";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      name: String,
      image: String,
      size: String,
      color: String,
      qty: Number,
      price: Number,
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    deliveryNotes: String,
  },
  paymentMethod: { type: String, enum: ["razorpay", "whatsapp"], required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
