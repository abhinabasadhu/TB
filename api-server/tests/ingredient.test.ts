import request = require("supertest");
import express from "express";
import mongoose from "mongoose";
import { Ingredient } from "../src/models/ingredient.model";
import { Product } from "../src/models/product.model";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as dotenv from 'dotenv';

dotenv.config();


const app = express();
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Ingredient API", () => {
    let ingredientId: string;
    let ingredientData: any;
    
    test('GET /api/ingredient/ should return all ingredients', async () => {
        // Create a test ingredient
        const responseItem = await Ingredient.create({
            name: 'Test Ingredient',
            quantity: {
                amount: 2,
                unit: 'ml',
            },
            price: 1.99,
        });
        
        ingredientId = `${responseItem._id}`;
        ingredientData = responseItem;

        const response = await request(app).get('/api/ingredient/').expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0); // Adjust based on your seed data
    });

    test('GET /api/ingredient/:id should return a single ingredient', async () => {
        const response = await request(app).get(`/api/ingredient/${ingredientId}`).expect(200);
        expect(response.body).toHaveProperty('_id', ingredientId);
        expect(response.body).toHaveProperty('name', ingredientData.name);
    });

    test('POST /api/ingredient/ should create a new ingredient', async () => {
        const newIngredient = {
            name: 'Salt',
            quantity: { amount: 300, unit: 'grams' },
            price: 1.5,
        };
        
        const response = await request(app).post('/api/ingredient/').send(newIngredient).expect(200);
        expect(response.body).toHaveProperty('name', newIngredient.name);
        expect(response.body).toHaveProperty('quantity', newIngredient.quantity);
        expect(response.body).toHaveProperty('price', newIngredient.price);
    });

    test('PUT /api/ingredient/:id should update an existing ingredient', async () => {
        const updatedData = {
            name: 'Brown Sugar',
            quantity: { amount: 600, unit: 'grams' },
            price: 3.0,
        };

        const response = await request(app).put(`/api/ingredient/${ingredientId}`).send(updatedData).expect(200);
        expect(response.body).toHaveProperty('name', updatedData.name);
        expect(response.body).toHaveProperty('quantity', updatedData.quantity);
        expect(response.body).toHaveProperty('price', updatedData.price);
    });

    test('DELETE /api/ingredient/:id should delete an ingredient', async () => {
        const response = await request(app).delete(`/api/ingredient/${ingredientId}`).expect(200);
        expect(response.body).toHaveProperty('_id', ingredientId);
        
        // Ensure the ingredient has been deleted
        const deletedIngredient = await Ingredient.findById(ingredientId);
        expect(deletedIngredient).toBeNull();
    });

    test('DELETE /api/ingredient/:id should return 403 if ingredient is used in product', async () => {
        // Create a product that references the ingredient
        await Product.create({ name: 'Coffee', ingredients: [ingredientId], price:'0.88' });

        const response = await request(app).delete(`/api/ingredient/${ingredientId}`).expect(403);
        expect(response.body).toHaveProperty('message', 'Can not be deleted ingredient is included in some coffees');
    });

    test('POST /api/ingredient/ should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/api/ingredient/').send({
            name: 'Honey',
            quantity: { amount: 250 }, // Missing unit and price
        }).expect(400);
        
        expect(response.body).toHaveProperty('message', 'Please provide all required fields');
    });
});
