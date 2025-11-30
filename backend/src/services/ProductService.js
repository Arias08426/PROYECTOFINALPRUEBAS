import Product from '../models/Product.js';

class ProductService {
    constructor(db) {
        this.productModel = new Product(db);
    }

    async getAllProducts() {
        return await this.productModel.findAll();
    }

    async getProductById(id) {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto inválido');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async createProduct(productData) {
        this.validateProductData(productData);
        const productId = await this.productModel.create(productData);
        return await this.productModel.findById(productId);
    }

    async updateProduct(id, productData) {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto inválido');
        }
        this.validateProductData(productData);
        const updated = await this.productModel.update(id, productData);
        if (!updated) {
            throw new Error('Producto no encontrado');
        }
        return await this.productModel.findById(id);
    }

    async deleteProduct(id) {
        if (!id || isNaN(id)) {
            throw new Error('ID de producto inválido');
        }
        const deleted = await this.productModel.delete(id);
        if (!deleted) {
            throw new Error('Producto no encontrado');
        }
        return true;
    }

    async getProductsByCategory(categoryId) {
        if (!categoryId || isNaN(categoryId)) {
            throw new Error('ID de categoría inválido');
        }
        return await this.productModel.findByCategory(categoryId);
    }

    validateProductData(data) {
        if (!data.name || data.name.trim() === '') {
            throw new Error('El nombre del producto es requerido');
        }
        if (data.price === undefined || data.price === null || isNaN(data.price) || data.price < 0) {
            throw new Error('El precio debe ser un número válido y no negativo');
        }
        if (data.stock === undefined || data.stock === null || isNaN(data.stock) || data.stock < 0) {
            throw new Error('El stock debe ser un número válido y no negativo');
        }
        if (!data.category_id || isNaN(data.category_id)) {
            throw new Error('La categoría es requerida');
        }
    }
}

export default ProductService;
