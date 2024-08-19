import { Schema, model, Document } from "mongoose";
// Enum for order status 
export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

// Interface for order addons
export interface IOrderSubItem extends Document {
  addOn: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

// Interface for order items/coffees
export interface IOrderItem extends Document {
  coffee: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  addOns: IOrderSubItem[];
}

// Interface for orders
export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  items: IOrderItem[];
}

// schema for orders
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
