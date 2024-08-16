import { Schema, model, Document, Types } from "mongoose";
import { IIngredient } from "./ingredient.model";

export enum Origin {
  SYSTEM = 'system',
  THIRD_PARTY = 'third_party'
}


export interface IProduct extends Document {
  name: string;
  characteristics: object;
  origin: Origin;
  ingredients: IIngredient[];
  price: number;
  addOns: Types.ObjectId[];
}

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    characteristics: { type: Object, required: true },
    origin: {
      type: String,
      enum: [Origin.SYSTEM, Origin.THIRD_PARTY],
      default: Origin.SYSTEM,
    }, // Whether it's predefined or from an external source
    price: { type: Number, required: true },
    ingredients: [{ type: Schema.Types.ObjectId, ref: "Ingredient" }],
    addOns: [{ type: Schema.Types.ObjectId, ref: "AddOn" }],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
