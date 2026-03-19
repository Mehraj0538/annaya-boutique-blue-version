import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  items: {
    productId?: mongoose.Types.ObjectId;
    name: string;
    image: string;
    size: string;
    color: string;
    qty: number;
    price: number;
  }[];
  shippingAddress?: {
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
  paymentMethod: "whatsapp" | "cod" | "bank_transfer";
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  totalAmount: number;
  notes?: string;
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
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    deliveryNotes: String,
  },
  paymentMethod: {
    type: String,
    enum: ["whatsapp", "cod", "bank_transfer"],
    default: "whatsapp",
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
