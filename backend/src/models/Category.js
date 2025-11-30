class Category {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        const sql = 'SELECT * FROM categories ORDER BY name';
        return await this.db.all(sql);
    }

    async findById(id) {
        const sql = 'SELECT * FROM categories WHERE id = ?';
        return await this.db.get(sql, [id]);
    }

    async create(name) {
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        const result = await this.db.run(sql, [name]);
        return result.lastId;
    }

    async update(id, name) {
        const sql = 'UPDATE categories SET name = ? WHERE id = ?';
        const result = await this.db.run(sql, [name, id]);
        return result.changes > 0;
    }

    async delete(id) {
        const sql = 'DELETE FROM categories WHERE id = ?';
        const result = await this.db.run(sql, [id]);
        return result.changes > 0;
    }
}

export default Category;
