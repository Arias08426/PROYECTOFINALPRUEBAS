class Product {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `;
        return await this.db.all(sql);
    }

    async findById(id) {
        const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
        return await this.db.get(sql, [id]);
    }

    async create(productData) {
        // eslint-disable-next-line camelcase
        const { name, description, price, stock, category_id: categoryId } = productData;
        const sql = `
      INSERT INTO products (name, description, price, stock, category_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
        const result = await this.db.run(sql, [name, description, price, stock, categoryId]);
        return result.lastId;
    }

    async update(id, productData) {
        // eslint-disable-next-line camelcase
        const { name, description, price, stock, category_id: categoryId } = productData;
        const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
      WHERE id = ?
    `;
        const result = await this.db.run(sql, [name, description, price, stock, categoryId, id]);
        return result.changes > 0;
    }

    async delete(id) {
        const sql = 'DELETE FROM products WHERE id = ?';
        const result = await this.db.run(sql, [id]);
        return result.changes > 0;
    }

    async findByCategory(categoryId) {
        const sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p.name
    `;
        return await this.db.all(sql, [categoryId]);
    }
}

export default Product;
