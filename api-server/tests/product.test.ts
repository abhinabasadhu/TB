import { Request, Response } from 'express';
import { Ingredient } from '../src/models/ingredient.model';
import { Product } from '../src/models/product.model';
import * as ProductController from '../src/controllers/product.controller';
import sinon from 'sinon';

describe('Product Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: sinon.SinonStub;
    let send: sinon.SinonStub;

    // Set up the mock request and response objects before each test
    beforeEach(() => {
        req = {};
        send = sinon.stub(); 
        status = sinon.stub().returns({ send }); 
        res = { status, send } as unknown as Response;
    });

    // Restore the original methods after each test to avoid test leakage
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllProducts', () => {
        it('should return all products without filter', async () => {
            const mockProducts = [{ name: 'Coffee' }, { name: 'Tea' }];

            // Stub 'find' method to return mock products
            sinon.stub(Product, 'find').resolves(mockProducts as any);  

            await ProductController.getAllProducts(req as Request, res as Response);

            // Check if 'send' method was called with the mock products
            expect(send.calledWith(mockProducts)).toBe(true);
        });

        it('should return products filtered by origin', async () => {
            // Simulate query parameter for filtering
            req.query = { filter: 'system' };  
            const mockProducts = [{ name: 'Brazilian Coffee', origin: 'system' }];

            // Stub 'find' method to return filtered products
            sinon.stub(Product, 'find').resolves(mockProducts as any);  

            await ProductController.getAllProducts(req as Request, res as Response);

            // Check if 'send' method was called with the filtered mock products
            expect(send.calledWith(mockProducts)).toBe(true);
        });
    });

    describe('getProduct', () => {
        it('should return a single product by ID', async () => {
            req.params = { id: 'someProductId' };  // Simulate URL parameter for product ID
            const mockProduct = { _id: 'someProductId', name: 'Coffee' };
            sinon.stub(Product, 'findById').resolves(mockProduct as any);  // Stub 'findById' method to return a specific product

            await ProductController.getProduct(req as Request, res as Response);

            // Check if 'send' method was called with the mock product
            expect(send.calledWith(mockProduct)).toBe(true);
        });

        it('should return 404 if product is not found', async () => {
            // Simulate URL parameter for a non-existent product
            req.params = { id: 'nonexistentId' };  
            
            // Stub 'findById' method to return null
            sinon.stub(Product, 'findById').resolves(null);  

            await ProductController.getProduct(req as Request, res as Response);

            // Check if 'status' method was called with 404 and 'send' with an error message
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith({ message: "Product not found" })).toBe(true);
        });
    });

    describe('createProduct', () => {
        it('should create a new product and return it', async () => {
            req.body = {
                name: 'Latte',
                origin: 'Italy',
                ingredients: ['ingredient1', 'ingredient2'],
            };
            const mockIngredients = [
                { _id: 'ingredient1', name: 'Milk', quantity: { amount: 200, unit: 'ml' }, price: 1 },
                { _id: 'ingredient2', name: 'Coffee', quantity: { amount: 100, unit: 'grams' }, price: 2 },
            ];
            // Stub 'findById' for each ingredient to simulate their existence
            sinon.stub(Ingredient, 'findById')
                .onFirstCall().resolves(mockIngredients[0] as any)
                .onSecondCall().resolves(mockIngredients[1] as any);
            
            const mockProduct = {
                _id: 'newProductId',
                name: 'Latte',
                origin: 'Italy',
                ingredients: ['ingredient1', 'ingredient2'],
                characteristics: {
                    Milk: { amount: 200, unit: 'ml' },
                    Coffee: { amount: 100, unit: 'grams' }
                },
                price: 3,
            };
            // Stub 'create' method to return the new product
            sinon.stub(Product, 'create').resolves(mockProduct as any);  

            await ProductController.createProduct(req as Request, res as Response);

            // Check if 'send' method was called with the newly created product
            expect(send.calledWith(mockProduct)).toBe(true);
        });

        it('should return 400 if an ingredient does not exist', async () => {
            req.body = {
                name: 'Latte',
                origin: 'Italy',
                ingredients: ['nonexistentIngredient'],
            };
            // Stub 'findById' to return null for non-existent ingredient
            sinon.stub(Ingredient, 'findById').resolves(null); 

            await ProductController.createProduct(req as Request, res as Response);

            // Check if 'status' method was called with 400 and 'send' with an error message
            expect(status.calledWith(400)).toBe(true);
            expect(send.calledWith({ message: "Ingrdient does not exits" })).toBe(true);
        });

        it('should return 403 if ingredients are missing or invalid', async () => {
             // Missing ingredients
            req.body = { name: 'Latte', origin: 'system' }; 
            await ProductController.createProduct(req as Request, res as Response);

            // Check if 'status' method was called with 403 and 'send' with an error message
            expect(status.calledWith(403)).toBe(true);
            expect(send.calledWith("Missing Ingredients fields")).toBe(true);
        });
    });

    describe('editProduct', () => {
        it('should update an existing product and return it', async () => {
            // Simulate URL parameter for product ID
            req.params = { id: 'productId' };  
            req.body = {
                name: 'Espresso',
                ingredients: ['ingredient1', 'ingredient2'],
            };
            const mockProduct = {
                _id: 'productId',
                name: 'Latte',
                ingredients: ['ingredient1'],
                characteristics: {},
                price: 1,
                save: sinon.stub().resolves(),  // Stub the 'save' method to simulate successful save
            };
            const mockIngredients = [
                { _id: 'ingredient1', name: 'Milk', quantity: { amount: 200, unit: 'ml' }, price: 1 },
                { _id: 'ingredient2', name: 'Coffee', quantity: { amount: 100, unit: 'grams' }, price: 2 },
            ];
            // Stub 'findById' to return an existing product
            sinon.stub(Product, 'findById').resolves(mockProduct as any);  
            sinon.stub(Ingredient, 'findById')
                .onFirstCall().resolves(mockIngredients[0] as any)
                .onSecondCall().resolves(mockIngredients[1] as any);  // Stub 'findById' for ingredients

            await ProductController.editProduct(req as Request, res as Response);

            // Check if 'save' method was called once and 'send' method with the updated product
            expect(mockProduct.save.calledOnce).toBe(true);
            expect(send.calledWith(sinon.match({
                _id: 'productId',
                name: 'Espresso',
                price: 3,
            }))).toBe(true);
        });

        it('should return 404 if product is not found', async () => {
            // Simulate URL parameter for a non-existent product
            req.params = { id: 'nonexistentId' };  
            // Stub 'findById' to return null
            sinon.stub(Product, 'findById').resolves(null);  
            
            await ProductController.editProduct(req as Request, res as Response);

            // Check if 'status' method was called with 404 and 'send' with an error message
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith({ message: "Product not found" })).toBe(true);
        });

        it('should return 400 if an ingredient does not exist', async () => {
            req.params = { id: 'productId' };
            req.body = { ingredients: ['nonexistentIngredient'] };
            const mockProduct = {
                _id: 'productId',
                name: 'Latte',
                save: sinon.stub().resolves(),
            };
            // Stub 'findById' to return an existing product
            sinon.stub(Product, 'findById').resolves(mockProduct as any);

            // Stub 'findById' to return null for non-existent ingredient
            sinon.stub(Ingredient, 'findById').resolves(null);  

            await ProductController.editProduct(req as Request, res as Response);

            // Check if 'status' method was called with 400 and 'send' with an error message
            expect(status.calledWith(400)).toBe(true);
            expect(send.calledWith({ message: "Ingrdient does not exits" })).toBe(true);
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product and return it', async () => {
            // Simulate URL parameter for product ID
            req.params = { id: 'productId' };  
            // Stub 'deleteOne' method
            const mockProduct = { _id: 'productId', deleteOne: sinon.stub().resolves() };  

            // Stub 'findById' to return the product
            sinon.stub(Product, 'findById').resolves(mockProduct as any);  

            await ProductController.deleteProduct(req as Request, res as Response);

            // Check if 'deleteOne' method was called once and 'send' with the deleted product
            expect(mockProduct.deleteOne.calledOnce).toBe(true);
            expect(send.calledWith(mockProduct)).toBe(true);
        });

        it('should return 404 if product is not found', async () => {
            // Simulate URL parameter for a non-existent product
            req.params = { id: 'nonexistentId' };  
            // Stub 'findById' to return null
            sinon.stub(Product, 'findById').resolves(null);  

            await ProductController.deleteProduct(req as Request, res as Response);

            // Check if 'status' method was called with 404 and 'send' with an error message
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith({ message: "Product not found" })).toBe(true);
        });
    });
});
