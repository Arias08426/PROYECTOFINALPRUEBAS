import { jest } from '@jest/globals';
import Product from '../../src/models/Product.js';

describe('Product Model', () => {
    let database;

    beforeEach(() => {
        database = {
            all: jest.fn(),
            get: jest.fn(),
            run: jest.fn()
        };
    });

    describe('Model Methods', () => {
        test('debería tener métodos esenciales', () => {
            const product = new Product(database);

            expect(typeof product.findAll).toBe('function');
            expect(typeof product.findById).toBe('function');
            expect(typeof product.create).toBe('function');
            expect(typeof product.update).toBe('function');
            expect(typeof product.delete).toBe('function');
            expect(typeof product.findByCategory).toBe('function');
        });
    });

    describe('CRUD Operations', () => {
        test('debería crear producto correctamente', async () => {
            database.run.mockResolvedValue({ lastId: 1 });
            const product = new Product(database);

            const productData = {
                name: 'Laptop',
                description: 'Laptop gaming',
                price: 999.99,
                stock: 10,
                category_id: 1 // eslint-disable-line camelcase
            };

            const result = await product.create(productData);

            expect(database.run).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO products'),
                ['Laptop', 'Laptop gaming', 999.99, 10, 1]
            );
            expect(result).toBe(1);
        });

        test('debería obtener todos los productos', async () => {
            const mockProducts = [
                { id: 1, name: 'Laptop', price: 999.99, stock: 10, categoryId: 1 }, // eslint-disable-line camelcase
                { id: 2, name: 'Mouse', price: 29.99, stock: 50, categoryId: 1 } // eslint-disable-line camelcase
            ];
            database.all.mockResolvedValue(mockProducts);
            const product = new Product(database);

            const result = await product.findAll();

            expect(database.all).toHaveBeenCalledWith(
                expect.stringContaining('SELECT p.*, c.name as category_name')
            );
            expect(result).toEqual(mockProducts);
        });
    });
});
