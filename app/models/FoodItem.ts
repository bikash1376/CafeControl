// models/FoodItem.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFoodItem extends Document {
  name: string;
  price: number;
}

const FoodItemSchema = new Schema<IFoodItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FoodItem ||
  mongoose.model<IFoodItem>("FoodItem", FoodItemSchema);
