import { Request, Response } from "express";
import { Ingredient } from "../models/ingredient.model";

// list all ingredients
export async function getAllIngredients(req: Request, res: Response) {
    const ingredients = await Ingredient.find({});
    res.send(ingredients);
}
// get a ingredient
export async function getIngredient(req: Request, res: Response) {
    const ingredient = await Ingredient.findById(req.params.id);
    res.send(ingredient);
}
// create a ingredient
export async function createIngredient(req: Request, res: Response) {
    const {name, quantity, price} = req.body.data;

    if (!name || !quantity.amount || !quantity.unit || !price) {
        res.status(400).send({
            message: "Please provide all required fields",
        });
        return;    
    }
    const ingredient = await Ingredient.create(
        {
            name,
            quantity,
            price
        }
    );
    res.send(ingredient);
}
// edit a ingredient
export async function editIngredient(req: Request, res: Response) {
    const ingredient = await Ingredient.findById(req.params.id);
    
    if (!ingredient) {
        res.status(404).send({ message: "Ingredient not found" });
        return;
    }

    const {name, quantity, price} = req.body.data;

    if (name) {
        ingredient.name = name;
    }
    if (quantity.amount && quantity.unit) {
        ingredient.quantity = quantity;
    }
    if (price) {
        ingredient.price = price;
    }
    await ingredient.save();
    
    return res.send(ingredient);
}
// delete a ingredient
export async function deleteIngredient(req: Request, res: Response) {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      res.status(404).send({ message: "Ingredient not found" });
      return;
    }

    await ingredient.deleteOne({ _id: req.params.id });;

    res.send(ingredient);
}

