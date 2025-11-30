import express from 'express';
import CategoryController from '../controllers/CategoryController.js';

function createCategoryRouter(db) {
    const router = express.Router();
    const categoryController = new CategoryController(db); // eslint-disable-line new-cap

    router.get('/', (req, res) => categoryController.getAll(req, res));
    router.get('/:id', (req, res) => categoryController.getById(req, res));
    router.post('/', (req, res) => categoryController.create(req, res));
    router.put('/:id', (req, res) => categoryController.update(req, res));
    router.delete('/:id', (req, res) => categoryController.delete(req, res));

    return router;
}

export default createCategoryRouter;
