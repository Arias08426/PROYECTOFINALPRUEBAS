import { jest } from '@jest/globals';
import Category from '../../src/models/Category.js';

describe('Category Model', () => {
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
            const category = new Category(database);

            expect(typeof category.findAll).toBe('function');
            expect(typeof category.findById).toBe('function');
            expect(typeof category.create).toBe('function');
            expect(typeof category.update).toBe('function');
            expect(typeof category.delete).toBe('function');
        });
    });

    describe('CRUD Operations', () => {
        test('debería crear categoría correctamente', async () => {
            database.run.mockResolvedValue({ lastId: 1 });
            const category = new Category(database);

            const result = await category.create('Electrónicos');

            expect(database.run).toHaveBeenCalledWith(
                'INSERT INTO categories (name) VALUES (?)',
                ['Electrónicos']
            );
            expect(result).toBe(1);
        });

        test('debería obtener todas las categorías', async () => {
            const mockCategories = [
                { id: 1, name: 'Electrónicos' },
                { id: 2, name: 'Libros' }
            ];
            database.all.mockResolvedValue(mockCategories);
            const category = new Category(database);

            const result = await category.findAll();

            expect(database.all).toHaveBeenCalledWith('SELECT * FROM categories ORDER BY name');
            expect(result).toEqual(mockCategories);
        });
    });
});
