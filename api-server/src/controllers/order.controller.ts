import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
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
  const { items, customerName } = req.body;

  if (!items || !Array.isArray(items) || !customerName) {
    return res.status(403).send("Missing required fields");
  }

  const orderId = Math.floor(Math.random() * 10000);
  let total = 0;
  let formattedItems = [];

  try {
    for (const item of items) {
      const dbItem = await Product.findById(item._id);

      if (!dbItem) {
        return res.status(404).send(`Order item with id ${item._id} not found`);
      }

      let formattedAddOns = [];
      if (item.addOns && Array.isArray(item.addOns)) {
        for (const addOnId of item.addOns) {
          const dbAddOn = await Ingredient.findById(addOnId);

          if (!dbAddOn) {
            return res
              .status(404)
              .send(`Order add-on with id ${addOnId} not found`);
          }

          total += dbAddOn.price * item.quantity;
          formattedAddOns.push({
            addOn: addOnId,
            price: dbAddOn.price,
            quantity: item.quantity,
          });
        }
      }

      total += dbItem.price * item.quantity;
      formattedItems.push({
        coffee: dbItem._id,
        quantity: item.quantity,
        price: dbItem.price,
        addOns: formattedAddOns,
      });
    }


    const order = await Order.create({
      customerName,
      orderId,
      items: formattedItems,
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
  } catch (e) {
    console.error("Error processing order:", e);
    return res.status(500).send("Internal server error");
  }
}

// complete a order
export async function completeOrder(req: Request, res: Response) {}

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
