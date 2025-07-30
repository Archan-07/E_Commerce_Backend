import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalamount: {
      type: Number,
      required: true,
    },
    paymentstatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    shipmentstatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "returned"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
