import Category from '../models/Category.js';

class CategoryService {
    constructor(db) {
        this.categoryModel = new Category(db);
    }

    async getAllCategories() {
        return await this.categoryModel.findAll();
    }

    async getCategoryById(id) {
        if (!id || isNaN(id)) {
            throw new Error('ID de categoría inválido');
        }
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new Error('Categoría no encontrada');
        }
        return category;
    }

    async createCategory(name) {
        if (!name || name.trim() === '') {
            throw new Error('El nombre de la categoría es requerido');
        }
        const categoryId = await this.categoryModel.create(name.trim());
        return await this.categoryModel.findById(categoryId);
    }

    async updateCategory(id, name) {
        if (!id || isNaN(id)) {
            throw new Error('ID de categoría inválido');
        }
        if (!name || name.trim() === '') {
            throw new Error('El nombre de la categoría es requerido');
        }
        const updated = await this.categoryModel.update(id, name.trim());
        if (!updated) {
            throw new Error('Categoría no encontrada');
        }
        return await this.categoryModel.findById(id);
    }

    async deleteCategory(id) {
        if (!id || isNaN(id)) {
            throw new Error('ID de categoría inválido');
        }
        const deleted = await this.categoryModel.delete(id);
        if (!deleted) {
            throw new Error('Categoría no encontrada');
        }
        return true;
    }
}

export default CategoryService;
