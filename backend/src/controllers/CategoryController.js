import CategoryService from '../services/CategoryService.js';

class CategoryController {
    constructor(db) {
        this.categoryService = new CategoryService(db);
    }

    async getAll(req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const category = await this.categoryService.getCategoryById(req.params.id);
            res.json(category);
        } catch (error) {
            if (error.message === 'Categoría no encontrada') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async create(req, res) {
        try {
            const category = await this.categoryService.createCategory(req.body && req.body.name);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const category = await this.categoryService.updateCategory(req.params.id, req.body.name);
            res.json(category);
        } catch (error) {
            if (error.message === 'Categoría no encontrada') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async delete(req, res) {
        try {
            await this.categoryService.deleteCategory(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Categoría no encontrada') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }
}

export default CategoryController;
