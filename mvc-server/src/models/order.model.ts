import { Schema, model, Document } from "mongoose";
import { IProduct } from "./product.model";
import { IAddOn } from "./addOn.model";


export interface IOrderItem extends Document {
  coffee: IProduct; // Coffee product
  quantity: number; // Quantity of the coffee product
  addOns: {
    addOn: IAddOn; // Add-on
    quantity: number; // Quantity of this add-on
  }[];
}


// Interface for orders
export interface IOrder extends Document {
  customerName: string;
  total: number; // Total amount of the order
  items: IOrderItem[]; // List of items in the order
}

// Define the schema for orders
const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    total: { type: Number, required: true },
    items: [{ type: Object, ref: "OrderItem" }], // Reference to order items
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);