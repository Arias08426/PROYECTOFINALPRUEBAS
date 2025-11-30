import express from 'express';
import ProductController from '../controllers/ProductController.js';

function createProductRouter(db) {
    const router = express.Router();
    const productController = new ProductController(db); // eslint-disable-line new-cap

    router.get('/', (req, res) => productController.getAll(req, res));
    router.get('/:id', (req, res) => productController.getById(req, res));
    router.post('/', (req, res) => productController.create(req, res));
    router.put('/:id', (req, res) => productController.update(req, res));
    router.delete('/:id', (req, res) => productController.delete(req, res));
    router.get('/category/:categoryId', (req, res) => productController.getByCategory(req, res));

    return router;
}

export default createProductRouter;
