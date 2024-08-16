import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { IOrderSubItem, IOrderItem, Order } from "../models/order.model";
import { Types } from "mongoose";
import { Ingredient } from "../models/ingredient.model";

// get all orders
export async function getAllOrders(req: Request, res: Response) {
  const orders = await Order.find({});

  res.send(orders);
}

// get one order
export async function getOrder(req: Request, res: Response) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.send("No Order Found");
    return;
  }
  res.send(order);
}

// create a order
export async function createOrder(req: Request, res: Response) {
  if (!req.body.items || !Array.isArray(req.body.items)) {
    return res.status(403).send("Missing required fields");
  }
  const orderId = Math.floor(Math.random() * 10000);
  let items: IOrderItem[];
  let subItems: IOrderSubItem[];
  let total = 0;

  try {
    items = req.body.items;
  } catch (err) {
    res.status(403).send("Items in a invalid format");
    return;
  }

  for (const item of items) {
    if (item.addOns.length) {
      try {
        subItems = item.addOns;
      } catch (err) {
        res.status(403).send("Items in a invalid format");
        return;
      }

      for (const addOn of subItems) {
        const dbAddOn = await Ingredient.findById(addOn.addOn);

        if (!dbAddOn) {
          res.status(404).send("Order AddOn item not found");
          return;
        }

        total = total + dbAddOn.price * item.quantity;
      }
    }

    const dbItem = await Product.findById(item.coffee);

    if (!dbItem) {
      res.status(404).send("Order item not found");
      return;
    }

    total = total + dbItem.price * item.quantity;
  }

  const order: any = await Order.create({
    orderId,
    items,
    total,
  });

  const newItems = [];
  const newSubItems = [];

  for (const item of order.items) {
    
    const newItem = await Product.findById(item.coffee);
    
    if (newItem) {
      newItems.push({
        item: newItem,
        quantity: item.quantity,
        price: item.price,
      });
    }
    
    if (item.addOns.length) {
      
      for (const addOn of item.addOns) {
        
        const newSubItem = await Ingredient.findById(item.coffee);
        
        if (newSubItem) {
          newSubItems.push({
            item: newSubItem,
            quantity: addOn.quantity,
            price: addOn.price,
          });
        }
      }
    }
    
    item.addOns = newSubItems;
  }
  order.items = newItems;
  
  return res.status(201).send(order);
}

// complete a order
export async function completeOrder(req: Request, res: Response) {
}

// delete a order
export async function deleteOrder(req: Request, res: Response) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.send("No Order Found");
    return;
  }
  await order.deleteOne({ _id: req.params.id });

  res.send(order);
}
