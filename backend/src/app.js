import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from './database/database.js';
import createCategoryRouter from './routes/categories.js';
import createProductRouter from './routes/products.js';

async function createApp() {
    const app = express();

    const db = new Database();
    await db.connect();

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`); // eslint-disable-line no-console
        next();
    });

    app.get('/health', (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    });

    app.use('/api/categories', createCategoryRouter(db));
    app.use('/api/products', createProductRouter(db));

    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        console.error('Error:', err && err.stack ? err.stack : err); // eslint-disable-line no-console
        res.status(500).json({ error: err && err.message ? err.message : 'Error interno del servidor' });
    });

    app.use((req, res) => {
        res.status(404).json({ error: 'Endpoint no encontrado' });
    });

    return { app, db };
}

export default createApp;
