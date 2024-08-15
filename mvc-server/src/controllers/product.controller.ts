import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { AddOn } from "../models/addOn.model";
import { Types } from "mongoose";

// list all products
export async function getAllProducts(req: Request, res: Response) {
    const products = await Product.find({});
    res.send(products);
}

// get one product
export async function getProduct(req: Request, res: Response) {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).send({ message: "Product not found" });
    }

    res.send(product);
}

// create a product
export async function createProduct(req: Request, res: Response) {
    const { name, description, price, addOns } = req.body;

    if (!name || !description || typeof price !== 'number') {
        res.status(400).send({
            message: "Please provide all required fields",
        });
        return;
    }

    const product = await Product.create(
        {
            name,
            description,
            price,
            addOns
        }
    );
    res.send(product);

}

// edit a product
export async function editProduct(req: Request, res: Response) {

    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404).send({ message: "Product not found" });
        return;
    }

    if (req.body.name) {
        product.name = req.body.name;
    }
    if (req.body.description) {
        product.description = req.body.description;
    }
    if (req.body.price) {
        product.price = req.body.price;
    }
    await product.save();
    
    res.send(product);
}

// delete a product
export async function deleteProduct(req: Request, res: Response) {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    await product.deleteOne({ _id: req.params.id });

    res.send(product);

}

// add addon to product
export async function addAddOnsToProduct(req: Request, res: Response) {
    const addOn = await AddOn.findById(req.params.addOnId);
    if(!addOn) {
        res.status(404).send({ message: "AddOn not found" });
        return;
    }
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
        res.status(404).send({ message: "Product not found" });
        return
    }

    product.addOns.push(addOn._id as Types.ObjectId);
    await product.save();
    res.send(product);
}

// remove addon from product
export async function removeAddOnsFromProduct(req: Request, res: Response) {
    try {
        // Find the add-on by ID
        const addOn = await AddOn.findById(req.params.addOnId);
        if (!addOn) {
            return res.status(404).send({ message: "AddOn not found" });
        }

        // Find the product by ID
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Remove the add-on from the product's addOns array
        product.addOns = product.addOns.filter(addOnItem => addOnItem._id.toString() !== addOn._id.toString());

        // Save the updated product
        await product.save();

        res.send(product);
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
}