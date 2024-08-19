import { Request, Response } from 'express';
import { Ingredient } from '../src/models/ingredient.model';
import { Product } from '../src/models/product.model';
import { Order } from '../src/models/order.model';
import * as OrderController from '../src/controllers/order.controller';
import sinon from 'sinon';

describe('Order Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: sinon.SinonStub;
    let send: sinon.SinonStub;

    beforeEach(() => {
        // Set up mock request and response objects
        req = {};
        send = sinon.stub();
        status = sinon.stub().returns({ send });
        res = { status, send } as unknown as Response;
    });

    afterEach(() => {
        // Restore original methods after each test
        sinon.restore();
    });

    describe('getAllOrders', () => {
        it('should return all orders', async () => {
            // Mock data for orders and stub the Order.find method
            const mockOrders = [{ orderId: 1, customerName: 'John' }, { orderId: 2, customerName: 'Doe' }];
            sinon.stub(Order, 'find').resolves(mockOrders as any);

            // Call the controller method
            await OrderController.getAllOrders(req as Request, res as Response);

            // Assert that send was called with the expected orders
            expect(send.calledWith(mockOrders)).toBe(true);
        });
    });

    describe('getOrder', () => {
        it('should return an order by ID', async () => {
            // Mock request parameters and order data
            req.params = { id: 'orderId' };
            const mockOrder = { orderId: 'orderId', customerName: 'John' };
            sinon.stub(Order, 'findById').resolves(mockOrder as any);

            // Call the controller method
            await OrderController.getOrder(req as Request, res as Response);

            // Assert that send was called with the correct order
            expect(send.calledWith(mockOrder)).toBe(true);
        });

        it('should return a message if order is not found', async () => {
            // Mock request parameters with a non-existent order ID
            req.params = { id: 'nonexistentOrderId' };
            sinon.stub(Order, 'findById').resolves(null);

            // Call the controller method
            await OrderController.getOrder(req as Request, res as Response);

            // Assert that the correct message is sent if the order is not found
            expect(send.calledWith("No Order Found")).toBe(true);
        });
    });

    describe('createOrder', () => {
        it('should create an order and return it', async () => {
            // Prepare mock request body
            req.body = {
                customerName: 'John Doe',
                items: [
                    { _id: 'productId1', quantity: 2, addOns: ['addOnId1'] },
                    { _id: 'productId2', quantity: 1 }
                ]
            };

            // Mock product and add-on data
            const mockProduct1 = { _id: 'productId1', price: 5 };
            const mockProduct2 = { _id: 'productId2', price: 3 };
            const mockAddOn = { _id: 'addOnId1', price: 1 };

            // Stub the Product and Ingredient findById methods
            sinon.stub(Product, 'findById')
                .onFirstCall().resolves(mockProduct1 as any)
                .onSecondCall().resolves(mockProduct2 as any);
            sinon.stub(Ingredient, 'findById').resolves(mockAddOn as any);

            // Stub the Order.create method to simulate order creation
            sinon.stub(Order, 'create').resolves({
                _id: 'orderId',
                customerName: 'John Doe',
                orderId: 1234,
                items: [
                    {
                        coffee: 'productId1',
                        quantity: 2,
                        price: 5,
                        addOns: [{ addOn: 'addOnId1', price: 1, quantity: 2 }]
                    },
                    {
                        coffee: 'productId2',
                        quantity: 1,
                        price: 3,
                        addOns: []
                    }
                ],
                total: 15
            } as any);

            // Call the controller method
            await OrderController.createOrder(req as Request, res as Response);

            // Assert that the response status is 201 (created)
            expect(status.calledWith(201)).toBe(true);
        });

        it('should return 403 if required fields are missing', async () => {
            // Mock request body with missing 'items' field
            req.body = {
                customerName: 'John Doe',
                // Missing items
            };

            // Call the controller method
            await OrderController.createOrder(req as Request, res as Response);

            // Assert that the response status is 403 and the correct error message is sent
            expect(status.calledWith(403)).toBe(true);
            expect(send.calledWith("Missing required fields")).toBe(true);
        });

        it('should return 404 if a product in the order is not found', async () => {
            // Mock request body with a non-existent product ID
            req.body = {
                customerName: 'John Doe',
                items: [{ _id: 'nonexistentProductId', quantity: 2 }]
            };
            sinon.stub(Product, 'findById').resolves(null);

            // Call the controller method
            await OrderController.createOrder(req as Request, res as Response);

            // Assert that the response status is 404 and the correct error message is sent
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith('Order item with id nonexistentProductId not found')).toBe(true);
        });

        it('should return 404 if an add-on in the order is not found', async () => {
            // Mock request body with a non-existent add-on ID
            req.body = {
                customerName: 'John Doe',
                items: [
                    { _id: 'productId1', quantity: 2, addOns: ['nonexistentAddOnId'] }
                ]
            };

            const mockProduct1 = { _id: 'productId1', price: 5 };
            sinon.stub(Product, 'findById').resolves(mockProduct1 as any);
            sinon.stub(Ingredient, 'findById').resolves(null);

            // Call the controller method
            await OrderController.createOrder(req as Request, res as Response);

            // Assert that the response status is 404 and the correct error message is sent
            expect(status.calledWith(404)).toBe(true);
            expect(send.calledWith('Order add-on with id nonexistentAddOnId not found')).toBe(true);
        });
    });

    describe('deleteOrder', () => {
        it('should delete an order and return it', async () => {
            // Mock request parameters and order data
            req.params = { id: 'orderId' };
            const mockOrder = { _id: 'orderId', deleteOne: sinon.stub().resolves() };
            sinon.stub(Order, 'findById').resolves(mockOrder as any);

            // Call the controller method
            await OrderController.deleteOrder(req as Request, res as Response);

            // Assert that the order's delete method was called and send was called with the order
            expect(mockOrder.deleteOne.calledOnce).toBe(true);
            expect(send.calledWith(mockOrder)).toBe(true);
        });

        it('should return a message if order is not found', async () => {
            // Mock request parameters with a non-existent order ID
            req.params = { id: 'nonexistentOrderId' };
            sinon.stub(Order, 'findById').resolves(null);

            // Call the controller method
            await OrderController.deleteOrder(req as Request, res as Response);

            // Assert that the correct message is sent if the order is not found
            expect(send.calledWith("No Order Found")).toBe(true);
        });
    });
});
