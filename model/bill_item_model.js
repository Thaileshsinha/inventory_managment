import mongoose from "mongoose";

const billItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "item_model",
      required: true,
    },
    billId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bill_model",
    },
    quantity: {
      type: Number,
      required: true,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bill_item_model = mongoose.model("bill_item_model", billItemSchema);

export default bill_item_model;
