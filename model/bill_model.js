import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    customerName: String,
    customerPhone: String,
    billItemId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bill_item_model",
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Online"],
      default: "Cash",
    },
  },
  {
    timestamps: true,
  }
);

const bill_model = mongoose.model("bill_model", billSchema);

export default bill_model;
