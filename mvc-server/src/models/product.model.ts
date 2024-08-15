import { Schema, model, Document, Types} from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  addOns: Types.ObjectId[];
}

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    addOns: [{ type: Schema.Types.ObjectId, ref: 'AddOn' }],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
