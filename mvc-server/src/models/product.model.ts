import { Schema, model, Document, Types} from "mongoose";
import {IIngredient} from "./ingredients.model";

export interface IProduct extends Document {
  name: string;
  characteristics: string;
  origin: 'system' | 'third-party';
  ingredients: IIngredient[];
  price: number;
  addOns: Types.ObjectId[];
}

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    characteristics: { type: String, required: true },
    origin: { type: String, enum: ['system', 'third-party'], default: 'system' }, // Whether it's predefined or from an external source
    price: { type: Number, required: true },
    addOns: [{ type: Schema.Types.ObjectId, ref: 'AddOn' }],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
