import { Schema, model, Document } from "mongoose";

export interface IAddOn extends Document {
  name: string;
  description: string;
  price: number; 
}

const addOnSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export const AddOn = model<IAddOn>("AddOn", addOnSchema);
