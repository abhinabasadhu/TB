import { Schema, model, Document } from "mongoose";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface IOrderSubItem extends Document {
  addOn: Schema.Types.ObjectId; // addoningredient
  quantity: number; //Quantity
  price: number; // price
}

export interface IOrderItem extends Document {
  coffee: Schema.Types.ObjectId; // Coffee product
  quantity: number; // Quantity of the coffee product
  price: number; // price
  addOns: IOrderSubItem[]; // List of AddOns in the order
}

// Interface for orders
export interface IOrder extends Document {
  orderId: string; // Identifiable order number for customers
  customerName: string; // Customer detail
  status: OrderStatus; // Pending or completed
  total: number; // Total amount of the order
  items: IOrderItem[]; // List of items in the order
}

// Define the schema for orders
const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      default: OrderStatus.PENDING,
      enum: [OrderStatus.PENDING, OrderStatus.COMPLETED],
    },
    items: [
      {
        type: {
          coffee: { type: Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number },
          price: { type: Number },
          addOns: [
            {
              type: {
                addOn: { type: Schema.Types.ObjectId, ref: "Ingredient" },
                quantity: { type: Number },
                price: { type: Number },
              },
            },
          ],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
