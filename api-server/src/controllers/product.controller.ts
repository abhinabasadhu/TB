import { Request, Response } from "express";
import { IProduct, Origin, Product } from "../models/product.model";
import { Types } from "mongoose";
import { Ingredient } from "../models/ingredient.model";

// list all products
export async function getAllProducts(req: Request, res: Response) {
    const { filter } = req.query;
    
    let products: IProduct[];

    if (filter !== 'default') {
        products = await Product.find({'origin': filter});
    } else {
        products = await Product.find({}); 
    }

    if (!filter) {
        products = await Product.find({}); 
    }
    
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
    const { name, origin, ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(403).send("Missing Ingredients fields");
    }

    if (!name) {
        res.status(400).send({
            message: "Please provide all required fields",
        });
        return;
    }
    let characteristics = {};
    let total = 0;
    let addOns = []
    for (const item of ingredients) {
        const ingredient = await Ingredient.findById(item);
        if (!ingredient) {
            res.status(400).send({
                message: "Ingrdient does not exits",
            });
            return;
        }
        characteristics[ingredient.name] = ingredient.quantity;
        total = total + ingredient.price;
    }
    const product = await Product.create(
        {
            name,
            origin,
            addOns,
            price: total,
            characteristics,
            ingredients
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

    if (req.body.ingredients) {
        product.ingredients = req.body.ingredients;
        let characteristics = {};
        let total = 0;
        for (const item of product.ingredients) {
            const ingredient = await Ingredient.findById(item);
            if (!ingredient) {
                res.status(400).send({
                    message: "Ingrdient does not exits",
                });
                return;
            }
            characteristics[ingredient.name] = ingredient.quantity;
            total = total + ingredient.price;
        }
        product.characteristics = characteristics;
        product.price = total;

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

