import { Schema, model, Document } from "mongoose";

// Ingredient Interface
export interface IIngredient extends Document {
  name: string;
  quantity: object;
  price: number;
}

// Ingredient Schema to create a coffee
const ingredientSchema = new Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Object, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Ingredient = model<IIngredient>("Ingredient", ingredientSchema);
