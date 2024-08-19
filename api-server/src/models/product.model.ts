import { Schema, model, Document, Types } from "mongoose";
import { IIngredient } from "./ingredient.model";

// enum for coffee orginated from system or admin / thirday_party or customer
export enum Origin {
  SYSTEM = 'system',
  THIRD_PARTY = 'third_party'
}

// Interface for coffee
export interface IProduct extends Document {
  name: string;
  characteristics: object;
  origin: Origin;
  ingredients: IIngredient[];
  price: number;
  addOns: Types.ObjectId[];
}

// Schema for the coffee
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    characteristics: { type: Object, required: true },
    origin: {
      type: String,
      enum: [Origin.SYSTEM, Origin.THIRD_PARTY],
      default: Origin.SYSTEM,
    },
    price: { type: Number, required: true },
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    addOns: [{ type: Schema.Types.ObjectId, ref: "AddOn" }],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
