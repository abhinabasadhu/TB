import { Request, Response } from 'express';
import { Ingredient } from '../src/models/ingredient.model';
import { Product } from '../src/models/product.model';
import * as IngredientController from '../src/controllers/ingredient.controller';
import sinon from 'sinon';

describe('Ingredient Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: sinon.SinonStub;
    let send: sinon.SinonStub;
    
    beforeEach(() => {
        // Set up request and response objects with stubs before each test
        req = {};
        send = sinon.stub();
        status = sinon.stub().returns({ send });
        res = { status, send } as unknown as Response;
    });

    afterEach(() => {
        // Restore original methods after each test
        sinon.restore();
    });

    describe('getAllIngredients', () => {
        it('should return all ingredients', async () => {
            // Mock data and stub the Ingredient.find method
            const mockIngredients = [{ name: 'Salt' }, { name: 'Sugar' }];
            sinon.stub(Ingredient, 'find').resolves(mockIngredients as any);

            // Call the controller method
            await IngredientController.getAllIngredients(req as Request, res as Response);

            // Assert that send was called with the expected data
            expect(send.calledWith(mockIngredients)).toBe(true);
        });
    });

    describe('getIngredient', () => {
        it('should return a single ingredient by ID', async () => {
            // Mock request parameters and data
            req.params = { id: 'someId' };
            const mockIngredient = { _id: 'someId', name: 'Salt' };
            sinon.stub(Ingredient, 'findById').resolves(mockIngredient as any);

            // Call the controller method
            await IngredientController.getIngredient(req as Request, res as Response);

            // Assert that send was called with the correct ingredient
            expect(send.calledWith(mockIngredient)).toBe(true);
        });
    });

    describe('createIngredient', () => {
        it('should create a new ingredient and return it', async () => {
            // Prepare mock request body
            req.body = {
                name: 'Salt',
                quantity: { amount: 100, unit: 'grams' },
                price: 1.5,
            };
            const mockIngredient = { _id: 'newId', ...req.body };
            sinon.stub(Ingredient, 'create').resolves(mockIngredient as any);

            // Call the controller method
            await IngredientController.createIngredient(req as Request, res as Response);

            // Assert that send was called with the newly created ingredient
            expect(send.calledWith(mockIngredient)).toBe(true);
        });

        it('should return 400 if required fields are missing', async () => {
            // Missing 'unit' and 'price' fields in the request body
            req.body = { name: 'Salt', quantity: { amount: 100 } };

            // Call the controller method
            await IngredientController.createIngredient(req as Request, res as Response);

            // Assert that the response status is 400 and the correct error message is sent
            expect(status.calledWith(400)).toBe(true);
            expect(send.calledWith({ message: 'Please provide all required fields' })).toBe(true);
        });
    });

    describe('editIngredient', () => {
        it('should return 404 if ingredient not found', async () => {
            // Mock request parameters with a non-existent ID
            req.params = { id: 'nonexistentId' };
            sinon.stub(Ingredient, 'findById').resolves(null);

            // Call the controller method
            await IngredientController.editIngredient(req as Request, res as Response);

            // Assert that the response status is 404 and the correct error message is sent
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith({ message: 'Ingredient not found' })).toBe(true);
        });
    });

    describe('deleteIngredient', () => {
        it('should delete an existing ingredient and return it', async () => {
            // Mock request parameters and ingredient data
            req.params = { id: 'someId' };
            const mockIngredient = { _id: 'someId', deleteOne: sinon.stub().resolves() };
            sinon.stub(Ingredient, 'findById').resolves(mockIngredient as any);
            sinon.stub(Product, 'find').resolves([]);  // Mock no products using the ingredient

            // Call the controller method
            await IngredientController.deleteIngredient(req as Request, res as Response);

            // Assert that the ingredient's delete method was called and send was called with the ingredient
            expect(mockIngredient.deleteOne.calledOnce).toBe(true);
            expect(send.calledWith(mockIngredient)).toBe(true);
        });

        it('should return 404 if ingredient not found', async () => {
            // Mock request parameters with a non-existent ID
            req.params = { id: 'nonexistentId' };
            sinon.stub(Ingredient, 'findById').resolves(null);

            // Call the controller method
            await IngredientController.deleteIngredient(req as Request, res as Response);

            // Assert that the response status is 404 and the correct error message is sent
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith({ message: 'Ingredient not found' })).toBe(true);
        });

        it('should return 403 if ingredient is used in a product', async () => {
            // Mock request parameters and ingredient data
            req.params = { id: 'someId' };
            const mockIngredient = { _id: 'someId' };
            sinon.stub(Ingredient, 'findById').resolves(mockIngredient as any);
            sinon.stub(Product, 'find').resolves([{ ingredients: ['someId'] }] as any);  // Mock a product using the ingredient

            // Call the controller method
            await IngredientController.deleteIngredient(req as Request, res as Response);

            // Assert that the response status is 403 and the correct error message is sent
            expect(status.calledWith(403)).toBe(true);
            expect(send.calledWith({ message: 'Can not be deleted ingredient is included in some coffees' })).toBe(true);
        });
    });
});
