import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { AddOn } from "../models/addOn.model";
import { Order } from "../models/order.model";

// get all orders
export async function getAllOrders(req:Request, res:Response) {
    const orders = await Order.find({});
    res.send(orders);
}

// get one order
export async function getOrder(req:Request, res:Response) {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.send('No Order Found');
        return
    }
    res.send(order);
}

// create a order
export async function createOrder(req:Request, res:Response) {
    
    
}

// edit a order
export async function editOrder(req:Request, res:Response) {

}

// delete a order
export async function deleteOrder(req:Request, res:Response) {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.send('No Order Found');
        return
    }
    await order.deleteOne({ _id: req.params.id });

    res.send(order);
}