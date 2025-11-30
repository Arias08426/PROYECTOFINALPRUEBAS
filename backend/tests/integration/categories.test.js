import request from 'supertest';
import createApp from '../../src/app.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Categories API Integration Tests', () => {
    let app;
    let database;
    const testDbPath = path.join(__dirname, `test-categories-${Date.now()}.db`);

    beforeAll(async () => {
        const originalPath = process.env.DATABASE_PATH;
        process.env.DATABASE_PATH = testDbPath;
        const appData = await createApp();
        app = appData.app;
        database = appData.db;
        if (originalPath) {
            process.env.DATABASE_PATH = originalPath;
        } else {
            delete process.env.DATABASE_PATH;
        }
    });

    beforeEach(async () => {
        await database.run('DROP TABLE IF EXISTS products');
        await database.run('DROP TABLE IF EXISTS categories');

        // Recrear tablas en orden correcto
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
    });

    afterAll(async () => {
        await database.close();
        if (fs.existsSync(testDbPath)) {
            fs.unlinkSync(testDbPath);
        }
    });

    describe('CRUD Operations', () => {
        test('debería crear, leer, actualizar y eliminar una categoría', async () => {
            const createResponse = await request(app)
                .post('/api/categories')
                .send({ name: 'Electrónicos' })
                .expect(201);

            expect(createResponse.body).toHaveProperty('id');
            expect(createResponse.body).toHaveProperty('name', 'Electrónicos');
            const categoryId = createResponse.body.id;

            // READ - Leer categoría
            const readResponse = await request(app)
                .get(`/api/categories/${categoryId}`)
                .expect(200);

            expect(readResponse.body).toHaveProperty('id', categoryId);
            expect(readResponse.body).toHaveProperty('name', 'Electrónicos');

            // UPDATE - Actualizar categoría
            const updateResponse = await request(app)
                .put(`/api/categories/${categoryId}`)
                .send({ name: 'Electrónicos Actualizados' })
                .expect(200);

            expect(updateResponse.body).toHaveProperty('name', 'Electrónicos Actualizados');

            // DELETE - Eliminar categoría
            await request(app)
                .delete(`/api/categories/${categoryId}`)
                .expect(204);

            // Verificar que se eliminó
            await request(app)
                .get(`/api/categories/${categoryId}`)
                .expect(404);
        });

        test('debería listar todas las categorías', async () => {
            // Crear datos de prueba
            await request(app)
                .post('/api/categories')
                .send({ name: 'Electrónicos' });

            await request(app)
                .post('/api/categories')
                .send({ name: 'Libros' });

            // Obtener todas las categorías
            const response = await request(app)
                .get('/api/categories')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });
    });

    describe('Essential Validations', () => {
        test('debería rechazar categoría sin nombre', async () => {
            await request(app)
                .post('/api/categories')
                .send({})
                .expect(400);
        });

        test('debería rechazar categoría con nombre duplicado', async () => {
            // Crear primera categoría
            await request(app)
                .post('/api/categories')
                .send({ name: 'Electrónicos' })
                .expect(201);

            // Intentar crear categoría duplicada
            await request(app)
                .post('/api/categories')
                .send({ name: 'Electrónicos' })
                .expect(400);
        });
    });
});
