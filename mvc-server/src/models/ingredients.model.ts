import { Schema, model, Document } from "mongoose";

// Ingredient Interface
export interface IIngredient extends Document {
    name: string;
    quantity: number;
    unit: string;
    price: number;
}

// Ingredient Schema to define customizable parts of coffee
const ingredientSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., "ml", "g", "pack"
    price: { type: Number, required:true }
});

export const Ingredient = model<IIngredient>("AddOn", ingredientSchema);
