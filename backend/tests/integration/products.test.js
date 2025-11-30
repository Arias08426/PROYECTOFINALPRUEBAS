import request from 'supertest';
import createApp from '../../src/app.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Products API Integration Tests', () => {
    let app;
    let database;
    let categoryId;
    const testDbPath = path.join(__dirname, `test-products-${Date.now()}.db`);

    beforeAll(async () => {
        // Usar una base de datos de prueba única para este test suite
        const originalPath = process.env.DATABASE_PATH;
        process.env.DATABASE_PATH = testDbPath;
        const appData = await createApp();
        app = appData.app;
        database = appData.db;
        // Restaurar el path original para no afectar otros tests
        if (originalPath) {
            process.env.DATABASE_PATH = originalPath;
        } else {
            delete process.env.DATABASE_PATH;
        }
    });

    beforeEach(async () => {
        // Limpiar y recrear las tablas antes de cada test
        await database.run('DROP TABLE IF EXISTS products');
        await database.run('DROP TABLE IF EXISTS categories');

        // Recrear tablas
        await database.run(`
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

        await database.run(`
            CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                stock INTEGER NOT NULL,
                category_id INTEGER NOT NULL,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )
        `);

        // Insertar categoría de prueba
        const result = await database.run('INSERT INTO categories (name) VALUES (?)', ['Electrónicos']);
        categoryId = result.lastId;
    });

    afterAll(async () => {
        await database.close();
        // Eliminar la base de datos de prueba
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    describe('CRUD Operations', () => {
        test('debería crear, leer, actualizar y eliminar un producto', async () => {
            const newProduct = {
                name: 'Laptop',
                description: 'Laptop gaming',
                price: 999.99,
                stock: 10,
                category_id: categoryId // eslint-disable-line camelcase
            };

            const createResponse = await request(app)
                .post('/api/products')
                .send(newProduct)
                .expect(201);

            expect(createResponse.body).toHaveProperty('id');
            expect(createResponse.body).toHaveProperty('name', 'Laptop');
            const productId = createResponse.body.id;

            // READ - Leer producto
            const readResponse = await request(app)
                .get(`/api/products/${productId}`)
                .expect(200);

            expect(readResponse.body).toHaveProperty('id', productId);
            expect(readResponse.body).toHaveProperty('name', 'Laptop');
            expect(readResponse.body).toHaveProperty('price', 999.99);

            // UPDATE - Actualizar producto
            const updatedData = {
                name: 'Laptop Actualizada',
                description: 'Laptop gaming actualizada',
                price: 1299.99,
                stock: 5,
                category_id: categoryId // eslint-disable-line camelcase
            };

            const updateResponse = await request(app)
                .put(`/api/products/${productId}`)
                .send(updatedData)
                .expect(200);

            expect(updateResponse.body).toHaveProperty('name', 'Laptop Actualizada');
            expect(updateResponse.body).toHaveProperty('price', 1299.99);

            // DELETE - Eliminar producto
            await request(app)
                .delete(`/api/products/${productId}`)
                .expect(204);

            // Verificar que se eliminó
            await request(app)
                .get(`/api/products/${productId}`)
                .expect(404);
        });

        test('debería listar todos los productos', async () => {
            // Crear datos de prueba
            await request(app)
                .post('/api/products')
                .send({
                    name: 'Laptop',
                    description: 'Laptop gaming',
                    price: 899.99,
                    stock: 8,
                    category_id: categoryId // eslint-disable-line camelcase
                });

            await request(app)
                .post('/api/products')
                .send({
                    name: 'Mouse',
                    description: 'Mouse inalámbrico',
                    price: 799.99,
                    stock: 15,
                    category_id: categoryId // eslint-disable-line camelcase
                });

            // Obtener todos los productos
            const response = await request(app)
                .get('/api/products')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });
    });

    describe('Essential Validations', () => {
        test('debería rechazar producto sin datos requeridos', async () => {
            await request(app)
                .post('/api/products')
                .send({})
                .expect(400);
        });

        test('debería rechazar producto con precio negativo', async () => {
            await request(app)
                .post('/api/products')
                .send({
                    name: 'Producto Test',
                    price: -100,
                    stock: 10,
                    category_id: categoryId // eslint-disable-line camelcase
                })
                .expect(400);
        });

        test('debería rechazar producto con stock negativo', async () => {
            await request(app)
                .post('/api/products')
                .send({
                    name: 'Producto Test',
                    price: 100,
                    stock: -5,
                    category_id: categoryId // eslint-disable-line camelcase
                })
                .expect(400);
        });
    });
});
