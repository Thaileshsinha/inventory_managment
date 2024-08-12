import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    quantityInStock: {
      type: Number,
      required: true,
    },
    category: String,
  },
  {
    timestamps: true,
  }
);

const item_model = mongoose.model("item_model", itemSchema);

export default item_model;
