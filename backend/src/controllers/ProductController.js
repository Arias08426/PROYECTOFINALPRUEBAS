import ProductService from '../services/ProductService.js';

class ProductController {
    constructor(db) {
        this.productService = new ProductService(db);
    }

    async getAll(req, res) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const product = await this.productService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async create(req, res) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const product = await this.productService.updateProduct(req.params.id, req.body);
            res.json(product);
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async delete(req, res) {
        try {
            await this.productService.deleteProduct(req.params.id);
            res.status(204).send();
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async getByCategory(req, res) {
        try {
            const products = await this.productService.getProductsByCategory(req.params.categoryId);
            res.json(products);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default ProductController;
